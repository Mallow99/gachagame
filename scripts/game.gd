extends Node
## Game state (autoload "Game"): currencies, collection, gacha rolls, battles, saving.
## Pure data and rules. Screens read from here and listen to `changed`; nothing in
## this file touches UI, which keeps an online mode possible later.

signal changed
signal toast(text: String)

const SAVE_PATH := "user://save.json"

const PULL_COST := 100
const SSR_RATE := 0.03
const SR_RATE := 0.15
const SOFT_PITY := 50 # SSR odds start climbing after this many pulls without one
const HARD_PITY := 70 # guaranteed SSR on this pull
const SR_PITY := 10 # guaranteed SR-or-better every 10 pulls

const IDLE_GEMS_PER_MIN := 3.0
const OFFLINE_GEMS_PER_MIN := 1.0
const OFFLINE_CAP_MIN := 480.0
const DAILY_GEMS := 500

const MAX_ASC := 5
const MAX_PARTY := 3

const CLASSES := {
	"Warrior": {"hp": 120, "atk": 16, "def": 12, "spd": 8},
	"Mage": {"hp": 80, "atk": 26, "def": 5, "spd": 10},
	"Rogue": {"hp": 90, "atk": 20, "def": 7, "spd": 15},
	"Cleric": {"hp": 100, "atk": 14, "def": 9, "spd": 9},
	"Ranger": {"hp": 95, "atk": 19, "def": 7, "spd": 12},
}
const CLASS_BLURB := {
	"Warrior": "Tanky. Soaks hits so others don't have to.",
	"Mage": "Hits the hardest. Folds like paper.",
	"Rogue": "Goes for the weakest foe. Crits a lot.",
	"Cleric": "Heals whoever's hurting most.",
	"Ranger": "Fast and steady, with a decent crit.",
}
const RARITY_MULT := {3: 1.0, 4: 1.3, 5: 1.7}

const ROSTER := [
	{"id": "aurelia", "name": "Aurelia Dawnblade", "rarity": 5, "cls": "Warrior", "color": "#ffcc33"},
	{"id": "vex", "name": "Vex the Unbound", "rarity": 5, "cls": "Mage", "color": "#b04cff"},
	{"id": "kiri", "name": "Kiri Nightstep", "rarity": 5, "cls": "Rogue", "color": "#3dd6c8"},
	{"id": "oriel", "name": "Saint Oriel", "rarity": 5, "cls": "Cleric", "color": "#fff3a0"},
	{"id": "juno", "name": "Juno Skypiercer", "rarity": 5, "cls": "Ranger", "color": "#66e070"},
	{"id": "brakka", "name": "Brakka Ironjaw", "rarity": 4, "cls": "Warrior", "color": "#c0623a"},
	{"id": "thorne", "name": "Thorne", "rarity": 4, "cls": "Warrior", "color": "#8c8cac"},
	{"id": "lumen", "name": "Lumen", "rarity": 4, "cls": "Mage", "color": "#6fa8ff"},
	{"id": "grimble", "name": "Grimble", "rarity": 4, "cls": "Mage", "color": "#9a7aff"},
	{"id": "pip", "name": "Pip Quickfingers", "rarity": 4, "cls": "Rogue", "color": "#e07ab8"},
	{"id": "marisol", "name": "Sister Marisol", "rarity": 4, "cls": "Cleric", "color": "#f0e6d0"},
	{"id": "fen", "name": "Fen Mossbow", "rarity": 4, "cls": "Ranger", "color": "#7cab4a"},
	{"id": "bob", "name": "Bob", "rarity": 3, "cls": "Warrior", "color": "#c9a27a"},
	{"id": "chad", "name": "Chad", "rarity": 3, "cls": "Warrior", "color": "#e09a6a"},
	{"id": "dave", "name": "Dave the Wizard", "rarity": 3, "cls": "Mage", "color": "#7e8fd1"},
	{"id": "steve", "name": "Stevebeard", "rarity": 3, "cls": "Mage", "color": "#a0a0b8"},
	{"id": "pete", "name": "Sneaky Pete", "rarity": 3, "cls": "Rogue", "color": "#8a6f9e"},
	{"id": "moth", "name": "Moth Boy", "rarity": 3, "cls": "Rogue", "color": "#b8b29a"},
	{"id": "gary", "name": "Brother Gary", "rarity": 3, "cls": "Cleric", "color": "#d6c7a1"},
	{"id": "nana", "name": "Nana Potts", "rarity": 3, "cls": "Cleric", "color": "#e6b8c8"},
	{"id": "archie", "name": "Archie", "rarity": 3, "cls": "Ranger", "color": "#a3b86c"},
	{"id": "twig", "name": "Twig", "rarity": 3, "cls": "Ranger", "color": "#9ac078"},
]
const ENEMIES := [
	["Slime", "#6fe08a"],
	["Goblin", "#9bc53d"],
	["Bat", "#8a6fbf"],
	["Skeleton", "#e8e4d8"],
	["Imp", "#ff6b6b"],
	["Mushroom Guy", "#d08a5a"],
]
const BOSSES := [
	["King Slime", "#3ddc84"],
	["Goblin Warlord", "#7da03a"],
	["Bone Dragon", "#d8d0c0"],
	["Lich", "#7b5cff"],
	["Final Boss (Probably)", "#ff3b6b"],
]

var gems := 1600
var gold := 500
var pity_ssr := 0
var pity_sr := 0
var stage := 1
var owned := {} # id -> {"lvl": int, "asc": int}
var party: Array = [] # up to MAX_PARTY hero ids
var total_pulls := 0
var muted := true
var last_seen := 0
var last_daily := ""

var _by_id := {}
var _idle := 0.0
var _autosave := 0.0
var _rng := RandomNumberGenerator.new()


func _ready() -> void:
	_rng.randomize()
	for d in ROSTER:
		_by_id[d["id"]] = d
	load_game()


func _process(delta: float) -> void:
	_idle += delta * IDLE_GEMS_PER_MIN / 60.0
	if _idle >= 1.0:
		var g := int(_idle)
		_idle -= g
		gems += g
		changed.emit()
	_autosave += delta
	if _autosave > 30.0:
		_autosave = 0.0
		save_game()


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		save_game()


## Called once the UI is listening: offline gems, daily bonus, welcome message.
func welcome() -> void:
	var now := int(Time.get_unix_time_from_system())
	if last_seen == 0:
		toast.emit("Welcome! Here's %d gems. Go pull." % gems)
	else:
		var mins := minf((now - last_seen) / 60.0, OFFLINE_CAP_MIN)
		var g := int(mins * OFFLINE_GEMS_PER_MIN)
		if g > 0:
			gems += g
			toast.emit("While you were away: +%d gems" % g)
	var today := Time.get_date_string_from_system()
	if today != last_daily:
		last_daily = today
		gems += DAILY_GEMS
		toast.emit("Daily bonus: +%d gems" % DAILY_GEMS)
	save_game()
	changed.emit()


# --- Heroes -----------------------------------------------------------------

func hero_def(id: String) -> Dictionary:
	return _by_id.get(id, {})


func heroes_of_rarity(r: int) -> Array:
	return ROSTER.filter(func(d): return d["rarity"] == r)


func level(id: String) -> int:
	return int(owned[id]["lvl"]) if owned.has(id) else 1


func asc(id: String) -> int:
	return int(owned[id]["asc"]) if owned.has(id) else 0


func max_level(id: String) -> int:
	return 20 + 10 * asc(id)


func level_cost(id: String) -> int:
	var r: int = hero_def(id)["rarity"]
	return 30 * (r - 2) * level(id)


func hero_stats(id: String) -> Dictionary:
	var d := hero_def(id)
	var base: Dictionary = CLASSES[d["cls"]]
	var r: int = d["rarity"]
	var m: float = RARITY_MULT[r] * (1.0 + 0.08 * (level(id) - 1)) * (1.0 + 0.1 * asc(id))
	return {
		"hp": roundi(base["hp"] * m),
		"atk": roundi(base["atk"] * m),
		"def": roundi(base["def"] * m),
		"spd": int(base["spd"]) + asc(id),
	}


func level_up(id: String) -> bool:
	if not owned.has(id) or level(id) >= max_level(id):
		return false
	var cost := level_cost(id)
	if gold < cost:
		return false
	gold -= cost
	owned[id]["lvl"] = level(id) + 1
	changed.emit()
	return true


func toggle_party(id: String) -> bool:
	if party.has(id):
		if party.size() == 1:
			return false # always keep someone to fight
		party.erase(id)
	elif owned.has(id) and party.size() < MAX_PARTY:
		party.append(id)
	else:
		return false
	save_game()
	changed.emit()
	return true


# --- Gacha ------------------------------------------------------------------

## SSR chance for the *next* pull, including soft and hard pity.
func ssr_chance() -> float:
	var n := pity_ssr + 1
	if n >= HARD_PITY:
		return 1.0
	if n > SOFT_PITY:
		return SSR_RATE + 0.06 * (n - SOFT_PITY)
	return SSR_RATE


## Spends gems and returns one result dict per pull, or [] if you can't afford it.
func pull(n: int) -> Array:
	if gems < PULL_COST * n:
		return []
	gems -= PULL_COST * n
	var results: Array = []
	for i in n:
		results.append(_roll_one())
	total_pulls += n
	save_game()
	changed.emit()
	return results


func _roll_one() -> Dictionary:
	var ssr := ssr_chance()
	var roll := _rng.randf()
	var rarity := 3
	if roll < ssr:
		rarity = 5
	elif pity_sr + 1 >= SR_PITY or roll < ssr + SR_RATE:
		rarity = 4
	pity_ssr = 0 if rarity == 5 else pity_ssr + 1
	pity_sr = 0 if rarity >= 4 else pity_sr + 1

	var pool := heroes_of_rarity(rarity)
	var d: Dictionary = pool[_rng.randi() % pool.size()]
	var id: String = d["id"]
	var res := {"id": id, "rarity": rarity, "new": false, "asc_up": false, "refund": 0}
	if not owned.has(id):
		owned[id] = {"lvl": 1, "asc": 0}
		res["new"] = true
		if party.size() < MAX_PARTY:
			party.append(id)
	elif asc(id) < MAX_ASC:
		owned[id]["asc"] = asc(id) + 1
		res["asc_up"] = true
	else:
		var refund := 100 * (rarity - 2) * (rarity - 2)
		gold += refund
		res["refund"] = refund
	return res


# --- Battles ----------------------------------------------------------------

func stage_rewards(s: int) -> Dictionary:
	return {"gems": 40 + 8 * s, "gold": 80 + 25 * s}


func make_enemies(s: int) -> Array:
	var p := pow(1.10, s - 1)
	var list: Array = []
	if s % 5 == 0:
		var b: Array = BOSSES[(int(s / 5.0) - 1) % BOSSES.size()]
		list.append(_unit(b[0], b[1], 300.0 * p, 15.0 * p, 7.0 * p, 9, true))
	else:
		var count := 1 if s == 1 else (2 if s < 4 else 3)
		for i in count:
			var e: Array = ENEMIES[_rng.randi() % ENEMIES.size()]
			list.append(_unit(e[0], e[1], 60.0 * p, 11.0 * p, 4.0 * p, _rng.randi_range(6, 13), false))
	return list


func party_units() -> Array:
	var list: Array = []
	for id in party:
		var d := hero_def(id)
		var s := hero_stats(id)
		list.append({
			"id": id, "name": d["name"], "color": d["color"], "cls": d["cls"], "boss": false,
			"hp": s["hp"], "max_hp": s["hp"], "atk": s["atk"], "def": s["def"], "spd": s["spd"],
		})
	return list


func team_power(units: Array) -> int:
	var total := 0
	for u in units:
		total += int(u["max_hp"] / 4.0 + u["atk"] * 2 + u["def"] * 2 + u["spd"])
	return total


## Runs the whole fight up front and returns {"win": bool, "events": [...]}.
## The battle screen just replays the events.
func simulate(heroes: Array, enemies: Array) -> Dictionary:
	var sides := [heroes.duplicate(true), enemies.duplicate(true)]
	var events: Array = []
	var winner := -1
	for round_i in 50:
		var order: Array = []
		for s in 2:
			for i in sides[s].size():
				order.append([s, i])
		order.shuffle()
		order.sort_custom(func(a, b): return sides[a[0]][a[1]]["spd"] > sides[b[0]][b[1]]["spd"])
		for o in order:
			var side: int = o[0]
			var idx: int = o[1]
			var me: Dictionary = sides[side][idx]
			if me["hp"] <= 0:
				continue
			var ev := _act(side, idx, me, sides[side], sides[1 - side])
			if not ev.is_empty():
				events.append(ev)
			if _all_dead(sides[1 - side]):
				winner = side
				break
		if winner != -1:
			break
	return {"win": winner == 0, "events": events}


func _act(side: int, idx: int, me: Dictionary, allies: Array, foes: Array) -> Dictionary:
	if me["cls"] == "Cleric":
		var hurt := _lowest(allies, true)
		if hurt != -1 and float(allies[hurt]["hp"]) / allies[hurt]["max_hp"] < 0.7:
			var t: Dictionary = allies[hurt]
			var amt := roundi(me["atk"] * 1.3 * _rng.randf_range(0.9, 1.1))
			t["hp"] = mini(t["max_hp"], t["hp"] + amt)
			return {"side": side, "idx": idx, "t_side": side, "t_idx": hurt, "kind": "heal",
				"amount": amt, "crit": false, "t_hp": t["hp"]}

	var alive: Array = []
	for i in foes.size():
		if foes[i]["hp"] > 0:
			alive.append(i)
	if alive.is_empty():
		return {}
	var ti: int = alive[_rng.randi() % alive.size()]
	if me["cls"] == "Rogue":
		ti = _lowest(foes, false)
	var target: Dictionary = foes[ti]

	var crit_chance := 0.1
	if me["cls"] == "Rogue":
		crit_chance = 0.25
	elif me["cls"] == "Ranger":
		crit_chance = 0.2
	var crit := _rng.randf() < crit_chance
	var dmg := maxf(1.0, me["atk"] * _rng.randf_range(0.85, 1.15) - target["def"] * 0.5)
	if crit:
		dmg *= 1.6
	var d := roundi(dmg)
	target["hp"] = maxi(0, target["hp"] - d)
	return {"side": side, "idx": idx, "t_side": 1 - side, "t_idx": ti, "kind": "hit",
		"amount": d, "crit": crit, "t_hp": target["hp"]}


## Index of the living unit with the least HP (or HP ratio), -1 if all dead.
func _lowest(units: Array, by_ratio: bool) -> int:
	var best := -1
	var best_v := INF
	for i in units.size():
		var u: Dictionary = units[i]
		if u["hp"] <= 0:
			continue
		var v: float = float(u["hp"]) / u["max_hp"] if by_ratio else float(u["hp"])
		if v < best_v:
			best_v = v
			best = i
	return best


func _all_dead(units: Array) -> bool:
	for u in units:
		if u["hp"] > 0:
			return false
	return true


## Pays out and advances the stage on a win. Losses still pay a little gold.
func finish_battle(win: bool) -> Dictionary:
	var r := {"gems": 0, "gold": 15 * stage}
	if win:
		r = stage_rewards(stage)
		stage += 1
	gems += r["gems"]
	gold += r["gold"]
	save_game()
	changed.emit()
	return r


func _unit(nm: String, color: String, hp: float, atk: float, def: float, spd: int, boss: bool) -> Dictionary:
	return {
		"id": nm, "name": nm, "color": color, "cls": "", "boss": boss,
		"hp": roundi(hp), "max_hp": roundi(hp), "atk": roundi(atk), "def": roundi(def), "spd": spd,
	}


# --- Saving -----------------------------------------------------------------

func save_game() -> void:
	last_seen = int(Time.get_unix_time_from_system())
	var data := {
		"gems": gems, "gold": gold, "pity_ssr": pity_ssr, "pity_sr": pity_sr, "stage": stage,
		"owned": owned, "party": party, "total_pulls": total_pulls, "muted": muted,
		"last_seen": last_seen, "last_daily": last_daily,
	}
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))


func load_game() -> void:
	var data = null
	if FileAccess.file_exists(SAVE_PATH):
		data = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if typeof(data) != TYPE_DICTIONARY:
		_new_game()
		return
	gems = int(data.get("gems", gems))
	gold = int(data.get("gold", gold))
	pity_ssr = int(data.get("pity_ssr", 0))
	pity_sr = int(data.get("pity_sr", 0))
	stage = maxi(1, int(data.get("stage", 1)))
	total_pulls = int(data.get("total_pulls", 0))
	muted = bool(data.get("muted", true))
	last_seen = int(data.get("last_seen", 0))
	last_daily = str(data.get("last_daily", ""))
	owned = {}
	var o = data.get("owned", {})
	if typeof(o) == TYPE_DICTIONARY:
		for id in o:
			if _by_id.has(id) and typeof(o[id]) == TYPE_DICTIONARY:
				owned[id] = {"lvl": int(o[id].get("lvl", 1)), "asc": int(o[id].get("asc", 0))}
	party = []
	var p = data.get("party", [])
	if typeof(p) == TYPE_ARRAY:
		for id in p:
			if owned.has(id) and not party.has(id) and party.size() < MAX_PARTY:
				party.append(str(id))
	if owned.is_empty():
		_new_game()
	elif party.is_empty():
		party = [owned.keys()[0]]


func _new_game() -> void:
	owned = {"bob": {"lvl": 1, "asc": 0}}
	party = ["bob"]

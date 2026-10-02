class_name HeroesView
extends Control
## Collection grid, party picker, and a detail panel for levelling heroes.

var _party_row: HBoxContainer
var _power: Label
var _count: Label
var _grid: GridContainer

var _detail: PanelContainer
var _detail_id := ""
var _d_sprite: TextureRect
var _d_name: Label
var _d_stars: StarRow
var _d_info: Label
var _d_blurb: Label
var _d_stats: Label
var _d_level: Button
var _d_party: Button


func _ready() -> void:
	var col := VBoxContainer.new()
	col.set_anchors_preset(Control.PRESET_FULL_RECT)
	col.add_theme_constant_override("separation", 6)
	add_child(col)

	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 6)
	col.add_child(head)
	head.add_child(UI.label("Party", 14, UI.ACCENT))
	_party_row = HBoxContainer.new()
	_party_row.add_theme_constant_override("separation", 4)
	head.add_child(_party_row)
	var spacer := Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(spacer)
	_count = UI.label("", 12, UI.MUTED)
	head.add_child(_count)

	_power = UI.label("", 12, UI.MUTED)
	col.add_child(_power)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	col.add_child(scroll)
	_grid = GridContainer.new()
	_grid.columns = 4
	_grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_grid.add_theme_constant_override("h_separation", 6)
	_grid.add_theme_constant_override("v_separation", 6)
	scroll.add_child(_grid)

	_build_detail()
	Game.changed.connect(_refresh)
	_refresh()


func _build_detail() -> void:
	_detail = PanelContainer.new()
	_detail.set_anchors_preset(Control.PRESET_FULL_RECT)
	_detail.add_theme_stylebox_override("panel", UI.box(UI.BG, 10, UI.BORDER, 2, 10.0))
	_detail.hide()
	add_child(_detail)
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 6)
	_detail.add_child(v)

	var back := UI.button("< Back", UI.PANEL, 12)
	back.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	back.pressed.connect(func():
		Sfx.click()
		_detail_id = ""
		_detail.hide())
	v.add_child(back)

	var c := CenterContainer.new()
	v.add_child(c)
	_d_sprite = UI.sprite(null, 112)
	c.add_child(_d_sprite)
	_d_name = UI.label("", 18, UI.TEXT, true)
	v.add_child(_d_name)
	_d_stars = StarRow.new().setup(3, 16.0, UI.ACCENT)
	v.add_child(_d_stars)
	_d_info = UI.label("", 12, UI.MUTED, true)
	v.add_child(_d_info)
	_d_blurb = UI.wrapped("", 12, UI.MUTED)
	v.add_child(_d_blurb)
	_d_stats = UI.label("", 15, UI.TEXT, true)
	v.add_child(_d_stats)

	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(spacer)

	_d_level = UI.button("", UI.ACCENT.darkened(0.35), 14)
	_d_level.custom_minimum_size = Vector2(0, 44)
	_d_level.pressed.connect(func():
		if Game.level_up(_detail_id):
			Sfx.star(Game.level(_detail_id) % 5)
		else:
			Sfx.error())
	v.add_child(_d_level)
	_d_party = UI.button("", UI.PANEL.lightened(0.1), 14)
	_d_party.custom_minimum_size = Vector2(0, 40)
	_d_party.pressed.connect(func():
		Sfx.click()
		Game.toggle_party(_detail_id))
	v.add_child(_d_party)


func _refresh() -> void:
	for c in _party_row.get_children():
		c.queue_free()
	for i in Game.MAX_PARTY:
		if i < Game.party.size():
			var id: String = Game.party[i]
			_party_row.add_child(UI.sprite(SpriteGen.hero(id, Game.hero_def(id)["color"]), 30))
		else:
			var empty := Panel.new()
			empty.custom_minimum_size = Vector2(30, 30)
			empty.add_theme_stylebox_override("panel", UI.box(UI.PANEL, 6, UI.BORDER, 1))
			_party_row.add_child(empty)
	_count.text = "%d/%d collected" % [Game.owned.size(), Game.ROSTER.size()]
	_power.text = "Team power %d  ·  %d gold" % [Game.team_power(Game.party_units()), Game.gold]

	for c in _grid.get_children():
		c.queue_free()
	var list: Array = Game.ROSTER.duplicate()
	list.sort_custom(_sort_heroes)
	for d in list:
		_grid.add_child(_cell(d))
	_refresh_detail()


func _sort_heroes(a: Dictionary, b: Dictionary) -> bool:
	var ao: bool = Game.owned.has(a["id"])
	var bo: bool = Game.owned.has(b["id"])
	if ao != bo:
		return ao
	if a["rarity"] != b["rarity"]:
		return a["rarity"] > b["rarity"]
	return Game.level(a["id"]) > Game.level(b["id"])


func _cell(d: Dictionary) -> Control:
	var id: String = d["id"]
	var have: bool = Game.owned.has(id)
	var r: int = d["rarity"]
	var in_party: bool = Game.party.has(id)
	var border := UI.rarity_color(r) if have else UI.BORDER
	if in_party:
		border = UI.ACCENT
	var p := PanelContainer.new()
	p.custom_minimum_size = Vector2(76, 0)
	p.add_theme_stylebox_override("panel",
		UI.box(UI.PANEL if have else UI.BG, 8, border, 3 if in_party else 2, 4.0))
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 2)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.add_child(v)
	v.add_child(UI.sprite(SpriteGen.hero(id, d["color"], not have), 48))
	v.add_child(StarRow.new().setup(r, 9.0, UI.rarity_color(r) if have else UI.BORDER))
	var txt := "???"
	if have:
		txt = "Lv %d" % Game.level(id)
		if Game.asc(id) > 0:
			txt += "  A%d" % Game.asc(id)
	v.add_child(UI.label(txt, 11, UI.TEXT if have else UI.MUTED, true))
	if have:
		p.gui_input.connect(func(e: InputEvent): _cell_input(e, id))
	else:
		p.mouse_filter = Control.MOUSE_FILTER_PASS
	return p


func _cell_input(e: InputEvent, id: String) -> void:
	var mb := e as InputEventMouseButton
	if mb and mb.pressed and mb.button_index == MOUSE_BUTTON_LEFT:
		Sfx.click()
		_detail_id = id
		_detail.show()
		_refresh_detail()


func _refresh_detail() -> void:
	if _detail_id == "":
		return
	var id := _detail_id
	var d := Game.hero_def(id)
	var s := Game.hero_stats(id)
	var r: int = d["rarity"]
	_d_sprite.texture = SpriteGen.hero(id, d["color"])
	_d_name.text = d["name"]
	_d_stars.setup(r, 16.0, UI.rarity_color(r))
	_d_info.text = "%s  ·  %s  ·  Lv %d/%d  ·  Asc %d/%d" % [
		UI.rarity_name(r), d["cls"], Game.level(id), Game.max_level(id), Game.asc(id), Game.MAX_ASC]
	_d_blurb.text = Game.CLASS_BLURB[d["cls"]]
	_d_stats.text = "HP %d     ATK %d\nDEF %d     SPD %d" % [s["hp"], s["atk"], s["def"], s["spd"]]

	if Game.level(id) >= Game.max_level(id):
		_d_level.text = "Max level (dupes raise the cap)"
		_d_level.disabled = true
	else:
		var cost := Game.level_cost(id)
		_d_level.text = "Level up  —  %d gold" % cost
		_d_level.disabled = Game.gold < cost

	var in_party: bool = Game.party.has(id)
	if in_party:
		_d_party.text = "Remove from party"
		_d_party.disabled = Game.party.size() == 1
	elif Game.party.size() < Game.MAX_PARTY:
		_d_party.text = "Add to party"
		_d_party.disabled = false
	else:
		_d_party.text = "Party full (remove someone first)"
		_d_party.disabled = true

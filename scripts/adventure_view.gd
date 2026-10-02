class_name AdventureView
extends Control
## Stage preview and the animated auto-battle. Wins pay gems and gold and
## unlock the next stage; every 5th stage is a boss.

var _prep: VBoxContainer
var _stage_label: Label
var _hero_preview: HBoxContainer
var _enemy_preview: HBoxContainer
var _power_label: Label
var _reward_label: Label

var _arena: Control
var _hero_col: VBoxContainer
var _enemy_col: VBoxContainer
var _speed_btn: Button
var _result: CenterContainer
var _result_title: Label
var _result_body: Label

var _enemies: Array = []
var _units := [[], []]
var _fast := false
var _fighting := false


func _ready() -> void:
	_build_prep()
	_build_arena()
	_enemies = Game.make_enemies(Game.stage)
	Game.changed.connect(_refresh_prep)
	_refresh_prep()


func _build_prep() -> void:
	_prep = VBoxContainer.new()
	_prep.set_anchors_preset(Control.PRESET_FULL_RECT)
	_prep.add_theme_constant_override("separation", 8)
	add_child(_prep)

	_stage_label = UI.label("", 22, UI.ACCENT, true)
	_prep.add_child(_stage_label)
	_prep.add_child(UI.label("Your party", 12, UI.MUTED, true))
	_hero_preview = HBoxContainer.new()
	_hero_preview.alignment = BoxContainer.ALIGNMENT_CENTER
	_hero_preview.add_theme_constant_override("separation", 10)
	_prep.add_child(_hero_preview)
	_prep.add_child(UI.label("VS", 16, UI.BAD, true))
	_enemy_preview = HBoxContainer.new()
	_enemy_preview.alignment = BoxContainer.ALIGNMENT_CENTER
	_enemy_preview.add_theme_constant_override("separation", 10)
	_prep.add_child(_enemy_preview)
	_power_label = UI.label("", 13, UI.TEXT, true)
	_prep.add_child(_power_label)
	_reward_label = UI.label("", 12, UI.MUTED, true)
	_prep.add_child(_reward_label)

	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	_prep.add_child(spacer)

	var fight := UI.button("FIGHT!", UI.BAD.darkened(0.3), 18)
	fight.custom_minimum_size = Vector2(0, 56)
	fight.pressed.connect(_on_fight)
	_prep.add_child(fight)


func _build_arena() -> void:
	_arena = Control.new()
	_arena.set_anchors_preset(Control.PRESET_FULL_RECT)
	_arena.hide()
	add_child(_arena)

	var row := HBoxContainer.new()
	row.set_anchors_preset(Control.PRESET_FULL_RECT)
	_arena.add_child(row)
	_hero_col = VBoxContainer.new()
	_hero_col.alignment = BoxContainer.ALIGNMENT_CENTER
	_hero_col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_hero_col.add_theme_constant_override("separation", 14)
	row.add_child(_hero_col)
	_enemy_col = VBoxContainer.new()
	_enemy_col.alignment = BoxContainer.ALIGNMENT_CENTER
	_enemy_col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_enemy_col.add_theme_constant_override("separation", 14)
	row.add_child(_enemy_col)

	_speed_btn = UI.button("x1", UI.PANEL, 12)
	_speed_btn.position = Vector2(4, 4)
	_speed_btn.size = Vector2(40, 28)
	_speed_btn.pressed.connect(func():
		_fast = not _fast
		_speed_btn.text = "x2" if _fast else "x1")
	_arena.add_child(_speed_btn)

	_result = CenterContainer.new()
	_result.set_anchors_preset(Control.PRESET_FULL_RECT)
	_result.hide()
	_arena.add_child(_result)
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(260, 0)
	panel.add_theme_stylebox_override("panel", UI.box(UI.BG, 12, UI.ACCENT, 2, 14.0))
	_result.add_child(panel)
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 8)
	panel.add_child(v)
	_result_title = UI.label("", 24, UI.ACCENT, true)
	v.add_child(_result_title)
	_result_body = UI.wrapped("", 13, UI.TEXT)
	v.add_child(_result_body)
	var cont := UI.button("Continue", UI.PANEL.lightened(0.1), 14)
	cont.custom_minimum_size = Vector2(0, 40)
	cont.pressed.connect(_on_continue)
	v.add_child(cont)


func _refresh_prep() -> void:
	if _fighting:
		return
	var s := Game.stage
	_stage_label.text = "Stage %d%s" % [s, "  —  BOSS" if s % 5 == 0 else ""]
	var heroes := Game.party_units()
	_fill_preview(_hero_preview, heroes, true)
	_fill_preview(_enemy_preview, _enemies, false)
	var mine := Game.team_power(heroes)
	var theirs := Game.team_power(_enemies)
	_power_label.text = "Power %d  vs  %d" % [mine, theirs]
	_power_label.add_theme_color_override("font_color", UI.GOOD if mine >= theirs else UI.BAD)
	var r := Game.stage_rewards(s)
	_reward_label.text = "Win: +%d gems, +%d gold" % [r["gems"], r["gold"]]


func _fill_preview(box: HBoxContainer, units: Array, heroes: bool) -> void:
	for c in box.get_children():
		c.queue_free()
	for u in units:
		var v := VBoxContainer.new()
		v.add_theme_constant_override("separation", 0)
		var px := 72 if u["boss"] else 48
		var cc := CenterContainer.new()
		cc.add_child(UI.sprite(SpriteGen.hero(u["id"], u["color"]), px))
		v.add_child(cc)
		var sub: String = ("Lv %d" % Game.level(u["id"])) if heroes else u["name"]
		var l := UI.label(sub, 10, UI.MUTED, true)
		l.custom_minimum_size = Vector2(60, 0)
		l.clip_text = true
		v.add_child(l)
		box.add_child(v)


func _on_fight() -> void:
	if _fighting:
		return
	_fighting = true
	Sfx.click()
	var heroes := Game.party_units()
	var sim := Game.simulate(heroes, _enemies)

	for c in _hero_col.get_children():
		c.queue_free()
	for c in _enemy_col.get_children():
		c.queue_free()
	_units = [[], []]
	for u in heroes:
		var w := _unit_widget(u, UI.GOOD)
		_hero_col.add_child(w)
		_units[0].append(w)
	for u in _enemies:
		var w := _unit_widget(u, UI.BAD)
		_enemy_col.add_child(w)
		_units[1].append(w)

	_prep.hide()
	_result.hide()
	_arena.show()
	Engine.max_fps = 60
	await get_tree().process_frame
	await get_tree().create_timer(0.4).timeout

	for ev in sim["events"]:
		await _play_event(ev)

	var win: bool = sim["win"]
	var r := Game.finish_battle(win)
	if win:
		Sfx.win()
		_result_title.text = "VICTORY!"
		_result_title.add_theme_color_override("font_color", UI.ACCENT)
		_result_body.text = "+%d gems   +%d gold\nOn to stage %d." % [r["gems"], r["gold"], Game.stage]
	else:
		Sfx.lose()
		_result_title.text = "Defeat"
		_result_title.add_theme_color_override("font_color", UI.BAD)
		_result_body.text = "+%d gold for trying.\nLevel up your heroes or pull for better ones." % r["gold"]
	_result.show()
	Engine.max_fps = 30


func _on_continue() -> void:
	Sfx.click()
	_fighting = false
	_arena.hide()
	_prep.show()
	_enemies = Game.make_enemies(Game.stage)
	_refresh_prep()


func _unit_widget(u: Dictionary, bar_color: Color) -> Control:
	var w := VBoxContainer.new()
	w.add_theme_constant_override("separation", 2)
	var px := 64.0 if u["boss"] else 44.0
	var holder := Control.new()
	holder.custom_minimum_size = Vector2(px, px)
	holder.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	w.add_child(holder)
	var tr := UI.sprite(SpriteGen.hero(u["id"], u["color"]), px)
	tr.size = Vector2(px, px)
	holder.add_child(tr)

	var bar := ProgressBar.new()
	bar.show_percentage = false
	bar.custom_minimum_size = Vector2(80, 7)
	bar.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	bar.max_value = u["max_hp"]
	bar.value = u["hp"]
	bar.add_theme_stylebox_override("background", UI.box(Color(0, 0, 0, 0.45), 3, Color(0, 0, 0, 0), 0, 0.0))
	bar.add_theme_stylebox_override("fill", UI.box(bar_color, 3, Color(0, 0, 0, 0), 0, 0.0))
	w.add_child(bar)
	var nm := UI.label(u["name"], 10, UI.MUTED, true)
	nm.custom_minimum_size = Vector2(90, 0)
	nm.clip_text = true
	w.add_child(nm)

	w.set_meta("sprite", tr)
	w.set_meta("bar", bar)
	return w


func _play_event(ev: Dictionary) -> void:
	var step := 0.12 if _fast else 0.24
	var actor: Control = _units[ev["side"]][ev["idx"]]
	var target: Control = _units[ev["t_side"]][ev["t_idx"]]
	var spr: TextureRect = actor.get_meta("sprite")
	var dir := 12.0 if ev["side"] == 0 else -12.0
	if ev["kind"] == "heal":
		dir = 0.0

	var tw := create_tween()
	tw.tween_property(spr, "position:x", dir, step * 0.5)
	tw.tween_property(spr, "position:x", 0.0, step * 0.5)
	await tw.finished

	var bar: ProgressBar = target.get_meta("bar")
	bar.value = ev["t_hp"]
	var tspr: TextureRect = target.get_meta("sprite")
	if ev["kind"] == "heal":
		Sfx.heal()
		tspr.modulate = Color(0.5, 1.0, 0.6)
		_float_text(target, "+%d" % ev["amount"], UI.GOOD, false)
	else:
		Sfx.hit()
		tspr.modulate = Color(1.0, 0.35, 0.35)
		var crit: bool = ev["crit"]
		_float_text(target, str(ev["amount"]) + ("!" if crit else ""), UI.ACCENT if crit else Color.WHITE, crit)
	var back := create_tween()
	back.tween_property(tspr, "modulate", Color.WHITE, step)
	if ev["t_hp"] <= 0:
		back.tween_property(target, "modulate:a", 0.25, step)
	await get_tree().create_timer(step).timeout


func _float_text(target: Control, text: String, color: Color, big: bool) -> void:
	var l := UI.label(text, 18 if big else 13, color, true)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(l)
	l.size = Vector2(60, 22)
	l.position = target.global_position - global_position + Vector2(target.size.x / 2.0 - 30.0, -6.0)
	var tw := create_tween().set_parallel(true)
	tw.tween_property(l, "position:y", l.position.y - 26.0, 0.6)
	tw.tween_property(l, "modulate:a", 0.0, 0.4).set_delay(0.25)
	tw.chain().tween_callback(l.queue_free)

class_name Reveal
extends Control
## The pull animation: orb drops, color teases the rarity (sometimes upgrading
## mid-reveal), flash, then the card(s). Tap to skip, tap again to close.

signal finished

var _dim: Panel
var _flash: ColorRect
var _orb: Orb
var _layer: Control
var _hint: Label
var _skip := false
var _done := false


func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP

	_dim = Panel.new()
	_dim.add_theme_stylebox_override("panel", UI.box(Color(0.03, 0.02, 0.08, 0.95), 14))
	_dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	_dim.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_dim)

	_layer = Control.new()
	_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_layer)

	_orb = Orb.new()
	_orb.size = Vector2(220, 220)
	_orb.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_orb)

	_flash = ColorRect.new()
	_flash.color = Color.WHITE
	_flash.set_anchors_preset(Control.PRESET_FULL_RECT)
	_flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_flash.modulate.a = 0.0
	add_child(_flash)

	_hint = UI.label("", 12, UI.MUTED, true)
	_hint.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	_hint.offset_left = 0
	_hint.offset_right = 0
	_hint.offset_top = -30
	_hint.offset_bottom = -10
	add_child(_hint)

	gui_input.connect(_on_input)


func play(results: Array) -> void:
	show()
	Engine.max_fps = 60
	_skip = false
	_done = false
	_hint.text = "tap to skip"
	for c in _layer.get_children():
		c.queue_free()
	var best := 3
	for r in results:
		best = maxi(best, r["rarity"])

	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.15)

	# Orb drops in.
	var center := size / 2.0 - _orb.size / 2.0
	_orb.show()
	_orb.color = Color.WHITE
	_orb.position = Vector2(center.x, -_orb.size.y)
	create_tween().tween_property(_orb, "position", center, 0.6) \
		.set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
	Sfx.charge()
	await _wait(0.8)

	# Tease: sometimes show a lower rarity first, then upgrade.
	var tease := best
	if best == 5 and randf() < 0.4:
		tease = 4
	elif best == 4 and randf() < 0.25:
		tease = 3
	_orb.color = UI.rarity_color(tease)
	if not _skip:
		Sfx.ding(tease)
	await _wait(0.65)
	if tease != best and not _skip:
		_flash_once(0.6)
		_orb.color = UI.rarity_color(best)
		_burst(_orb.position + _orb.size / 2.0, UI.rarity_color(best), 40)
		Sfx.upgrade()
		await _wait(0.75)

	_flash_once(1.0)
	_burst(size / 2.0, UI.rarity_color(best), 90 if best == 5 else 50)
	if best == 5:
		_shake()
	_orb.hide()

	if results.size() == 1:
		await _show_single(results[0])
	else:
		await _show_multi(results)
	_done = true
	_hint.text = "tap to close"


func _show_single(res: Dictionary) -> void:
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	center.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_layer.add_child(center)
	var card := _card(res, true)
	card.custom_minimum_size = Vector2(250, 0)
	card.modulate.a = 0.0
	center.add_child(card)
	var stars: StarRow = card.find_child("Stars", true, false)
	stars.shown = 0
	await get_tree().process_frame

	card.pivot_offset = card.size / 2.0
	card.scale = Vector2(0.3, 0.3)
	var tw := create_tween().set_parallel(true)
	tw.tween_property(card, "scale", Vector2.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(card, "modulate:a", 1.0, 0.2)
	var rarity: int = res["rarity"]
	if not _skip:
		Sfx.reveal(rarity)
	await _wait(0.4)
	for i in rarity:
		stars.shown = i + 1
		if not _skip:
			Sfx.star(i)
		await _wait(0.16)
	stars.shown = -1


func _show_multi(results: Array) -> void:
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	center.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_layer.add_child(center)
	var grid := GridContainer.new()
	grid.columns = 5
	grid.add_theme_constant_override("h_separation", 5)
	grid.add_theme_constant_override("v_separation", 5)
	grid.mouse_filter = Control.MOUSE_FILTER_IGNORE
	center.add_child(grid)
	var cards: Array[Control] = []
	for res in results:
		var c := _card(res, false)
		c.custom_minimum_size = Vector2(62, 0)
		c.modulate.a = 0.0
		grid.add_child(c)
		cards.append(c)
	await get_tree().process_frame

	for i in cards.size():
		var c := cards[i]
		var r: int = results[i]["rarity"]
		c.pivot_offset = c.size / 2.0
		c.scale = Vector2(0.4, 0.4)
		var tw := create_tween().set_parallel(true)
		tw.tween_property(c, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(c, "modulate:a", 1.0, 0.15)
		if r >= 4 and not _skip:
			_burst(c.global_position - global_position + c.size / 2.0, UI.rarity_color(r), 30 if r == 5 else 14)
			Sfx.reveal(r)
			await _wait(0.5 if r == 5 else 0.28)
		else:
			if not _skip:
				Sfx.tick()
			await _wait(0.12)


func _card(res: Dictionary, big: bool) -> PanelContainer:
	var id: String = res["id"]
	var d := Game.hero_def(id)
	var r: int = res["rarity"]
	var c := UI.rarity_color(r)
	var p := PanelContainer.new()
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.add_theme_stylebox_override("panel", UI.box(UI.PANEL, 10, c, 3 if r == 5 else 2, 10.0 if big else 3.0))
	var v := VBoxContainer.new()
	v.alignment = BoxContainer.ALIGNMENT_CENTER
	v.add_theme_constant_override("separation", 6 if big else 2)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.add_child(v)

	v.add_child(UI.sprite(SpriteGen.hero(id, d["color"]), 128 if big else 44))
	var stars := StarRow.new().setup(r, 20.0 if big else 9.0, c)
	stars.name = "Stars"
	v.add_child(stars)
	var nm := UI.label(d["name"], 18 if big else 9, UI.TEXT, true)
	if not big:
		nm.clip_text = true
		nm.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	v.add_child(nm)

	var tag := ""
	var tag_color := UI.ACCENT
	if res["new"]:
		tag = "NEW!"
	elif res["asc_up"]:
		tag = "Ascension %d/%d" % [Game.asc(id), Game.MAX_ASC] if big else "ASC+1"
		tag_color = UI.GOOD
	elif res["refund"] > 0:
		tag = "+%d gold" % res["refund"]
		tag_color = UI.MUTED
	if tag != "":
		v.add_child(UI.label(tag, 14 if big else 9, tag_color, true))
	if big:
		v.add_child(UI.label("%s  ·  %s" % [UI.rarity_name(r), d["cls"]], 12, UI.MUTED, true))
	return p


func _wait(t: float) -> void:
	if _skip:
		return
	await get_tree().create_timer(t).timeout


func _flash_once(strength: float) -> void:
	_flash.modulate.a = strength
	create_tween().tween_property(_flash, "modulate:a", 0.0, 0.35)


func _burst(at: Vector2, color: Color, amount: int) -> void:
	var p := CPUParticles2D.new()
	p.position = at
	p.amount = amount
	p.one_shot = true
	p.explosiveness = 1.0
	p.lifetime = 1.0
	p.spread = 180.0
	p.direction = Vector2.UP
	p.initial_velocity_min = 90.0
	p.initial_velocity_max = 260.0
	p.gravity = Vector2(0, 260)
	p.scale_amount_min = 2.0
	p.scale_amount_max = 5.0
	p.color = color
	add_child(p)
	p.emitting = true
	get_tree().create_timer(1.6).timeout.connect(p.queue_free)


func _shake() -> void:
	var tw := create_tween()
	for i in 6:
		tw.tween_property(self, "position", Vector2(randf_range(-6, 6), randf_range(-6, 6)), 0.04)
	tw.tween_property(self, "position", Vector2.ZERO, 0.04)


func _on_input(e: InputEvent) -> void:
	var mb := e as InputEventMouseButton
	if mb == null or not mb.pressed or mb.button_index != MOUSE_BUTTON_LEFT:
		return
	if _done:
		_close()
	else:
		_skip = true


func _close() -> void:
	_done = false
	var tw := create_tween()
	tw.tween_property(self, "modulate:a", 0.0, 0.15)
	await tw.finished
	hide()
	Engine.max_fps = 30
	finished.emit()

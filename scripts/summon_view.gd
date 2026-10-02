class_name SummonView
extends Control
## Banner screen: rates, pity counters, pull buttons.

signal pulled(results: Array)

var _pity: Label
var _sr_pity: Label
var _one: Button
var _ten: Button
var _total: Label
var _bobbers: Array[TextureRect] = []
var _t := 0.0


func _ready() -> void:
	var col := VBoxContainer.new()
	col.set_anchors_preset(Control.PRESET_FULL_RECT)
	col.add_theme_constant_override("separation", 10)
	add_child(col)

	var banner := PanelContainer.new()
	banner.add_theme_stylebox_override("panel", UI.box(UI.PANEL, 12, UI.ACCENT.darkened(0.35), 2, 10.0))
	col.add_child(banner)
	var inner := VBoxContainer.new()
	inner.add_theme_constant_override("separation", 4)
	banner.add_child(inner)
	inner.add_child(UI.label("STANDARD BANNER", 20, UI.ACCENT, true))
	inner.add_child(UI.label("SSR 3%    SR 15%    R 82%", 12, UI.MUTED, true))

	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 4)
	inner.add_child(row)
	for d in Game.heroes_of_rarity(5):
		var holder := Control.new()
		holder.custom_minimum_size = Vector2(56, 68)
		row.add_child(holder)
		var tr := UI.sprite(SpriteGen.hero(d["id"], d["color"]), 56)
		tr.size = Vector2(56, 56)
		holder.add_child(tr)
		_bobbers.append(tr)
	inner.add_child(UI.wrapped("Every SSR, always. No limited banners, no FOMO, no wallet.", 11, UI.MUTED))

	var pity_box := VBoxContainer.new()
	pity_box.add_theme_constant_override("separation", 2)
	col.add_child(pity_box)
	_pity = UI.label("", 14, UI.TEXT, true)
	pity_box.add_child(_pity)
	_sr_pity = UI.label("", 12, UI.MUTED, true)
	pity_box.add_child(_sr_pity)

	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	col.add_child(spacer)

	var buttons := HBoxContainer.new()
	buttons.add_theme_constant_override("separation", 8)
	col.add_child(buttons)
	_one = UI.button("Pull x1\n%d gems" % Game.PULL_COST, UI.PANEL.lightened(0.1), 15)
	_ten = UI.button("Pull x10\n%d gems" % (Game.PULL_COST * 10), UI.ACCENT.darkened(0.35), 15)
	for b in [_one, _ten]:
		b.custom_minimum_size = Vector2(0, 64)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		buttons.add_child(b)
	_one.pressed.connect(_on_pull.bind(1))
	_ten.pressed.connect(_on_pull.bind(10))

	_total = UI.wrapped("", 11, UI.MUTED)
	col.add_child(_total)

	Game.changed.connect(_refresh)
	_refresh()


func _process(delta: float) -> void:
	if not is_visible_in_tree():
		return
	_t += delta
	for i in _bobbers.size():
		_bobbers[i].position.y = 6.0 + sin(_t * 2.5 + i * 0.9) * 5.0


func _refresh() -> void:
	_pity.text = "SSR guaranteed within %d pulls" % (Game.HARD_PITY - Game.pity_ssr)
	_sr_pity.text = "SR or better within %d" % (Game.SR_PITY - Game.pity_sr)
	_one.disabled = Game.gems < Game.PULL_COST
	_ten.disabled = Game.gems < Game.PULL_COST * 10
	_total.text = "%d pulls so far  ·  +%d gems/min while open  ·  stage clears pay more" \
		% [Game.total_pulls, int(Game.IDLE_GEMS_PER_MIN)]


func _on_pull(n: int) -> void:
	var results := Game.pull(n)
	if results.is_empty():
		Sfx.error()
		return
	pulled.emit(results)

extends Control
## The widget window: drag bar with currencies, three tabs, toasts, and the
## pull reveal on top. Double-click the bar (or hit _) to collapse it.

const BASE_HEIGHT := 600.0
const BAR_HEIGHT := 56.0 # top bar plus margins; the collapsed window height

var _summon: SummonView
var _heroes: HeroesView
var _adventure: AdventureView
var _views: Array[Control] = []
var _tab_buttons: Array[Button] = []
var _body: Control
var _tabs: HBoxContainer
var _gems: Label
var _gold: Label
var _sound_btn: Button
var _collapse_btn: Button
var _toast: Label
var _toast_queue: Array[String] = []
var _toast_busy := false
var _reveal: Reveal

var _dragging := false
var _drag_offset := Vector2i.ZERO
var _collapsed := false
var _full_size := Vector2i.ZERO


func _ready() -> void:
	Engine.max_fps = 30
	_build()
	Game.changed.connect(_refresh)
	Game.toast.connect(show_toast)
	_place_window()
	Game.welcome()
	_refresh()


func _build() -> void:
	var th := Theme.new()
	th.default_font_size = 14
	theme = th

	var bg := Panel.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.add_theme_stylebox_override("panel", UI.box(UI.BG, 14, UI.BORDER, 2))
	add_child(bg)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	for side in ["left", "right", "top", "bottom"]:
		margin.add_theme_constant_override("margin_" + side, 8)
	add_child(margin)
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 8)
	margin.add_child(col)

	col.add_child(_build_top_bar())

	_body = Control.new()
	_body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	_body.clip_contents = true
	col.add_child(_body)
	_summon = SummonView.new()
	_heroes = HeroesView.new()
	_adventure = AdventureView.new()
	_views = [_summon, _heroes, _adventure]
	for v in _views:
		v.set_anchors_preset(Control.PRESET_FULL_RECT)
		_body.add_child(v)

	_tabs = HBoxContainer.new()
	_tabs.add_theme_constant_override("separation", 6)
	col.add_child(_tabs)
	var names := ["Summon", "Heroes", "Adventure"]
	for i in names.size():
		var b := UI.button(names[i], UI.PANEL, 13)
		b.custom_minimum_size = Vector2(0, 36)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.pressed.connect(_show_tab.bind(i))
		_tabs.add_child(b)
		_tab_buttons.append(b)

	_toast = UI.label("", 13, UI.TEXT, true)
	_toast.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_toast.add_theme_stylebox_override("normal", UI.box(Color(0.1, 0.08, 0.2, 0.95), 8, UI.ACCENT, 1, 8.0))
	_toast.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	_toast.offset_left = 20
	_toast.offset_right = -20
	_toast.offset_top = -110
	_toast.offset_bottom = -60
	_toast.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_toast.modulate.a = 0.0
	add_child(_toast)

	_reveal = Reveal.new()
	_reveal.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(_reveal)
	_reveal.hide()
	_summon.pulled.connect(_reveal.play)

	_show_tab(0)


func _build_top_bar() -> Control:
	var bar := HBoxContainer.new()
	bar.custom_minimum_size = Vector2(0, 32)
	bar.add_theme_constant_override("separation", 4)

	# Everything left of the buttons is the drag handle.
	var handle := HBoxContainer.new()
	handle.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	handle.mouse_filter = Control.MOUSE_FILTER_STOP
	handle.mouse_default_cursor_shape = Control.CURSOR_MOVE
	handle.add_theme_constant_override("separation", 12)
	handle.gui_input.connect(_on_handle_input)
	bar.add_child(handle)
	_gems = UI.label("", 14, UI.GEM)
	handle.add_child(_gems)
	_gold = UI.label("", 14, UI.GOLD)
	handle.add_child(_gold)

	_sound_btn = UI.button("", UI.PANEL, 11)
	_sound_btn.custom_minimum_size = Vector2(58, 28)
	_sound_btn.pressed.connect(func():
		Game.muted = not Game.muted
		Game.save_game()
		_refresh()
		Sfx.click())
	bar.add_child(_sound_btn)
	_collapse_btn = UI.button("_", UI.PANEL, 12)
	_collapse_btn.custom_minimum_size = Vector2(28, 28)
	_collapse_btn.pressed.connect(_toggle_collapse)
	bar.add_child(_collapse_btn)
	var close := UI.button("x", UI.BAD.darkened(0.45), 12)
	close.custom_minimum_size = Vector2(28, 28)
	close.pressed.connect(func():
		Game.save_game()
		get_tree().quit())
	bar.add_child(close)
	return bar


func _refresh() -> void:
	_gems.text = "%d gems" % Game.gems
	_gold.text = "%d gold" % Game.gold
	_sound_btn.text = "SFX off" if Game.muted else "SFX on"


func _show_tab(i: int) -> void:
	for k in _views.size():
		_views[k].visible = k == i
		var active := k == i
		_tab_buttons[k].add_theme_stylebox_override("normal",
			UI.box(UI.ACCENT.darkened(0.45) if active else UI.PANEL, 8, UI.ACCENT if active else UI.PANEL, 1))
	Sfx.click()


# --- Window behaviour -------------------------------------------------------

func _place_window() -> void:
	var win := get_window()
	_full_size = win.size
	var r := DisplayServer.screen_get_usable_rect(win.current_screen)
	win.position = r.position + r.size - win.size - Vector2i(24, 24)


func _on_handle_input(e: InputEvent) -> void:
	var mb := e as InputEventMouseButton
	if mb and mb.button_index == MOUSE_BUTTON_LEFT:
		if mb.double_click:
			_toggle_collapse()
			return
		_dragging = mb.pressed
		_drag_offset = DisplayServer.mouse_get_position() - get_window().position
		return
	if e is InputEventMouseMotion and _dragging:
		get_window().position = DisplayServer.mouse_get_position() - _drag_offset


func _toggle_collapse() -> void:
	_collapsed = not _collapsed
	_dragging = false
	_body.visible = not _collapsed
	_tabs.visible = not _collapsed
	_collapse_btn.text = "+" if _collapsed else "_"
	var win := get_window()
	var old_h := win.size.y
	var new_size := _full_size
	if _collapsed:
		new_size = Vector2i(_full_size.x, int(_full_size.y * BAR_HEIGHT / BASE_HEIGHT))
	win.size = new_size
	# Keep the bottom edge where it was so the widget stays tucked in the corner.
	win.position.y += old_h - new_size.y


# --- Toasts -----------------------------------------------------------------

func show_toast(text: String) -> void:
	_toast_queue.append(text)
	if not _toast_busy:
		_run_toasts()


func _run_toasts() -> void:
	_toast_busy = true
	while not _toast_queue.is_empty():
		_toast.text = _toast_queue.pop_front()
		var tw := create_tween()
		tw.tween_property(_toast, "modulate:a", 1.0, 0.2)
		tw.tween_interval(2.4)
		tw.tween_property(_toast, "modulate:a", 0.0, 0.3)
		await tw.finished
	_toast_busy = false

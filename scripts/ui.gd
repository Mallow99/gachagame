class_name UI
extends RefCounted
## Shared colors and widget factories so every screen looks the same.

static var BG := Color("#1b1830")
static var PANEL := Color("#2a2450")
static var BORDER := Color("#4a4380")
static var ACCENT := Color("#ffcc33")
static var TEXT := Color("#ece8ff")
static var MUTED := Color("#8f88b8")
static var GOOD := Color("#6fe08a")
static var BAD := Color("#ff6b6b")
static var GEM := Color("#7fe3ff")
static var GOLD := Color("#ffb347")


static func rarity_color(r: int) -> Color:
	match r:
		5:
			return Color("#ffc93c")
		4:
			return Color("#c77dff")
		_:
			return Color("#5aa9ff")


static func rarity_name(r: int) -> String:
	match r:
		5:
			return "SSR"
		4:
			return "SR"
		_:
			return "R"


static func box(color: Color, radius: int = 8, border_color: Color = Color(0, 0, 0, 0),
		border: int = 0, margin: float = 6.0) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = color
	s.set_corner_radius_all(radius)
	s.set_border_width_all(border)
	s.border_color = border_color
	s.set_content_margin_all(margin)
	return s


static func button(text: String, color: Color, font_size: int = 14) -> Button:
	var b := Button.new()
	b.text = text
	b.focus_mode = Control.FOCUS_NONE
	b.add_theme_font_size_override("font_size", font_size)
	b.add_theme_color_override("font_color", TEXT)
	b.add_theme_color_override("font_hover_color", Color.WHITE)
	b.add_theme_color_override("font_pressed_color", Color.WHITE)
	b.add_theme_color_override("font_disabled_color", MUTED.darkened(0.3))
	b.add_theme_stylebox_override("normal", box(color))
	b.add_theme_stylebox_override("hover", box(color.lightened(0.12)))
	b.add_theme_stylebox_override("pressed", box(color.darkened(0.15)))
	b.add_theme_stylebox_override("disabled", box(color.darkened(0.45)))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	return b


static func label(text: String, font_size: int, color: Color, centered: bool = false) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", color)
	if centered:
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	return l


static func wrapped(text: String, font_size: int, color: Color) -> Label:
	var l := label(text, font_size, color, true)
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return l


static func sprite(tex: Texture2D, px: float) -> TextureRect:
	var t := TextureRect.new()
	t.texture = tex
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	t.custom_minimum_size = Vector2(px, px)
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return t

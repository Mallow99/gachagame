class_name StarRow
extends Control
## Draws a row of rarity stars as polygons (no font glyphs needed).

var count := 3
var star_size := 12.0
var color := Color("#ffc93c")
## How many stars to draw; -1 means all. Used to pop them in one by one.
var shown := -1:
	set(v):
		shown = v
		queue_redraw()


func setup(n: int, px: float, c: Color) -> StarRow:
	count = n
	star_size = px
	color = c
	custom_minimum_size = Vector2(n * px, px)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()
	return self


func _draw() -> void:
	var n := count if shown < 0 else mini(shown, count)
	var start_x := (size.x - count * star_size) / 2.0
	for i in n:
		var c := Vector2(start_x + star_size * (i + 0.5), size.y / 2.0)
		var pts := PackedVector2Array()
		for k in 10:
			var r := star_size * (0.5 if k % 2 == 0 else 0.22)
			var a := -PI / 2.0 + k * PI / 5.0
			pts.append(c + Vector2(cos(a), sin(a)) * r)
		draw_colored_polygon(pts, color)

class_name Orb
extends Control
## The glowing summon orb. Its color teases the rarity.

var color := Color.WHITE:
	set(v):
		color = v
		queue_redraw()

var _t := 0.0


func _process(delta: float) -> void:
	if not is_visible_in_tree():
		return
	_t += delta
	queue_redraw()


func _draw() -> void:
	var c := size / 2.0
	var r := minf(size.x, size.y) * 0.2 * (1.0 + 0.06 * sin(_t * 8.0))
	for i in range(5, 0, -1):
		draw_circle(c, r * (1.0 + 0.3 * i), Color(color, 0.09))
	draw_circle(c, r, color)
	draw_circle(c - Vector2(r, r) * 0.3, r * 0.28, Color(1, 1, 1, 0.75))

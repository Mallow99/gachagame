class_name SpriteGen
extends RefCounted
## Procedural pixel critters: a mirrored random 10x10 body seeded by the
## character's id, so every hero and enemy always gets the same unique sprite.

const GRID := 10

static var _cache := {}


static func hero(id: String, hex: String, silhouette: bool = false) -> ImageTexture:
	var key := "%s|%s|%s" % [id, hex, silhouette]
	if _cache.has(key):
		return _cache[key]

	var rng := RandomNumberGenerator.new()
	rng.seed = hash(id)
	var base := Color(hex)

	# 0 empty, 1 body, 2 light, 3 dark, 4 eye
	var cells := []
	for y in GRID:
		var row := []
		row.resize(GRID)
		row.fill(0)
		cells.append(row)

	var half := int(GRID / 2.0)
	for y in GRID:
		for x in half:
			var p := 0.55 if x >= 2 else 0.3
			if y == 0 or y == GRID - 1:
				p *= 0.6
			if x == half - 1 and y >= 2 and y <= 7:
				p = 1.0 # solid spine keeps the body in one piece
			if rng.randf() < p:
				var shade := 1
				var r := rng.randf()
				if r < 0.2:
					shade = 2
				elif r < 0.4:
					shade = 3
				cells[y][x] = shade
				cells[y][GRID - 1 - x] = shade

	# Eyes, with body around them so they never float.
	for ex: int in [3, GRID - 4]:
		for off: Vector2i in [Vector2i(-1, 0), Vector2i(1, 0), Vector2i(0, -1), Vector2i(0, 1)]:
			var c: Vector2i = Vector2i(ex, 3) + off
			if cells[c.y][c.x] == 0:
				cells[c.y][c.x] = 1
		cells[3][ex] = 4

	var img := Image.create_empty(GRID + 2, GRID + 2, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))
	var palette := {
		1: base,
		2: base.lightened(0.3),
		3: base.darkened(0.25),
		4: Color.WHITE,
	}
	var outline := base.darkened(0.75)
	if silhouette:
		palette = {1: Color(0, 0, 0, 0.6), 2: Color(0, 0, 0, 0.6), 3: Color(0, 0, 0, 0.6), 4: Color(0, 0, 0, 0.6)}
		outline = Color(1, 1, 1, 0.08)

	for y in GRID:
		for x in GRID:
			var v: int = cells[y][x]
			if v != 0:
				img.set_pixel(x + 1, y + 1, palette[v])
	# Outline: empty pixels touching the body.
	for y in GRID + 2:
		for x in GRID + 2:
			if img.get_pixel(x, y).a > 0.0:
				continue
			for off: Vector2i in [Vector2i(-1, 0), Vector2i(1, 0), Vector2i(0, -1), Vector2i(0, 1)]:
				var cx: int = x - 1 + off.x
				var cy: int = y - 1 + off.y
				if cx >= 0 and cy >= 0 and cx < GRID and cy < GRID and cells[cy][cx] != 0:
					img.set_pixel(x, y, outline)
					break

	var tex := ImageTexture.create_from_image(img)
	_cache[key] = tex
	return tex

extends Node
## Procedural sound effects (autoload "Sfx") — no audio files needed.
## Every sound is a list of [start_hz, end_hz, seconds] notes. Respects Game.muted.

const RATE := 22050.0

var _players: Array[AudioStreamPlayer] = []
var _next := 0


func _ready() -> void:
	for i in 4:
		var gen := AudioStreamGenerator.new()
		gen.mix_rate = RATE
		gen.buffer_length = 2.0
		var p := AudioStreamPlayer.new()
		p.stream = gen
		p.volume_db = -10.0
		add_child(p)
		_players.append(p)


func play(notes: Array, vol: float = 0.3) -> void:
	if Game.muted:
		return
	var p := _players[_next]
	_next = (_next + 1) % _players.size()
	p.stop()
	p.play()
	var pb := p.get_stream_playback() as AudioStreamGeneratorPlayback
	if pb == null:
		return
	var buf := PackedVector2Array()
	var phase := 0.0
	for n in notes:
		var f0: float = n[0]
		var f1: float = n[1]
		var count := int(float(n[2]) * RATE)
		for i in count:
			var t := float(i) / count
			phase += TAU * lerpf(f0, f1, t) / RATE
			var env := minf(1.0, i / 150.0) * (1.0 - t)
			var s := (sin(phase) + 0.25 * sin(phase * 2.0)) * env * vol
			buf.append(Vector2(s, s))
	if pb.can_push_buffer(buf.size()):
		pb.push_buffer(buf)


func click() -> void:
	play([[1000, 1000, 0.025]], 0.12)


func tick() -> void:
	play([[1400, 1400, 0.02]], 0.1)


func error() -> void:
	play([[200, 150, 0.15]], 0.2)


func charge() -> void:
	play([[180, 700, 0.7]], 0.2)


func ding(rarity: int) -> void:
	var f := 660.0 if rarity == 3 else (784.0 if rarity == 4 else 988.0)
	play([[f, f, 0.25]])


func upgrade() -> void:
	play([[600, 1400, 0.25], [1400, 1400, 0.2]])


func reveal(rarity: int) -> void:
	match rarity:
		5:
			play([[523, 523, 0.07], [659, 659, 0.07], [784, 784, 0.07], [1047, 1047, 0.5]])
		4:
			play([[523, 523, 0.07], [659, 659, 0.07], [784, 784, 0.25]])
		_:
			play([[523, 523, 0.08], [659, 659, 0.15]], 0.2)


func star(i: int) -> void:
	var f := 880.0 * pow(1.12, i)
	play([[f, f * 1.05, 0.08]], 0.2)


func hit() -> void:
	play([[220, 80, 0.08]], 0.25)


func heal() -> void:
	play([[700, 1000, 0.12]], 0.2)


func win() -> void:
	play([[523, 523, 0.1], [659, 659, 0.1], [784, 784, 0.1], [1047, 1047, 0.4]])


func lose() -> void:
	play([[392, 392, 0.2], [330, 330, 0.2], [262, 200, 0.4]])

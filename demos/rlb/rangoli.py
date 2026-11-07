"""Animated turtle rangoli. Use --trace to export the same drawing for the web."""
import json
import math
import sys

PALETTE = ["#ffba6a", "#f87e9e", "#bd99ff", "#79e0cd"]
BACKGROUND = "#141022"


def point(radius, angle):
    return [round(radius * math.cos(angle), 3), round(radius * math.sin(angle), 3)]


def drawing():
    for ring, (radius, length, width, count) in enumerate(
        [(85, 86, 0.23, 16), (47, 86, 0.29, 16), (12, 65, 0.38, 8)]
    ):
        for index in range(count):
            angle = math.tau * (index + 0.5 * (ring % 2)) / count
            outline = []
            for step in range(65):
                t = math.tau * step / 64
                distance = radius + length * (1 - math.cos(t)) / 2
                outline.append(point(distance, angle + width * math.sin(t)))
            yield {"color": PALETTE[(ring + index) % 4], "points": outline}
    for radius in (7, 178, 183):
        yield {
            "color": PALETTE[0],
            "points": [point(radius, math.tau * step / 128) for step in range(129)],
        }
    for index in range(32):
        angle = math.tau * index / 32
        x, y = point(193, angle)
        yield {
            "color": PALETTE[index % 4],
            "points": [[round(x + dx, 3), round(y + dy, 3)]
                       for dx, dy in [(0, 3), (3, 0), (0, -3), (-3, 0), (0, 3)]],
        }


def animate():
    import turtle

    screen = turtle.Screen()
    screen.setup(520, 520)
    screen.bgcolor(BACKGROUND)
    screen.title("Animated rangoli")
    screen.tracer(0)
    pen = turtle.Turtle(visible=False)
    pen.width(2)
    strokes = iter(drawing())

    def draw_next():
        stroke = next(strokes, None)
        if stroke is None:
            return
        start, *points = stroke["points"]
        pen.penup()
        pen.goto(*start)
        pen.pencolor(stroke["color"])
        pen.pendown()
        for xy in points:
            pen.goto(*xy)
        screen.update()
        screen.ontimer(draw_next, 48)

    draw_next()
    screen.mainloop()


if __name__ == "__main__":
    if "--trace" in sys.argv:
        print(json.dumps(list(drawing()), separators=(",", ":")))
    else:
        animate()

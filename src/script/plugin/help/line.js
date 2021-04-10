export default function line(_this) {
    return (coords, {color}) => {
        _this.cts.beginPath()
        _this.cts.lineWidth = 4
        _this.cts.strokeStyle = color

        for (const [x, y] of coords) _this.cts.lineTo(x, y)

        _this.cts.stroke()
        _this.cts.closePath()
    }
}
export default function isOver(_this) {
    return (mouse, x, length) => {
        if (!mouse) return false

        const width = _this.DPI_WIDHT / length
        return Math.abs(x - mouse.x) < width / 2
    }
}
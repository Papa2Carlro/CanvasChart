export default function (xRatio, yRatio, yMin, _this) {
    return col => col.map((y, i) => [
        Math.floor((i - 1) * xRatio),
        Math.floor(_this.DPI_HEIGHT - _this.PADDING - ((y - yMin) / yRatio))
    ]).filter((_, i) => i !== 0)
}
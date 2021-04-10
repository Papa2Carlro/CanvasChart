export default function proxyHandler(_this) {
    return {
        set(...arg) {
            const result = Reflect.set(...arg)
            _this.clear()
            _this.raf = requestAnimationFrame(_this.paint.bind(_this))
            return result
        }
    }
}
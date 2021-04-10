export default function mousemove({clientX, clientY}) {
    const {left, top} = this.$canvas.getBoundingClientRect()
    this.proxy.mouse = {
        x: (clientX - left) * 2,
        tooltip: {
            left: clientX - left,
            top: clientY - top
        }
    }
}
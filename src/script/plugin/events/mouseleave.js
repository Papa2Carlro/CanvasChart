export default function mouseleave() {
    this.proxy.mouse = null
    this.$tip.hide()
}
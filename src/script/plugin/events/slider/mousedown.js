export default function mousedown(e) {
    const type = e.target.dataset.type
    const dimensions = {
        left: parseInt(this.$window.style.left),
        right: parseInt(this.$window.style.right),
        width: parseInt(this.$window.style.width)
    }

    switch (type) {
        case "window":
            const startX = e.pageX
            document.onmousemove = event => {
                const delta = startX - event.pageX
                if (delta === 0) return

                let left = dimensions.left - delta
                let right = this.WIDTH - left - dimensions.width

                this.setPosition(left, right)
                this.next()
            }
            break

        case "left":
        case "right":
            const _startX = e.pageX
            document.onmousemove = event => {
                const delta = _startX - event.pageX
                if (delta === 0) return

                if (type === 'left') {
                    const left = this.WIDTH - (dimensions.width + delta) - dimensions.right
                    const right = this.WIDTH - (dimensions.width + delta) - left

                    this.setPosition(left, right)
                } else if (type === 'right') {
                    const right = this.WIDTH - (dimensions.width - delta) - dimensions.left

                    this.setPosition(dimensions.left, right)
                }

                this.next()
            }
            break
    }
}
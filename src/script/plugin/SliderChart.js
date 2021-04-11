// Event
import mousedown from "./events/slider/mousedown"
import mouseup from "./events/slider/mouseup"
// Help
import computeBoundaries from "./help/computeBoundaries"
import toCords from "./help/toCords"
import line from "./help/line"
import css from "./help/css"
import computeXRatio from "./help/computeXRatio"
import computeYRatio from "./help/computeYRatio"

export default class SliderChart {
    constructor(root, data, constants) {
        // CONSTANTS
        this.WIDTH = constants.WIDTH
        this.MIN_WIDTH = this.WIDTH * .05 // 5%
        this.HEIGHT = 40
        this.PADDING = -5
        this.DPI_WIDTH = this.WIDTH * 2
        this.DPI_HEIGHT = this.HEIGHT * 2
        this.DEFAULT_WIDTH = this.WIDTH * .3 // 30%
        // DOM
        this.$root = root
        this.$canvas = this.$root.querySelector('canvas')
        // DOM Control
        this.$left = this.$root.querySelector('[data-el="left"]')
        this.$window = this.$root.querySelector('[data-el="window"]')
        this.$right = this.$root.querySelector('[data-el="right"]')

        this.cts = this.$canvas.getContext('2d')
        this.data = data
        this.nextFn = noop

        this.init()
    }

    init() {
        this.paint()
        this.setPosition(0, this.WIDTH - this.DEFAULT_WIDTH)

        this.$root.addEventListener('mousedown', mousedown.bind(this))
        document.addEventListener('mouseup', mouseup)
    }

    getPosition() {
        const left = parseInt(this.$left.style.width)
        const right = this.WIDTH - parseInt(this.$right.style.width)

        return [(left * 100) / this.WIDTH, (right * 100) / this.WIDTH]
    }
    setPosition(left, right) {
        const w = this.WIDTH - right - left

        if (w < this.MIN_WIDTH) {
            css(this.$window, {width: this.MIN_WIDTH + 'px'})
            return
        }
        if (left < 0) {
            css(this.$window, {left: 0})
            css(this.$left, {width: 0})
            return
        }
        if (right < 0) {
            css(this.$window, {right: 0})
            css(this.$right, {width: 0})
            return
        }

        css(this.$window, {width: w + 'px', left: left + 'px', right: right + 'px'})
        css(this.$right, {width: right + 'px'})
        css(this.$left, {width: left + 'px'})
    }

    paint() {
        const [yMin, yMax] = computeBoundaries(this.data)

        const xRatio = computeXRatio(this.DPI_WIDTH, this.data.columns[0].length)
        const yRatio = computeYRatio(this.DPI_HEIGHT, yMax, yMin)

        const yData = this.data.columns.filter(col => this.data.types[col[0]] === 'line')

        this.setSize()

        yData.map(toCords(xRatio, yRatio, this)).forEach((coords, idx) => {
            const color = this.data.colors[yData[idx][0]]
            line(this)(coords, {color})
        })
    }
    setSize() {
        css(this.$canvas, {
            width: this.WIDTH + 'px',
            height: this.HEIGHT + 'px'
        })

        this.$canvas.width = this.DPI_WIDTH
        this.$canvas.height = this.DPI_HEIGHT
    }

    next() {
        this.nextFn(this.getPosition())
    }
    subscribe(fn) {
        this.nextFn = fn
        fn(this.getPosition())
    }
}

function noop() {}
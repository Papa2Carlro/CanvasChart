// Class
import SliderChart from "./SliderChart"
// Event
import mouseleave from './events/mouseleave'
import mousemove from "./events/mousemove"
// Helpers
import computeBoundaries from "./help/computeBoundaries"
import computeYRatio from "./help/computeYRatio"
import computeXRatio from "./help/computeXRatio"
import proxyHandler from "./help/proxyHandler"
import toCords from "./help/toCords"
import toDate from "./help/toDate"
import isOver from "./help/isOver"
import tooltip from "./tooltip"
import line from "./help/line"
import css from "./help/css"

class Chart {
    constructor(root, data) {
        // CONSTANTS
        this.WIDTH = 600
        this.HEIGHT = 300
        this.PADDING = 40
        this.DPI_WIDTH = this.WIDTH * 2
        this.DPI_HEIGHT = this.HEIGHT * 2
        this.VIEW_WIDTH = this.DPI_WIDTH
        this.VIEW_HEIGHT = this.DPI_HEIGHT - this.PADDING * 2
        this.ROWS_COUNT = 6
        this.COLS_COUNT = 6
        this.CIRCLE_RADIUS = 8
        // DOM
        this.$root = document.body.querySelector(root)
        this.$canvas = this.$root.querySelector('[data-el="main"]')
        this.$sliderChart = this.$root.querySelector('[data-el="slider"]')
        this.$tip = tooltip(this.$root.querySelector("[data-el='tooltip']"))

        this.slider = new SliderChart(this.$sliderChart, data, {WIDTH: this.WIDTH})

        this.cts = this.$canvas.getContext('2d')
        this.data = data

        this.raf = null
        this.proxy = new Proxy({}, proxyHandler(this))

        this.init()
    }

    init() {
        this.slider.subscribe(pos => this.proxy.pos = pos)

        this.paint()
        this.$canvas.addEventListener('mousemove', mousemove.bind(this))
        this.$canvas.addEventListener('mouseleave', mouseleave.bind(this))
    }

    paint() {
        const length = this.data.columns[0].length
        const leftIndex = Math.round(length * this.proxy.pos[0] / 100)
        const rightIndex = Math.round(length * this.proxy.pos[1] / 100)

        const columns = this.data.columns.map(col => {
            const res = col.slice(leftIndex, rightIndex)
            if (typeof res[0] !== 'string') res.unshift(col[0])
            return res
        })

        const [yMin, yMax] = computeBoundaries({columns, types: this.data.types})

        const xRatio = computeXRatio(this.VIEW_WIDTH, columns[0].length)
        const yRatio = computeYRatio(this.VIEW_HEIGHT, yMax, yMin)

        const xData = columns.filter(col => this.data.types[col[0]] !== 'line')[0]
        const yData = columns.filter(col => this.data.types[col[0]] === 'line')

        this.setSize()
        this.yAxis(yMin, yMax)
        this.xAxis(xData, yData, xRatio)

        yData.map(toCords(xRatio, yRatio, this)).forEach((coords, idx) => {
            const color = this.data.colors[yData[idx][0]]
            line(this)(coords, {color})

            for (const [x, y] of coords) {
                if (isOver(this)(this.proxy.mouse, x, coords.length)) {
                    this.circle([x, y], color)
                    break
                }
            }
        })
    }

    circle([x, y], color) {
        this.cts.beginPath()
        this.cts.strokeStyle = color
        this.cts.fillStyle = '#fff'
        this.cts.arc(x, y, this.CIRCLE_RADIUS, 0, Math.PI * 2)
        this.cts.fill()
        this.cts.stroke()
        this.cts.closePath()
    }

    setSize() {
        css(this.$canvas, {
            width: this.WIDTH + 'px',
            height: this.HEIGHT + 'px'
        })

        this.$canvas.width = this.DPI_WIDTH
        this.$canvas.height = this.DPI_HEIGHT
    }
    yAxis(yMin, yMax) {
        const step = this.VIEW_HEIGHT / this.ROWS_COUNT
        const textStep = (yMax - yMin) / this.ROWS_COUNT

        this.cts.beginPath()
        this.cts.strokeStyle = '#bbb'
        this.cts.lineWidth = 1
        this.cts.font = 'normal 20px Helvetica, sans-serif'
        this.cts.fillStyle = '#96a2aa'

        for (let i = 1; i <= this.ROWS_COUNT; i++) {
            const y = step * i
            const text = Math.round(yMax - textStep * i)

            this.cts.fillText(text.toString(), 5, y + this.PADDING - 10)
            this.cts.moveTo(0, y + this.PADDING)
            this.cts.lineTo(this.DPI_WIDTH, y + this.PADDING)
        }

        this.cts.stroke()
        this.cts.closePath()
    }
    xAxis(data, yData, xRatio) {
        const {mouse} = this.proxy
        const step = Math.round(data.length / this.COLS_COUNT)
        this.cts.beginPath()

        for (let i = 1; i < data.length; i++) {
            const x = xRatio * i

            if ((i - 1) % step === 0) {
                const text = toDate(data[i])
                this.cts.fillText(text.toString(), x, this.DPI_HEIGHT - 10)
            }

            if (isOver(this)(mouse, x, data.length)) {
                this.cts.save()
                this.cts.moveTo(x, this.PADDING)
                this.cts.lineTo(x, this.DPI_HEIGHT - this.PADDING)
                this.cts.restore()

                this.$tip.show(this.proxy.mouse.tooltip, {
                    title: toDate(data[i]),
                    items: yData.map(col => ({
                        color: this.data.colors[col[0]],
                        name: this.data.names[col[0]],
                        value: col[i + 1]
                    }))
                })
            }
        }

        this.cts.stroke()
        this.cts.closePath()
    }

    clear() {
        this.cts.clearRect(0, 0, this.DPI_WIDTH, this.DPI_HEIGHT)
    }
    destroy() {
        cancelAnimationFrame(this.raf)
        this.$canvas.removeEventListener('mousemove', mousemove.bind(this))
        this.$canvas.removeEventListener('mouseleave', mouseleave.bind(this))
    }
}

export default Chart
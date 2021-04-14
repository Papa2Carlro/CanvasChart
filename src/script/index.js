import '../style/index.scss'
import Chart from "./plugin/Chart"
import data from './plugin/help/data.json'

new Chart('#chart', data[4], {
    width: 1050,
    height: 450,
    padding: 40,
    fontSize: 24,
    xTypeValue: 'value', // TimeStamp,
    line: {
        x: 6,
        y: 6
    },
    slider: {
        visible: true,
        defaultWidth: 30,
        height: 40
    },
    type: 'Line'
})
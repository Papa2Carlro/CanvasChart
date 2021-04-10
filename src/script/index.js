import '../style/index.scss'
import Chart from "./plugin/Chart"
import getChartData from "./plugin/help/data"

new Chart('#chart', getChartData())
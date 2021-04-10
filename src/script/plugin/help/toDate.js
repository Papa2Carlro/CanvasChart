export default function toDate(timeStamp) {
    const shortMouths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const date = new Date(timeStamp)

    return `${date.getDate()} ${shortMouths[date.getMonth()]}`
}
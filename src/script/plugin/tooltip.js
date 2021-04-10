import css from "./help/css"

const template = data => `
    <div class="tooltip-title">${data.title}</div>
    <ul class="tooltip-list">
        ${data.items.map(item => `
            <li class="tooltip-list-item">
                <div class="value" style="color: ${item.color}">${item.value}</div>
                <div class="name" style="color: ${item.color}">${item.name}</div>
            </li>`).join('\n')}
    </ul>`

export default function tooltip(el) {
    const clear = () => el.innerHTML = ''
    return {
        show({top, left}, data) {
            clear()
            const {width, height} = el.getBoundingClientRect()

            el.insertAdjacentHTML('afterbegin', template(data))
            css(el, {
                top: (top - height) + 'px',
                left: (left + width / 2) + 'px',
                visibility: 'visible',
                opacity: 1
            })
        },
        hide() {
            css(el, {visibility: 'hidden', opacity: 0})
        }
    }
}
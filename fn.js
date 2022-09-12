const X = "https://cdn-icons-png.flaticon.com/512/656/656857.png"
const get = selector => document.querySelector(selector)
const getAll = selector => document.querySelectorAll(selector)
const getRandom = (a) => Math.floor(Math.random() * a.length)
//Добавляет Крест или Круг в зависимости от очереди 
function addElem(e, p) {
    e.target.innerHTML = p ? '<div class ="circle"></div>' : `<img class="x" src="${X}">`
}

//Проврека наличия в массиве всех элементов с одним классом 
const every = (a, selector) => a.every(el => {
    if (el.firstChild) {
        if (el.firstChild.className === selector) return true
    }
})

export { get, getAll, getRandom, every, addElem }
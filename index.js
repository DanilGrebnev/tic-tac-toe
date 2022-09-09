document.addEventListener('DOMContentLoaded', () => {
    start()
})


function start() {
    const get = (selector) => document.querySelector(selector)
    const BTN_RES = get('#res')
    const BTN_START = get('#start')
    const CONTAINER = get('.container')
    const SELECT = get('select')
    const MENU = get('#menu')
    const URL = "https://cdn-icons-png.flaticon.com/512/656/656857.png"

    let count = 0;
    let player = true
    let dual = false
    let endGame = false

    //Создание поля 
    for (let i = 1; i <= 9; i++) {
        CONTAINER.insertAdjacentHTML('beforeend', `<div class="item" data-number="${i}"></div>`)
    }

    BTN_START.addEventListener('click', startGame)

    BTN_RES.addEventListener("click", restart)

    function startGame() {
        const value = SELECT.value
        dual = value === "people" ? true : false

        CONTAINER.addEventListener('click', main)

        MENU.style.display = "none"
        BTN_RES.style.display = "block"

    }

    async function main(e) {
        if (e.target.className === "item") {
            count++
            e.target.classList.add('active')
            addElem(e, player)

            check()
            player = !player
            if (!dual && count !== 9 && !endGame) {
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(bot())
                    }, 1000)
                })
                check()
            }
        }
    }

    //Бот
    function bot() {
        count++

        let arr = [...document.querySelectorAll(".item")]
            .filter(el => !el.classList.contains('active'))

        const random = getRandom(arr)

        arr[random].classList.add('active')
        arr[random].innerHTML = `<img class="x" src="${URL}">`

        player = !player
    }

    function getRandom(arr) {
        let a = Math.floor(Math.random() * arr.length)
        console.log("случайное число: ", a)
        return a
    }

    //Добавляет Крест или Круг в зависимости от очереди 
    function addElem(e, player) {
        if (player) {
            e.target.innerHTML = `<div class ="circle"></div>`
        } else {
            e.target.innerHTML = `<img class="x" src="${URL}">`
        }
    }

    //Проверка строк
    function row(p1, p2) {
        let a = []

        for (let i = p1; i <= p2; i++) {
            a.push(get(`.item[data-number="${i}"]`))
        }
        if (every(a, "circle")) {
            a.forEach(el => el.classList.add('line'))
            winner(1)
            return
        } else if (every(a, "x")) {
            a.forEach(el => el.classList.add('line'))
            winner(2)
        }
    }

    //Проверка колонок
    function col(p1, p2) {
        let a = []
        for (let i = p1; i <= p2; i += 3) {
            a.push(get(`.item[data-number="${i}"]`))
        }

        if (every(a, "circle")) {
            a.forEach(el => el.classList.add('col'))
            // a.at(0).classList.add('col')
            winner(1)
            return
        } else if (every(a, "x")) {
            a.forEach(el => el.classList.add('col'))
            // a.at(0).classList.add('col')
            winner(2)
        }
    }

    //Проверка диагоналей
    function diag(p1, p2, p3) {
        let a = []
        let c = p3 === "l" ? "l" : "r"
        let step = p3 === "l" ? 4 : 2

        for (let i = p1; i <= p2; i += step) {
            a.push(get(`.item[data-number="${i}"]`))
        }

        if (every(a, "circle")) {
            a.forEach(el => {
                el.classList.add(c)
            })
            winner(1)
            return
        } else if (every(a, "x")) {
            a.forEach(el => el.classList.add(c))
            winner(2)
        }
    }

    //Осуществляет проверку колонок, строк, диагоналей
    function check() {
        row(1, 3)
        row(4, 6)
        row(7, 9)
        col(1, 7)
        col(2, 8)
        col(3, 9)
        diag(1, 9, "l")
        diag(3, 7)
        if (count === 9 && !endGame) {
            winner(3)
        }
    }

    function timeOut(text) {
        setTimeout(() => {
            alert(text)
        }, 500)
    }

    //Функция, которая определяет победителя
    function winner(p) {
        if (p === 1) {
            timeOut('Победил игрок 1')
            endGame = true
            BTN_RES.style.display = "block"
            return
        } else if (p === 2) {
            timeOut("Победил игрок 2")
            endGame = true
            BTN_RES.style.display = "block"
            return
        } else {
            timeOut('Ничья')
            endGame = true
            BTN_RES.style.display = "block"
            return
        }

    }

    function every(a, selector) {
        return a.every(el => {
            if (el.firstChild) {
                if (el.firstChild.className === selector) {
                    return true
                }
            }
        })
    }

    function restart(e) {
        count = 0
        const ITEMS = document.querySelectorAll('.item')
        player = true
        ITEMS.forEach(el => {
            el.className = "item"
            el.innerHTML = ""
        })
        e.target.style.display = "none"
        endGame = false
        MENU.style.display = "block"
        CONTAINER.removeEventListener('click', main)
    }

}



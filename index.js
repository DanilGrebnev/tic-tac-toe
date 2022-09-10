document.addEventListener('DOMContentLoaded', main)

function main() {
    const get = selector => document.querySelector(selector)
    const getAll = selector => document.querySelectorAll(selector)
    const BTN_RES = get('#res')
    const BTN_START = get('#start')
    const CONTAINER = get('.container')
    const SELECT = get('select')
    const MENU = get('#menu')
    const URL = "https://cdn-icons-png.flaticon.com/512/656/656857.png"

    let count = 0
    let player = true
    let dual = false
    let endGame = false
    let win1 = false
    let win2 = false

    //Создание поля
    for (let i = 1; i <= 9; i++) {
        CONTAINER.innerHTML += `
        <div class="item" data-number="${i}"></div>
        `
    }

    BTN_START.onclick = startGame
    BTN_RES.onclick = restart

    function startGame() {
        const value = SELECT.value
        dual = value === "people" ? true : false
        CONTAINER.addEventListener('click', step)
        MENU.style.display = "none"
        BTN_RES.style.display = "block"
    }

    // 
    async function step(e) {
        if (e.target.className !== "item") return

        count++
        e.target.classList.add('active')
        addElem(e, player)
        check()
        player = !player

        //Если условия соблюдены, то бот сделает шаг
        if (!dual && count !== 9 && !endGame) {
            await new Promise(resolve => {
                setTimeout(() => resolve(bot()), 1000)
            })
            check()
        }

        if (win1) setTimeout(alert, 500, "Победил игрок 1")
        if (win2) setTimeout(alert, 500, "Победил игрок 2")
    }

    //Бот
    function bot() {
        //Бот случайно выбирает свободную ячейку и ходит в неё
        count++
        const arr = [...getAll(".item")]
            .filter(el => !el.classList.contains('active'))

        const random = getRandom(arr)
        arr[random].classList.add('active')
        arr[random].innerHTML = `<img class="x" src="${URL}">`
        player = !player
    }

    function getRandom(arr) {
        let a = Math.floor(Math.random() * arr.length)
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

    //Условие выбора победителя
    function choiceWin(a, p1) {
        if (every(a, "circle")) {
            a.forEach(el => el.classList.add(p1))
            winner(1)
            return
        } else if (every(a, "x")) {
            a.forEach(el => el.classList.add(p1))
            winner(2)
            return
        }
    }

    //Проверка строк
    function row(p1, p2) {
        let a = []
        for (let i = p1; i <= p2; i++) {
            a.push(get(`.item[data-number="${i}"]`))
        }
        choiceWin(a, 'line')
    }

    //Проверка колонок
    function col(p1, p2) {
        let a = []
        for (let i = p1; i <= p2; i += 3) {
            a.push(get(`.item[data-number="${i}"]`))
        }
        choiceWin(a, "col")
    }

    //Проверка диагоналей
    function diag(p1, p2, p3) {
        let a = []
        let c = p3 === "l" ? "l" : "r"
        let step = p3 === "l" ? 4 : 2

        for (let i = p1; i <= p2; i += step) {
            a.push(get(`.item[data-number="${i}"]`))
        }

        choiceWin(a, c)
    }

    //Осуществляет проверку колонок, строк, диагоналей
    function check() {
        if (count === 9 && !endGame) {
            winner(3)
            return
        }

        row(1, 3)
        row(4, 6)
        row(7, 9)
        col(1, 7)
        col(2, 8)
        col(3, 9)
        diag(1, 9, "l")
        diag(3, 7)
    }

    //Вывода на экран победителя
    function winner(p) {
        if (p === 1) {
            win1 = true
            endGame = true
            BTN_RES.style.display = "block"
            return
        } else if (p === 2) {
            win2 = true
            endGame = true
            BTN_RES.style.display = "block"
            return
        } else {
            setTimeout(alert, 500, "Ничья")
            endGame = true
            BTN_RES.style.display = "block"
            return
        }

    }
    //Проврека наличия в массиве всех элементов с одним классом 
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
        win1 = false
        win2 = false
    }

}

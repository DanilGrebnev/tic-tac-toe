document.addEventListener('DOMContentLoaded', main)

async function main() {
    const { get, getAll, getRandom, every, addElem } = await import('./fn.js')
    const X = "https://cdn-icons-png.flaticon.com/512/656/656857.png"
    const RESTART = get('#res')
    const START = get('#start')
    const CONTAINER = get('.container')
    const SELECT = get('select')
    const MENU = get('#menu')

    const state = {
        count: 0,
        player: true,
        dual: true,
        endGame: false,
        win1: false,
        win2: false
    }

    let o = JSON.parse(JSON.stringify(state))

    START.addEventListener('click', startGame)
    RESTART.addEventListener('click', restart)

    //Создание поля
    for (let i = 1; i <= 9; i++) {
        CONTAINER.innerHTML += `
        <div class="item" data-number="${i}"></div>
        `
    }

    //Начало игры
    function startGame() {
        if (SELECT.value === "bot") o.dual = false

        CONTAINER.addEventListener('click', step)
        MENU.style.display = "none"
        RESTART.style.display = "block"
    }

    // Условие шага 
    async function step(e) {
        const event = e.target
        if (event.className !== "item") return
        o.count++
        event.classList.add('active')
        addElem(e, o.player)
        check()
        o.player = !o.player

        //Если условия соблюдены, то бот сделает шаг
        if (!o.dual && o.count !== 9 && !o.endGame) {
            CONTAINER.removeEventListener('click', step)
            await new Promise(resolve => {
                setTimeout(() => resolve(bot()), 1000)
            })
            check()
            CONTAINER.addEventListener('click', step)
        }

        o.win1 && setTimeout(alert, 500, "Победил игрок 1")
        o.win2 && setTimeout(alert, 500, "Победил игрок 2")
    }

    //Бот
    function bot() {
        //Бот случайно выбирает свободную ячейку и ходит в неё
        o.count++
        const a = [...getAll(".item")].filter(el => !el.classList.contains('active'))
        const rand = getRandom(a)
        a[rand].classList.add('active')
        a[rand].innerHTML = `<img class="x" src="${X}">`
        o.player = !o.player
    }

    //Условие выбора победившего игрока
    function choiceWin(a, className) {
        (every(a, "circle") || every(a, "x")) && a.forEach(el => el.classList.add(className))
        every(a, "circle") && winner(1)
        every(a, "x") && winner(2)
    }

    //Проверка строк и колонок
    function rowCol(start, end, step = 1) {
        let a = []
        for (let i = start; i <= end; i += step) {
            a.push(get(`.item[data-number="${i}"]`))
        }
        choiceWin(a, step === 1 ? "line" : "col")
    }

    //Проверка диагоналей
    function diag(start, end, step = "r") {
        let a = []
        for (let i = start; i <= end; i += step === "l" ? 4 : 2) {
            a.push(get(`.item[data-number="${i}"]`))
        }
        choiceWin(a, step)
    }

    //Осуществляет проверку колонок, строк, диагоналей
    function check() {
        if (o.count === 9 && !o.endGame) return winner(3)
        //Проверка строк
        rowCol(1, 3)
        rowCol(4, 6)
        rowCol(7, 9)
        //Проверка колонок
        rowCol(1, 7, 3)
        rowCol(2, 8, 3)
        rowCol(3, 9, 3)
        //Проверка диагоналей
        diag(1, 9, "l")
        diag(3, 7)
    }

    //Вывода на экран победителя
    function winner(p) {
        if (p === 1 || p === 2 || p === 3) {
            RESTART.style.display = "block"
            o.endGame = true
        }

        p === 1 ? o.win1 = true : null
        p === 2 ? o.win2 = true : null
        p === 3 ? setTimeout(alert, 500, "Ничья") : null
    }

    function restart(e) {
        o = JSON.parse(JSON.stringify(state))
        getAll('.item').forEach(el => {
            el.className = "item"
            el.innerHTML = ""
        })
        e.target.style.display = "none"
        MENU.style.display = "block"
        CONTAINER.removeEventListener('click', step)
    }

}

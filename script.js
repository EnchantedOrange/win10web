const widthChange = document.getElementsByClassName('changeable-width');
const startMenu = document.getElementById('start-menu');
const dirs = document.getElementsByClassName('hidden-dir');
const popupMenus = document.getElementsByClassName('popup-menu');
const dirArrows = document.getElementsByClassName('roll-down-arrow');
const dirImgs = document.querySelectorAll('.dir-img');
const notificationBar = document.querySelector('#notification-bar');
const notificationTilesContainer = document.querySelector('#notification-bar-tiles-container');
const calendar = document.querySelector('#calendar');
const langIndicator = document.querySelector('#lang-indicator');
const langSelectorBars = document.querySelectorAll('.lang-selector-bar');
const volumeSlider = document.querySelector('#volume-slider');
const volumeBig = document.querySelector('#volume-big');



document.oncontextmenu = () => {return false};

function setCookie(name, value, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

function openDesktopApp() {
    openApp(false);
}
document.querySelectorAll('.desktop-icon').forEach(function(e) {
    e.addEventListener('click', openDesktopApp);
});
document.querySelectorAll('.taskbar-app').forEach(function(e) {
    e.addEventListener('click', openApp);
});
const minesweeper = document.querySelector('.minesweeper');
minesweeper.removeEventListener('click', openDesktopApp);
minesweeper.addEventListener('click', function() {
    openApp(false, 'minesweeper-window');
});
const snake = document.querySelector('.snake');
snake.removeEventListener('click', openDesktopApp);
snake.addEventListener('click', function() {
    openApp(false, 'snake-window');
});

function openApp(isTaskbar, windowClass) {
    const appIco = event.currentTarget.firstElementChild.getAttribute('src');
    const appName = event.currentTarget.lastElementChild.innerHTML;
    if (!isTaskbar) {
        const footerAppBar = document.createElement('div');
        footerAppBar.classList.add('taskbar-app', 'taskbar-app-open', 'hover');
        footerAppBar.innerHTML = `<img src="${appIco}"><p>${appName}</p>`;
        document.querySelector('.taskbar-apps').appendChild(footerAppBar);
        openWindow(appIco, appName, footerAppBar, isTaskbar, windowClass);
    } else {
        event.currentTarget.classList.add('taskbar-app-open');
        openWindow(appIco, appName, event.currentTarget, isTaskbar, windowClass);
    }
}

function openWindow(appIco, appName, footerAppBar, isTaskbar, windowClass) {
    const windowObject = document.createElement('div');
    windowObject.classList.add('window', windowClass);

    if (windowClass === 'minesweeper-window') {
        windowObject.innerHTML =
            `
            <div class="window-header">
                <div class="window-header-container">
                    <div class="window-header-logo">
                        <img src="${appIco}">
                    </div>
                    <p>${appName}</p>
                </div>
                <div class="window-control-buttons">
                    <div class="window-roll-button hover-colored"></div>
                    <div class="window-expand-button hover-colored"></div>
                    <div class="window-close-button"></div>
                </div>
            </div>
            <div class="window-body">
                <div class="first-column">
                    <div class="control">
                        <div class="container">
                            <div class="current-difficulty button"></div>
                            <ul class="choose-minesweeper-size">
                                <li id="easy">Easy</li>
                                <li id="medium">Medium</li>
                                <li id="hard">Hard</li>
                            </ul>
                        </div>
                        <div class="new-game button">New game</div>
                    </div>
                    <div class="field"></div>
                </div>
                <div class="store">
                    <div class="store-header">
                        <h1>Store</h1>
                        <p class="points"></p>
                    </div>
                    <div class="store-item">
                        <p>Mark 1 mine</p>
                        <div class="button" id="mark1mine">50 points</div>
                    </div>
                    <div class="store-item">
                        <p>Mark 3 mines</p>
                        <div class="button" id="mark3mines">125 points</div>
                    </div>
                    <div class="store-item">
                        <p>Mark 5 mines</p>
                        <div class="button" id="mark5mines">200 points</div>
                    </div>
                    <div class="store-item">
                        <p>Open a field without mines</p>
                        <div class="button" id="openfield">150 points</div>
                    </div>
                    <div class="store-item">
                        <p>Golden skin</p>
                        <div class="button" id="goldenskin">1500 points</div>
                    </div>
                </div>
            </div>
            `;

        let isGameOver = false;
        let mineList = [];
        let alreadyWorked = [];
        let exposedMines = 0;
        let dots;
        let points;
        try {
            points = parseInt(document.cookie.split('points=')[1].split(';')[0], 10);
        } catch(err) {
            points = 0;
        }

        const pointsCounter = windowObject.querySelector('.points');

        const defaultSkin = '#4983aa, #005e93';
        const goldenSkin = 'rgb(235,203,27), rgb(167,144,20)';
        let currentSkin = defaultSkin;
        try {
            if (document.cookie.split('skin=')[1].split(';')[0] === 'golden') {
                currentSkin = goldenSkin;
            }
        } catch(err) {
            null;
        }

        const easyDifficulty = {
            name: 'Easy',
            y: 8,
            x: 8,
            totalMines: 10
        };
        const mediumDifficulty = {
            name: 'Normal',
            y: 16,
            x: 16,
            totalMines: 40
        };
        const hardDifficulty = {
            name: 'Hard',
            y: 16,
            x: 30,
            totalMines: 99
        };

        let currentDifficulty = easyDifficulty;

        document.documentElement.style.setProperty('--minesweeper-skin', currentSkin);

        windowObject.querySelector('#easy').addEventListener('click', function() {
            currentDifficulty = easyDifficulty;
        });
        windowObject.querySelector('#medium').addEventListener('click', function() {
            currentDifficulty = mediumDifficulty;
        });
        windowObject.querySelector('#hard').addEventListener('click', function() {
            currentDifficulty = hardDifficulty;
        });

        windowObject.querySelector('.current-difficulty').innerHTML = currentDifficulty.name;

        windowObject.querySelector('.choose-minesweeper-size').addEventListener('click', function() {
            startNewGame();
        });

        function generateField() {
            windowObject.querySelector('.field').style.gridTemplateRows = `repeat(${currentDifficulty.y}, 1fr)`;
            windowObject.querySelector('.field').style.gridTemplateColumns = `repeat(${currentDifficulty.x}, 1fr)`;
            for (let y = 1; y <= currentDifficulty.y; y++) {
                for (let x = 1; x <= currentDifficulty.x; x++) {
                    let f = document.createElement('div');
                    const coords = `n${y}_${x}`;
                    f.classList.add('field-dot');
                    f.id = coords;
                    windowObject.querySelector('.field').appendChild(f);
                }
            }
            dots = windowObject.querySelectorAll('.field-dot');
        }

        generateField();

        function placeMines() {
            function randomlyPlaceMines() {
                const rand = Math.floor(Math.random() * currentDifficulty.x * currentDifficulty.y);
                if (mineList.includes(rand)) {
                    return randomlyPlaceMines();
                }
                return rand;
            }
            for (let x = 1; x <= currentDifficulty.totalMines; x++) {
                const rand = randomlyPlaceMines();
                dots[rand].classList.add('mine');
                mineList.push(rand);
                getSquaresAround(dots[rand]).forEach(function(sq) {
                    if (!sq.classList.contains('mine')) {
                        switch (sq.innerHTML) {
                            case '': sq.innerHTML = '1';
                                break;
                            case '1': sq.innerHTML = '2';
                                break;
                            case '2': sq.innerHTML = '3';
                                break;
                            case '3': sq.innerHTML = '4';
                                break;
                            case '4': sq.innerHTML = '5';
                                break;
                            case '5': sq.innerHTML = '6';
                                break;
                            case '6': sq.innerHTML = '7';
                                break;
                            case '7': sq.innerHTML = '8';
                                break;
                        }
                    }
                });
            }
            mineList.forEach(function(t) {
                dots[t].innerHTML = '';
            });
        }

        function getSquaresAround(i) {
            let squaresRaw = [];
            const y = parseInt(i.id.split('n')[1].split('_')[0], 10);
            const x = parseInt(i.id.split('_')[1], 10);
            squaresRaw.push(
                windowObject.querySelector(`#n${y - 1}_${x - 1}`),
                windowObject.querySelector(`#n${y - 1}_${x}`),
                windowObject.querySelector(`#n${y - 1}_${x + 1}`),
                windowObject.querySelector(`#n${y}_${x - 1}`),
                windowObject.querySelector(`#n${y}_${x + 1}`),
                windowObject.querySelector(`#n${y + 1}_${x - 1}`),
                windowObject.querySelector(`#n${y + 1}_${x}`),
                windowObject.querySelector(`#n${y + 1}_${x + 1}`)
            );
            let squares = [];
            squaresRaw.forEach(function(sqrw) {
                if (sqrw) {
                    squares.push(sqrw);
                }
            });
            return squares;
        }

        function exposeSquare(q, ignoreAlreadyWorked = false) {
            if ((!alreadyWorked.includes(q) || ignoreAlreadyWorked) && !q.classList.contains('mine')) {
                if (q.innerHTML !== '') {
                    q.classList.add('exposed-dot');
                    alreadyWorked.push(q);
                    if (ignoreAlreadyWorked) {
                        getSquaresAround(q).forEach(function(sq) {
                            exposeSquare(sq);
                        });
                    }
                } else {
                    q.classList.add('exposed-dot');
                    alreadyWorked.push(q);
                    getSquaresAround(q).forEach(function(sq) {
                        if (sq.innerHTML === '') {
                            exposeSquare(sq);
                        } else if(sq.classList.contains('flag')) {
                            null;
                        } else {
                            sq.classList.add('exposed-dot');
                        }
                    });
                }
            }
        }

        function checkFlaggedMines() {
            if (exposedMines >= currentDifficulty.totalMines) {
                dots.forEach(function(d) {
                    if (!d.classList.contains('mine')) {
                        d.classList.add('exposed-dot');
                    }
                });
                isGameOver = true;
                if (currentDifficulty.name === 'Easy') {
                    addPoints(50);
                } else if (currentDifficulty.name === 'Normal') {
                    addPoints(75);
                } else if (currentDifficulty.name === 'Hard') {
                    addPoints(100);
                }
                alert('You win!');
            }
        }

        function gameOver() {
            isGameOver = true;
            windowObject.querySelectorAll('.mine').forEach(function (d) {
                d.classList.add('mine-blown');
            });
            windowObject.querySelectorAll('.flag').forEach(function(f) {
                if (!f.classList.contains('mine')) {
                    f.innerHTML = '&#10006;';
                    f.style.fontSize = '30px';
                    f.style.color = '#c60000';
                }
            });
        }

        function startNewGame() {
            windowObject.querySelector('.field').innerHTML = '';
            mineList = [];
            alreadyWorked = [];
            exposedMines = 0;
            isGameOver = false;
            generateField();
            placeMines();
            setEventListenersForDots();
            windowObject.querySelector('.current-difficulty').innerHTML = currentDifficulty.name;
        }
        
        function exposeDotsAround(dot) {
            const mousedownBackground = `${currentSkin.split(', ')[1]}, ${currentSkin.split(', ')[0]}`;
            dot.style.backgroundImage = `linear-gradient(to bottom right, ${mousedownBackground})`;
            if (!dot.classList.contains('exposed-dot')) {
                getSquaresAround(dot).forEach(function(sq) {
                    sq.style.backgroundImage = `linear-gradient(to bottom right, ${mousedownBackground})`;
                });
            } else {
                let flagged = 0;
                let mined = 0;
                const tit = dot;
                getSquaresAround(tit).forEach(function(sq) {
                    sq.style.backgroundImage = `linear-gradient(to bottom right, ${mousedownBackground})`;
                    if (sq.classList.contains('flag')) {
                        flagged++;
                    }
                    if (sq.classList.contains('mine')) {
                        mined++;
                    }
                });
                if (flagged === mined) {
                    let exposeOrNot = true;
                    getSquaresAround(tit).forEach(function(sq) {
                        if ((sq.classList.contains('mine') && !sq.classList.contains('flag')) || (!sq.classList.contains('mine') && sq.classList.contains('flag'))) {
                            exposeOrNot = false;
                            gameOver();
                        }
                    });
                    if (exposeOrNot) {
                        exposeSquare(tit, true);
                    }
                }
            }
        }

        function setEventListenersForDots() {
            dots.forEach(function(d) {
                d.addEventListener('mousedown', function(event) {
                    if (!isGameOver) {
                        if (event.shiftKey && event.button === 0 && !this.classList.contains('flag')) {
                            exposeDotsAround(this);
                        } else if (event.button === 2 && !event.shiftKey) {
                            //RMB
                            if (!this.classList.contains('exposed-dot')) {
                                this.classList.toggle('flag');
                                if (this.classList.contains('mine')) {
                                    if (this.classList.contains('flag')) {
                                        exposedMines++;
                                    } else {
                                        exposedMines--;
                                    }
                                }
                                checkFlaggedMines();
                            }
                        } else if (event.button === 0 && !this.classList.contains('flag') && !event.shiftKey) {
                            //LMB
                            if (this.classList.contains('mine') && !this.classList.contains('flag')) {
                                gameOver();
                            } else {
                                exposeSquare(this);
                            }
                        }
                    }
                });
                d.addEventListener('mouseup', function(event) {
                    this.style.backgroundImage = `linear-gradient(to bottom right, ${currentSkin})`;
                    getSquaresAround(this).forEach(function(sq) {
                        sq.style.backgroundImage = `linear-gradient(to bottom right, ${currentSkin})`;
                    })
                });
                d.addEventListener('dblclick', function(event) {
                    exposeDotsAround(this);
                });
            });
        }

        function setInitialBackground() {
            setTimeout(() => {
                pointsCounter.style.backgroundColor = 'initial';
            }, 1000);
        }

        function markMines(minesNumber, price) {
            if (removePoints(price)) {
                for (let x = 0; x < minesNumber; x++) {
                    let mines = [];
                    windowObject.querySelectorAll('.mine').forEach((e) => {
                        if (!e.classList.contains('flag')) {
                            mines.push(e);
                        }
                    });
                    if (mines.length > 0) {
                        mines[Math.floor(Math.random() * mines.length)].classList.add('flag');
                        exposedMines++;
                    }
                }
                checkFlaggedMines();
            }
        }

        function addPoints(n) {
            points += n;
            setCookie('points', points, 30);
            pointsCounter.innerHTML = points;
            pointsCounter.style.backgroundColor = 'rgb(89, 252, 89)';
            setInitialBackground();
        }

        function removePoints(n) {
            if (!isGameOver) {
                if (points >= n) {
                    points -= n;
                    setCookie('points', points, 30);
                    pointsCounter.innerHTML = points;
                    pointsCounter.style.backgroundColor = 'rgb(247, 144, 61)';
                    setInitialBackground();
                    return true;
                } else {
                    notEnoughPoints();
                    return false;
                }
            }
        }

        function notEnoughPoints() {
            pointsCounter.style.backgroundColor = 'rgb(240, 67, 67)';
            setInitialBackground();
        }

        function setSkin() {
            dots.forEach((d) => {
                document.documentElement.style.setProperty('--minesweeper-skin', currentSkin);
                d.style.backgroundImage = `linear-gradient(to bottom right, ${currentSkin})`;
            });
        }

        placeMines();

        setEventListenersForDots();

        pointsCounter.innerHTML = points;

        windowObject.querySelector('.new-game').addEventListener('click', () => {
            startNewGame();
        });

        windowObject.querySelector('#mark1mine').addEventListener('click', () => {
            markMines(1, 50);
        });

        windowObject.querySelector('#mark3mines').addEventListener('click', () => {
            markMines(3, 125);
        });

        windowObject.querySelector('#mark5mines').addEventListener('click', () => {
            markMines(5, 200);
        });

        windowObject.querySelector('#openfield').addEventListener('click', () => {
            if (removePoints(150)) {
                let freeDots = [];
                dots.forEach((e) => {
                    if (e.innerHTML === '' && !alreadyWorked.includes(e) && !e.classList.contains('mine') && !e.classList.contains('flag')) {
                        freeDots.push(e);
                    }
                });
                exposeSquare(freeDots[Math.floor(Math.random() * freeDots.length)]);
            }
        });

        windowObject.querySelector('#goldenskin').addEventListener('click', () => {
            if (document.cookie.includes('skin=golden')) {
                currentSkin === goldenSkin ? currentSkin = defaultSkin : currentSkin = goldenSkin;
                setSkin();
            } else {
                if (removePoints(1500)) {
                    currentSkin = goldenSkin;
                    setSkin();
                    setCookie('skin', 'golden', 30);
                }
            }
        });
    } else if (windowClass === 'snake-window') {
        windowObject.innerHTML =
            `
            <div class="window-header">
                <div class="window-header-container">
                    <div class="window-header-logo">
                        <img src="${appIco}">
                    </div>
                    <p>${appName}</p>
                </div>
                <div class="window-control-buttons">
                    <div class="window-roll-button hover-colored"></div>
                    <div class="window-expand-button hover-colored"></div>
                    <div class="window-close-button"></div>
                </div>
            </div>
            <div class="window-body">
                <div class="control">
                    <div class="score">0</div>
                    <div class="new-game">New game</div>
                    <div class="help">?</div>
                    <div class="help-hidden">
                        <p>WASD/Arrows - move</p>
                        <p>Esc - pause</p>
                    </div>
                </div>
                <div class="field"></div>
                <div class="game-over-sign">
                    <h1>GAME OVER</h1>
                </div>
            </div>
            `;
        for (let y = 1; y <= 30; y++) {
            for (let x = 1; x <= 30; x++) {
                let f = document.createElement('div');
                const coords = `n${y}_${x}`;
                f.classList.add('field-dot');
                f.id = coords;
                windowObject.querySelector('.field').appendChild(f);
            }
        }

        const dots = windowObject.querySelectorAll('.field-dot');
        const gameOverSign = windowObject.querySelector('.game-over-sign');

        let snakeDirection;
        let firstClick = true;
        let snakeInterval;
        let isgameOver = false;
        let score = 0;
        let snakeLength = 0;
        let invincibilityLeft = 0;

        function placeFood() {
            const x = Math.floor(Math.random() * 30 * 30);
            if (dots[x].classList.contains('snake-body') || dots[x].classList.contains('snake-current-position')) {
                return placeFood();
            } else {
                dots[x].classList.add('food');
            }

            const randint = Math.floor(Math.random() * 10);
            if (randint === 1) {
                placeFoodExtra(x, 'food-extra');
            } else if (randint === 2) {
                placeFoodExtra(x, 'food-shrink');
            } else if (randint === 3) {
                placeFoodExtra(x, 'food-invincible');
            }
        }

        function placeFoodExtra(foodPlace, foodClass) {
            const x = Math.floor(Math.random() * 30 * 30);
            if (x === foodPlace || dots[x].classList.contains('snake-body') || dots[x].classList.contains('snake-current-position')) {
                return placeFoodExtra(foodPlace, foodClass);
            } else {
                dots[x].classList.add(foodClass);
            }
        }

        function eatFood(pos) {
            if (pos.classList.contains('food')) {
                score += 100;
                snakeLength++;
                pos.classList.remove('food');
                dots.forEach((i) => {
                    i.classList.remove('food-extra', 'food-shrink', 'food-invincible');
                });
                placeFood();
            } else if (pos.classList.contains('food-extra')) {
                score += 300;
                snakeLength += 3;
                pos.classList.remove('food-extra');
            } else if (pos.classList.contains('food-shrink')) {
                if (score >= 100) {
                    score -= 100;
                }
                if (snakeLength >= 1) {
                    snakeLength--;
                }
                pos.classList.remove('food-shrink');
            } else if (pos.classList.contains('food-invincible')) {
                invincibilityLeft = 20;
                windowObject.querySelectorAll('.snake-body').forEach((i) => {
                    i.classList.add('invincible-snake-body');
                });
                pos.classList.remove('food-invincible');
            }
            windowObject.querySelector('.score').innerHTML = score;
        }

        function getDirection(key) {
            let d;
            switch (key) {
                case 'ArrowUp':
                case 'ц':
                case 'w':
                    d = 'up';
                    break;
                case 'ArrowLeft':
                case 'ф':
                case 'a':
                    d = 'left';
                    break;
                case 'ArrowDown':
                case 'ы':
                case 's':
                    d = 'down';
                    break;
                case 'ArrowRight':
                case 'в':
                case 'd':
                    d = 'right';
                    break;
                case 'Escape':
                    d = 'pause';
                    break;
                default:
                    d = null;
            }
            return d;
        }

        function getNextSquare(snakePos, snakeDirection) {
            let toY = parseInt(snakePos.id.split('n')[1].split('_')[0], 10);
            let toX = parseInt(snakePos.id.split('_')[1], 10);

            switch (snakeDirection) {
                case 'up':
                    toY--;
                    break;
                case 'left':
                    toX--;
                    break;
                case 'down':
                    toY++;
                    break;
                case 'right':
                    toX++;
                    break;
                default:
                    return null;
            }

            if (toY === 0) {
                toY = 30;
            } else if (toY === 31) {
                toY = 1;
            }
            if (toX === 0) {
                toX = 30;
            } else if (toX === 31) {
                toX = 1;
            }

            return windowObject.querySelector(`#n${toY}_${toX}`);
        }

        function moveSnake() {
            const snakePos = windowObject.querySelector('.snake-current-position');

            windowObject.querySelectorAll('.snake-body').forEach((e) => {
                if (!isgameOver) {
                    let coef = parseInt(e.classList.toString().split('snake-body-')[1].split(' ')[0], 10);
                    e.classList.remove(`snake-body-${coef}`);
                    coef--;
                    if (coef === 0) {
                        e.classList.remove('snake-body');
                        if (invincibilityLeft > 0) {
                            e.classList.remove('invincible-snake-body');
                        }
                    } else {
                        e.classList.add(`snake-body-${coef}`);
                    }
                }
            });
            
            let nextPos = getNextSquare(snakePos, snakeDirection);
            dots.forEach((e) => {
                e.innerHTML = '';
            });
            snakePos.innerHTML = 'F';
            snakePos.classList.remove('snake-current-position');

            if (snakeLength > 0) {
                snakePos.classList.add('snake-body', `snake-body-${snakeLength}`);
                if (invincibilityLeft > 0) {
                    snakePos.classList.add('invincible-snake-body');
                    invincibilityLeft--;
                } else {
                    dots.forEach((i) => {
                        i.classList.remove('invincible-snake-body');
                    });
                }
            }

            if (nextPos.classList.toString().includes('food')) {
                eatFood(nextPos);
            } else if (nextPos.classList.contains('snake-body') && invincibilityLeft === 0) {
                gameOver();
            }

            nextPos.classList.add('snake-current-position');
        }

        function gameOver() {
            clearInterval(snakeInterval);
            isgameOver = true;
            gameOverSign.classList.add('game-over-sign-visible');
        }

        function newGame() {
            firstClick = true;
            isgameOver = false;
            score = 0;
            windowObject.querySelector('.score').innerHTML = '0';
            snakeLength = 0;
            clearInterval(snakeInterval);
            dots.forEach((e) => {
                e.classList = '';
                e.classList.add('field-dot');
            });
            windowObject.querySelector('#n5_5').classList.add('snake-current-position');
            placeFood();
            gameOverSign.classList.remove('game-over-sign-visible');
        }

        newGame();

        document.addEventListener('keydown', function() {
            const direction = getDirection(event.key);
            if (direction === 'pause') {
                clearInterval(snakeInterval);
                firstClick = true;
            } else if (direction) {
                const isSnakeBody = getNextSquare(windowObject.querySelector('.snake-current-position'), direction).innerHTML;
                if (!isgameOver && !isSnakeBody) {
                    snakeDirection = direction;
                    if (firstClick) {
                        snakeInterval = setInterval(moveSnake, 500);
                        firstClick = false;
                    }
                    moveSnake();
                }
            }
        });

        windowObject.querySelector('.new-game').addEventListener('click', () => {
            newGame();
        });
    } else {
        windowObject.innerHTML =
            `
            <div class="window-header">
                <div class="window-header-container">
                    <div class="window-header-logo">
                        <img src="${appIco}">
                    </div>
                    <p>${appName}</p>
                </div>
                <div class="window-control-buttons">
                    <div class="window-roll-button hover-colored"></div>
                    <div class="window-expand-button hover-colored"></div>
                    <div class="window-close-button"></div>
                </div>
            </div>
            <div class="window-body"></div>
            `;
    }

    const winHeader = windowObject.firstElementChild;
    function getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
    winHeader.addEventListener('mousedown', function(e) {
        let coords = getCoords(winHeader);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        function moveAt(e) {
            windowObject.style.left = e.pageX - shiftX + 'px';
            windowObject.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        winHeader.onmouseup = function() {
            document.onmousemove = null;
            winHeader.onmouseup = null;
        };
    });
    windowObject.querySelector('.window-roll-button').addEventListener('click', function() {
        windowObject.style.display = 'none';
    });
    windowObject.querySelector('.window-expand-button').onclick = function () {
        if (windowObject.classList.contains('window-opened')) {
            windowObject.style.left = '100px';
            windowObject.style.top = '50px';
        } else {
            windowObject.style.left = '0px';
            windowObject.style.top = '0px';
        }
        windowObject.classList.toggle('window-opened');
    };
    windowObject.querySelector('.window-close-button').addEventListener('click', function() {
        if (!isTaskbar) {
            document.querySelector('.taskbar-apps').removeChild(footerAppBar);
        } else {
            footerAppBar.classList.remove('taskbar-app-open');
            footerAppBar.addEventListener('click', openApp);
        }
        document.querySelector('body').removeChild(windowObject);
    });

    function toggleWindow() {
        if (windowObject.style.display !== 'none') {
            windowObject.style.display = 'none';
        } else {
            windowObject.style.display = 'block';
        }
    }

    footerAppBar.addEventListener('click', toggleWindow);

    if (isTaskbar) {
        footerAppBar.removeEventListener('click', openApp);
    }

    document.querySelector('body').appendChild(windowObject);

    startMenu.classList.remove('start-menu-open');
    for (let i = 0; i < widthChange.length; i++) {
        widthChange[i].classList.remove('side-buttons-container-open');
    }
    for (let i = 0; i < dirs.length; i++) {
        dirs[i].style.height = '0px';
    }
    for (let i = 0; i < dirArrows.length; i++) {
        dirArrows[i].src = 'images/roll-down-arrow.png';
    }
    for (let i = 0; i < dirImgs.length; i++) {
        dirImgs[i].src = 'images/start-menu-dir-closed.png';
    }
    for (let i = 0; i < popupMenus.length; i++) {
        popupMenus[i].classList.remove('popup-menu-open');
    }
    notificationBar.classList.remove('notification-bar-open');
}



volumeSlider.oninput = function() {
    document.querySelector('#volume-slider-output').innerHTML = this.value;
    if (parseInt(volumeSlider.value, 10) === 0) {
        volumeBig.src = 'images/volume-big-0.png';
    } else if (volumeSlider.value >= 1 && volumeSlider.value <= 32) {
        volumeBig.src = 'images/volume-big-1-32.png';
    } else if (volumeSlider.value >= 33 && volumeSlider.value <= 65) {
        volumeBig.src = 'images/volume-big-33-65.png';
    } else {
        volumeBig.src = 'images/volume-big.png';
    }
};

document.querySelector('#taskbar-internet').onclick = function () {document.querySelector('#network-menu').classList.toggle('network-menu-open')};

function selectLang(lang) {
    langIndicator.innerHTML = lang;
    for (let i = 0; i < langSelectorBars.length; i++) {
        langSelectorBars[i].style.backgroundColor = 'initial';
    }
    event.currentTarget.style.backgroundColor = 'rgb(77, 141, 164)';
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
function getMonthName(i) {
    i = monthNames[i];
    return i;
}

let now = new Date();
document.querySelector('#insert-time').innerHTML = now.toLocaleTimeString();
document.querySelector('#insert-date').innerHTML = String(now.getDate()) + ' ' + getMonthName(now.getMonth()) + ' ' + now.getFullYear() + ' г.';
document.querySelector('#taskbar-time').innerHTML = String(now.getHours()) + ':' + String(addZero(now.getMinutes()));

function updateTime() {
    let now = new Date();
    document.querySelector('#insert-time').innerHTML = now.toLocaleTimeString();
    document.querySelector('#insert-date').innerHTML = String(now.getDate()) + ' ' + getMonthName(now.getMonth()) + ' ' + now.getFullYear() + ' г.';
    document.querySelector('#taskbar-time').innerHTML = String(now.getHours()) + ':' + String(addZero(now.getMinutes()));
}

setInterval(updateTime, 1000);

function openSideButtonsContainer() {
    for (let i = 0; i < widthChange.length; i++) {
        widthChange[i].classList.toggle('side-buttons-container-open');
    }
}

function openStartMenu() {
    startMenu.classList.toggle('start-menu-open');
    if (!startMenu.classList.contains('start-menu-open')) {
        for (let i = 0; i < widthChange.length; i++) {
            widthChange[i].classList.remove('side-buttons-container-open');
        }
        for (let i = 0; i < dirs.length; i++) {
            dirs[i].style.height = '0px';
        }
        for (let i = 0; i < dirArrows.length; i++) {
            dirArrows[i].src = 'images/roll-down-arrow.png';
        }
        for (let i = 0; i < dirImgs.length; i++) {
            dirImgs[i].src = 'images/start-menu-dir-closed.png';
        }
        for (let i = 0; i < popupMenus.length; i++) {
            popupMenus[i].classList.remove('popup-menu-open');
        }
    }
    notificationBar.classList.remove('notification-bar-open');
}

function toggleCalendar() {
    calendar.classList.toggle('calendar-open');
}

function toggleDir() {
    let hiddenDir = event.currentTarget.nextElementSibling;
    let dirImg = event.currentTarget.firstElementChild.firstElementChild;
    let arrowImg = event.currentTarget.children[1];

    if (hiddenDir.style.height === '0px') {
        hiddenDir.style.height = (hiddenDir.children.length * 36).toString() + 'px';
        dirImg.src = 'images/start-menu-dir-open.png';
        arrowImg.src = 'images/roll-up-arrow.png'
    } else {
        hiddenDir.style.height = '0';
        dirImg.src = 'images/start-menu-dir-closed.png';
        arrowImg.src = 'images/roll-down-arrow.png'
    }
}

document.querySelectorAll('.toggle-popup')[0].addEventListener('click', function() {
    document.querySelector('.user-popup').classList.toggle('popup-menu-open');
});

document.querySelectorAll('.toggle-popup')[1].addEventListener('click', function() {
    document.querySelector('.power-popup').classList.toggle('popup-menu-open');
});

function toggleNotificationBar() {
    notificationBar.classList.toggle('notification-bar-open');
}

function notificationTilesToggle() {
    notificationTilesContainer.classList.toggle('container-small');
    if (notificationTilesContainer.classList.contains('container-small')) {
        event.currentTarget.innerHTML = 'Развернуть';
    } else {
        event.currentTarget.innerHTML = 'Свернуть';
    }
}

function toggleLangSelector() {
    document.querySelector('#lang-selector').classList.toggle('lang-selector-open');
}

function toggleVolumeMenu() {
    document.querySelector('#volume-menu').classList.toggle('volume-menu-open');
}
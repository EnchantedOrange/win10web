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



document.oncontextmenu = function (){return false};



const gradient = document.querySelector('.gradient-button');
gradient.addEventListener('mousemove', function(e) {
    const x = e.pageX - this.offsetLeft;
    const y = e.pageY - this.offsetTop;
    this.firstElementChild.style.left = `${x}px`;
    this.firstElementChild.style.top = `${y}px`;
});



function openDesktopApp() {
    openApp(false);
}
document.querySelectorAll('.desktop-icon').forEach(function(e) {
    e.addEventListener('dblclick', openDesktopApp);
});
document.querySelectorAll('.minesweeper').forEach(function(e) {
    e.removeEventListener('dblclick', openDesktopApp);
    e.addEventListener('dblclick', function() {
        openApp(false, 'minesweeper');
    });
});
document.querySelectorAll('.taskbar-app').forEach(function(e) {
    e.addEventListener('click', openApp);
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

    if (windowClass === 'minesweeper') {
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
                    <div class="container">
                        <div class="current-difficulty"></div>
                        <ul class="choose-minesweeper-size">
                            <li id="easy">Easy</li>
                            <li id="medium">Medium</li>
                            <li id="hard">Hard</li>
                        </ul>
                    </div>
                    <div class="new-game">New game</div>
                </div>
                <div class="field"></div>
            </div>
            `;

        let isGameOver = false;
        let mineList = [];
        let alreadyWorked = [];
        let exposedMines = 0;
        let dots;

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
            windowObject.querySelector('.field').innerHTML = '';
            mineList = [];
            alreadyWorked = [];
            exposedMines = 0;
            isGameOver = false;
            generateField();
            placeMines();
            setEventSistenersForDots();
            windowObject.querySelector('.current-difficulty').innerHTML = currentDifficulty.name;
        });

        function generateField() {
            windowObject.querySelector('.field').style.gridTemplateRows = `repeat(${currentDifficulty.y}, 1fr)`;
            windowObject.querySelector('.field').style.gridTemplateColumns = `repeat(${currentDifficulty.x}, 1fr)`;
            for (let y = 1; y <= currentDifficulty.y; y++) {
                for (let x = 1; x <= currentDifficulty.x; x++) {
                    let f = document.createElement('div');
                    const coords = `n${y.toString()}_${x.toString()}`;
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
                //Remove numbers from mines, idk why they appear, tell me please if you know
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

        function exposeSquare(q) {
            if (!alreadyWorked.includes(q)) {
                if (q.innerHTML !== '') {
                    q.classList.add('exposed-dot');
                    alreadyWorked.push(q);
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



        placeMines();

        function setEventSistenersForDots() {
            dots.forEach(function(d) {
                d.addEventListener('mousedown', function() {
                    if (!isGameOver) {
                        if (event.button === 2) {
                            //RMB
                            this.classList.toggle('flag');
                            if (this.classList.contains('mine')) {
                                if (this.classList.contains('flag')) {
                                    exposedMines += 1;
                                } else {
                                    exposedMines -= 1;
                                }
                            }
                            if (exposedMines === currentDifficulty.totalMines) {
                                dots.forEach(function(d) {
                                    if (!d.classList.contains('mine')) {
                                        d.classList.add('exposed-dot');
                                    }
                                });
                                alert('You win!');
                            }
                        } else if (event.button === 0 && !this.classList.contains('flag')) {
                            //LMB
                            if (this.classList.contains('mine') && !this.classList.contains('flag')) {
                                //Game over
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
                            } else {
                                exposeSquare(this);
                            }
                        }
                    }
                });
            });
        }

        setEventSistenersForDots();

        windowObject.querySelector('.new-game').addEventListener('click', function() {
            dots.forEach(function(d) {
                d.innerHTML = '';
                d.classList.remove('mine', 'mine-blown', 'flag', 'exposed-dot');
            });
            mineList = [];
            alreadyWorked = [];
            exposedMines = 0;
            placeMines();
            isGameOver = false;
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
        }
        document.querySelector('body').removeChild(windowObject);
        if (isTaskbar) {
            footerAppBar.addEventListener('click', openApp);
        }
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
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



const gradient = document.querySelector('.gradient-button');
gradient.addEventListener('mousemove', function(e) {
    const x = e.pageX - this.offsetLeft;
    const y = e.pageY - this.offsetTop;
    this.firstElementChild.style.left = `${x}px`;
    this.firstElementChild.style.top = `${y}px`;
});



function openApp() {
    const footerAppBar = document.createElement('div');
    const appIco = event.currentTarget.firstElementChild.getAttribute('src');
    footerAppBar.classList.add('taskbar-app', 'taskbar-app-open', 'hover');
    const appName = event.currentTarget.lastElementChild.innerHTML;
    footerAppBar.innerHTML = `<img src="${appIco}"><p>${appName}</p>`;

    document.querySelector('.taskbar-apps').appendChild(footerAppBar);
    openWindow(appIco, appName, footerAppBar);
}
document.querySelectorAll('.desktop-icon').forEach(function(e) {
    e.addEventListener('dblclick', openApp);
});

function openWindow(appIco, appName, footerAppBar) {
    const window = document.createElement('div');
    window.classList.add('window');
    window.innerHTML =
        '<div class="window-header">' +
            '<div class="window-header-container">' +
                '<div class="window-header-logo">' +
                    `<img src="${appIco}">` +
                '</div>' +
                `<p>${appName}</p>` +
            '</div>' +
            '<div class="window-control-buttons">' +
                '<div class="window-roll-button hover-colored"></div>' +
                '<div class="window-expand-button hover-colored"></div>' +
                '<div class="window-close-button"></div>' +
            '</div>' +
        '</div>' +
        '<div class="window-body"></div>';
    const winHeader = window.firstElementChild;
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
            window.style.left = e.pageX - shiftX + 'px';
            window.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        winHeader.onmouseup = function() {
            document.onmousemove = null;
            winHeader.onmouseup = null;
        };
    });
    window.querySelector('.window-roll-button').addEventListener('click', function() {
        window.style.display = 'none';
    });
    window.querySelector('.window-expand-button').onclick = function () {
        window.classList.toggle('window-opened');
        window.style.left = '0px';
        window.style.top = '0px';
    };
    window.querySelector('.window-close-button').addEventListener('click', function() {
        document.querySelector('.taskbar-apps').removeChild(footerAppBar);
        //document.querySelector('.taskbar-app').classList.remove('taskbar-app-open');
        document.querySelector('body').removeChild(window);
    });

    footerAppBar.addEventListener('click', function() {
        window.style.display = 'block';
    });

    document.querySelector('body').appendChild(window);

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
    if (volumeSlider.value == 0) {
        volumeBig.src = 'images/volume-big-0.png';
    } else if (volumeSlider.value >= 1 && volumeSlider.value <= 32) {
        volumeBig.src = 'images/volume-big-1-32.png';
    } else if (volumeSlider.value >= 33 && volumeSlider.value <= 65) {
        volumeBig.src = 'images/volume-big-33-65.png';
    } else {
        volumeBig.src = 'images/volume-big.png';
    }
}

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

function getMonthName(i, z) {
    const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    i = monthNames[i];
    if (z) {
        if (i.endsWith('т')) {
            i = i.split(i.charAt(i.length-1))[0] + 'а';
        } else {
            i = i.split(i.charAt(i.length-1))[0] + 'я';
        }
    }
    return i;
}

let now = new Date();
document.querySelector('#insert-time').innerHTML = now.toLocaleTimeString();
document.querySelector('#insert-date').innerHTML = String(now.getDate()) + ' ' + getMonthName(now.getMonth(), true) + ' ' + now.getFullYear() + ' г.';
document.querySelector('#taskbar-time').innerHTML = String(now.getHours()) + ':' + String(addZero(now.getMinutes()));

function updateTime() {
    let now = new Date();
    document.querySelector('#insert-time').innerHTML = now.toLocaleTimeString();
    document.querySelector('#insert-date').innerHTML = String(now.getDate()) + ' ' + getMonthName(now.getMonth(), true) + ' ' + now.getFullYear() + ' г.';
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

function togglePopupMenu(popup) {
    document.getElementById(popup).classList.toggle('popup-menu-open');
}

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
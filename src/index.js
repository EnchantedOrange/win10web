import './style.scss';
import './index.html';

import StartMenuDirOpen from './images/start-menu-dir-open.png';
import SettingsIcon from './images/settings-icon.png';
import RollDownArrow from './images/roll-down-arrow.png';
import StartMenuDirClosed from './images/start-menu-dir-closed.png';
import RollUpArrow from './images/roll-up-arrow.png';
import VolumeBig0 from './images/volume-big-0.png';
import VolumeBig1_32 from './images/volume-big-1-32.png';
import VolumeBig33_65 from './images/volume-big-33-65.png';
import VolumeBig from './images/volume-big.png';

const widthChange = document.getElementsByClassName('changeable-width');
const startButton = document.getElementsByClassName('start-button')[0];
const startMenu = document.getElementById('start-menu');
const dirs = document.getElementsByClassName('hidden-dir');
const popupMenus = document.getElementsByClassName('popup-menu');
const dirArrows = document.getElementsByClassName('roll-down-arrow');
const dirImgs = document.querySelectorAll('.dir-img');
const notificationBar = document.getElementById('notification-bar');
const notificationTilesContainer = document.getElementById(
  'notification-bar-tiles-container'
);
const calendar = document.getElementById('calendar');
const volumeMenu = document.getElementById('volume-menu');
const networkMenu = document.getElementById('network-menu');
const langSelector = document.getElementById('lang-selector');
const langSelectorBars = document.querySelectorAll('.lang-selector-bar');
const volumeSlider = document.getElementById('volume-slider');
const volumeBig = document.getElementById('volume-big');
const shellExperience = document.querySelectorAll('[tabindex]');
const desktop = document.querySelector('.desktop');

document.oncontextmenu = () => {
  return false;
};

function setCookie(name, value, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

desktop.style.gridTemplateColumns = `repeat(${Math.floor(
  +getComputedStyle(desktop).height.split('px')[0] / 100
)}, 1fr)`;
desktop.style.gridTemplateRows = `repeat(${Math.floor(
  +getComputedStyle(desktop).width.split('px')[0] / 100
)}, 1fr)`;

document.querySelectorAll('.taskbar-app').forEach(function (e) {
  e.addEventListener(
    'click',
    function () {
      openApp(true, this.dataset.class);
    },
    { once: true }
  );
});

document
  .getElementsByClassName('minesweeper')[0]
  .addEventListener('click', function () {
    openApp(false, 'minesweeper-window');
  });

document
  .getElementsByClassName('snake')[0]
  .addEventListener('click', function () {
    openApp(false, 'snake-window');
  });

document
  .getElementsByClassName('eso')[0]
  .addEventListener('click', function () {
    openApp(false, 'eso-window');
  });

document.getElementById('parameters').addEventListener('click', function () {
  openApp(false, 'parameters-window');
});

function openApp(isTaskbar, windowClass) {
  const appIco = event.currentTarget.firstElementChild.getAttribute('src');
  const appName = event.currentTarget.lastElementChild.innerHTML;
  if (!isTaskbar) {
    const footerAppBar = document.createElement('div');
    footerAppBar.classList.add('taskbar-app', 'taskbar-app-open', 'hover');
    footerAppBar.innerHTML = `<img src="${appIco}"><p>${appName}</p>`;
    document.querySelector('.taskbar-apps').append(footerAppBar);
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
    windowObject.innerHTML = `
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
                        <div class="wrapper">
                            <div class="new-game button">New game</div>
                            <div class="container">
                                <div class="current-difficulty button"></div>
                                <ul class="choose-minesweeper-size">
                                    <li id="easy">Easy</li>
                                    <li id="medium">Medium</li>
                                    <li id="hard">Hard</li>
                                </ul>
                            </div>
                        </div>
                        <div class="mines-counter"></div>
                    </div>
                    <ul class="field">
                    </ul>
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
                        <div class="button" id="mark3mines">130 points</div>
                    </div>
                    <div class="store-item">
                        <p>Mark 5 mines</p>
                        <div class="button" id="mark5mines">200 points</div>
                    </div>
                    <div class="store-item">
                        <p>Open a field without mines</p>
                        <div class="button" id="openfield">250 points</div>
                    </div>
                    <div class="store-item">
                        <p>Golden skin</p>
                        <div class="button" id="goldenskin">1000 points</div>
                    </div>
                </div>
            </div>
            `;

    const minesCounter = windowObject.getElementsByClassName(
      'mines-counter'
    )[0];
    const pointsCounter = windowObject.getElementsByClassName('points')[0];
    const field = windowObject.querySelector('.field');

    let isGameOver = false;
    let mineList = [];
    let alreadyWorked = [];
    let exposedMines = 0;
    let dots;
    let points;
    try {
      points = parseInt(document.cookie.split('points=')[1].split(';')[0], 10);
    } catch (err) {
      points = 0;
    }

    const defaultSkin = '#1ab96a';
    const goldenSkin = '#e2c417';

    let currentSkin = defaultSkin;

    try {
      if (document.cookie.split('skin=')[1].split(';')[0] === 'golden') {
        currentSkin = goldenSkin;
        windowObject.querySelector('#goldenskin').textContent = 'Toggle';
      }
    } catch (err) {
      null;
    }

    const easyDifficulty = {
      name: 'Easy',
      y: 8,
      x: 8,
      totalMines: 10,
    };
    const mediumDifficulty = {
      name: 'Medium',
      y: 16,
      x: 16,
      totalMines: 40,
    };
    const hardDifficulty = {
      name: 'Hard',
      y: 16,
      x: 30,
      totalMines: 99,
    };

    let currentDifficulty = easyDifficulty;

    document.documentElement.style.setProperty(
      '--minesweeper-skin',
      currentSkin
    );

    windowObject.querySelector('#easy').addEventListener('click', function () {
      currentDifficulty = easyDifficulty;
    });
    windowObject
      .querySelector('#medium')
      .addEventListener('click', function () {
        currentDifficulty = mediumDifficulty;
      });
    windowObject.querySelector('#hard').addEventListener('click', function () {
      currentDifficulty = hardDifficulty;
    });

    windowObject.querySelector('.current-difficulty').innerHTML =
      currentDifficulty.name;

    windowObject
      .querySelector('.choose-minesweeper-size')
      .addEventListener('click', function () {
        startNewGame();
      });

    function generateField() {
      field.style.gridTemplateRows = `repeat(${currentDifficulty.y}, 1fr)`;
      field.style.gridTemplateColumns = `repeat(${currentDifficulty.x}, 1fr)`;
      for (let y = 1; y <= currentDifficulty.y; y++) {
        for (let x = 1; x <= currentDifficulty.x; x++) {
          let f = document.createElement('li');
          const coords = `n${y}_${x}`;
          f.classList.add('field-dot');
          f.id = coords;
          field.append(f);
        }
      }
      dots = windowObject.querySelectorAll('.field-dot');
    }

    generateField();

    function placeMines() {
      function randomlyPlaceMines() {
        const rand = Math.floor(
          Math.random() * currentDifficulty.x * currentDifficulty.y
        );
        if (mineList.includes(rand)) {
          return randomlyPlaceMines();
        }
        return rand;
      }
      for (let x = 1; x <= currentDifficulty.totalMines; x++) {
        const rand = randomlyPlaceMines();
        dots[rand].classList.add('mine');
        mineList.push(rand);
        getSquaresAround(dots[rand]).forEach(function (sq) {
          if (!sq.classList.contains('mine')) {
            switch (sq.innerHTML) {
              case '':
                sq.innerHTML = '1';
                break;
              case '1':
                sq.innerHTML = '2';
                break;
              case '2':
                sq.innerHTML = '3';
                break;
              case '3':
                sq.innerHTML = '4';
                break;
              case '4':
                sq.innerHTML = '5';
                break;
              case '5':
                sq.innerHTML = '6';
                break;
              case '6':
                sq.innerHTML = '7';
                break;
              case '7':
                sq.innerHTML = '8';
                break;
            }
          }
        });
      }
      mineList.forEach(function (t) {
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
      squaresRaw.forEach(function (sqrw) {
        if (sqrw) {
          squares.push(sqrw);
        }
      });
      return squares;
    }

    function exposeSquare(q, ignoreAlreadyWorked = false) {
      if (
        (!alreadyWorked.includes(q) || ignoreAlreadyWorked) &&
        !q.classList.contains('mine')
      ) {
        q.classList.add('exposed-dot');
        if (q.innerHTML !== '') {
          alreadyWorked.push(q);
          if (ignoreAlreadyWorked) {
            getSquaresAround(q).forEach(function (sq) {
              exposeSquare(sq);
            });
          }
        } else {
          alreadyWorked.push(q);
          getSquaresAround(q).forEach(function (sq) {
            if (sq.innerHTML === '') {
              exposeSquare(sq);
            } else if (
              sq.classList.contains('flag') ||
              sq.classList.contains('question-flag')
            ) {
              null;
            } else {
              sq.classList.add('exposed-dot');
            }
          });
        }
      }
    }

    function checkFlaggedMines() {
      //Checks if winning conditions are fulfilled

      if (
        exposedMines === currentDifficulty.totalMines &&
        windowObject.getElementsByClassName('flag').length ===
          currentDifficulty.totalMines
      ) {
        dots.forEach(function (d) {
          if (!d.classList.contains('mine')) {
            d.classList.add('exposed-dot');
          }
        });

        isGameOver = true;

        if (currentDifficulty === easyDifficulty) {
          addPoints(50);
        } else if (currentDifficulty === mediumDifficulty) {
          addPoints(125);
        } else if (currentDifficulty === hardDifficulty) {
          addPoints(300);
        }

        alert('You win!');
      }
    }

    function gameOver() {
      isGameOver = true;

      windowObject.querySelectorAll('.mine').forEach(function (d) {
        d.classList.add('mine-blown');
      });

      windowObject.querySelectorAll('.flag').forEach(function (f) {
        if (!f.classList.contains('mine')) {
          f.innerHTML = '&#10006;';
          f.style.fontSize = '30px';
          f.style.color = '#c60000';
        }
      });

      windowObject.querySelectorAll('.question-flag').forEach(function (q) {
        if (!q.classList.contains('mine')) {
          q.innerHTML = '&#10006;';
          q.style.fontSize = '30px';
          q.style.color = '#c60000';
        }
      });
    }

    function startNewGame() {
      field.innerHTML = '';
      mineList = [];
      alreadyWorked = [];
      exposedMines = 0;
      isGameOver = false;
      generateField();
      placeMines();
      setMinesCounter();
      windowObject.querySelector('.current-difficulty').innerHTML =
        currentDifficulty.name;
    }

    function exposeDotsAround(dot) {
      let flagged = 0;
      let mined = 0;
      getSquaresAround(dot).forEach(function (sq) {
        if (sq.classList.contains('flag')) {
          flagged++;
        }
        if (sq.classList.contains('mine')) {
          mined++;
        }
      });
      if (flagged === mined) {
        let expose = true;
        getSquaresAround(dot).forEach(function (sq) {
          if (
            (sq.classList.contains('mine') && !sq.classList.contains('flag')) ||
            (!sq.classList.contains('mine') && sq.classList.contains('flag'))
          ) {
            expose = false;
            gameOver();
          }
        });
        if (expose) {
          exposeSquare(dot, true);
        }
      }
    }

    function setEventListenersForDots() {
      function RMBevent(sq) {
        if (!sq.classList.contains('exposed-dot')) {
          if (
            !sq.classList.contains('flag') &&
            !sq.classList.contains('question-flag')
          ) {
            sq.classList.add('flag');

            if (sq.classList.contains('mine')) {
              exposedMines++;
            }
          } else if (sq.classList.contains('flag')) {
            sq.classList.remove('flag');
            sq.classList.contains('mine') && exposedMines--;
            sq.classList.add('question-flag');
          } else if (sq.classList.contains('question-flag')) {
            sq.classList.remove('question-flag');
          }

          setMinesCounter();

          checkFlaggedMines();
        }
      }

      let touchTimer;

      {
        field.addEventListener('mousedown', (event) => {
          let target = event.target.closest('li');
          if (!target) return;
          if (!field.contains(target)) return;
          if (!isGameOver) {
            if (
              target.classList.contains('exposed-dot') &&
              event.shiftKey &&
              event.button === 0 &&
              !target.classList.contains('flag')
            ) {
              exposeDotsAround(target);
            } else if (event.button === 2 && !event.shiftKey) {
              //RMB
              RMBevent(target);
            } else if (
              event.button === 0 &&
              !target.classList.contains('flag') &&
              !target.classList.contains('question-flag') &&
              !event.shiftKey
            ) {
              //LMB
              if (
                target.classList.contains('mine') &&
                !target.classList.contains('flag')
              ) {
                gameOver();
              } else {
                exposeSquare(target);
              }
            }
          }
        });

        field.addEventListener('dblclick', (event) => {
          exposeDotsAround(event.target);
        });

        field.addEventListener('touchstart', (event) => {
          function funcToExec(sq) {
            if (sq.classList.contains('exposed-dot')) {
              exposeDotsAround(sq);
            } else {
              RMBevent(sq);
            }

            window.navigator.vibrate(50);
          }

          touchTimer = setTimeout(funcToExec, 300, event.target);
        });

        field.addEventListener('touchend', () => {
          clearTimeout(touchTimer);
        });

        field.addEventListener('touchmove', () => {
          clearTimeout(touchTimer);
        });
      }
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
            mines[Math.floor(Math.random() * mines.length)].classList.add(
              'flag'
            );
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
        document.documentElement.style.setProperty(
          '--minesweeper-skin',
          currentSkin
        );
        d.style.backgroundColor = currentSkin;
      });
    }

    function setMinesCounter() {
      const minesLeft =
        currentDifficulty.totalMines -
        windowObject.getElementsByClassName('flag').length;

      if (minesLeft >= 0) {
        minesCounter.innerHTML = minesLeft;
      }
    }

    placeMines();

    setEventListenersForDots();

    setMinesCounter();

    pointsCounter.innerHTML = points;

    windowObject.querySelector('.new-game').addEventListener('click', () => {
      startNewGame();
    });

    windowObject.querySelector('#mark1mine').addEventListener('click', () => {
      markMines(1, 50);
    });

    windowObject.querySelector('#mark3mines').addEventListener('click', () => {
      markMines(3, 130);
    });

    windowObject.querySelector('#mark5mines').addEventListener('click', () => {
      markMines(5, 200);
    });

    windowObject.querySelector('#openfield').addEventListener('click', () => {
      if (removePoints(250)) {
        let freeDots = [];
        dots.forEach((e) => {
          if (
            e.innerHTML === '' &&
            !alreadyWorked.includes(e) &&
            !e.classList.contains('mine') &&
            !e.classList.contains('flag')
          ) {
            freeDots.push(e);
          }
        });
        exposeSquare(freeDots[Math.floor(Math.random() * freeDots.length)]);
      }
    });

    windowObject.querySelector('#goldenskin').addEventListener('click', () => {
      if (document.cookie.includes('skin=golden')) {
        currentSkin === goldenSkin
          ? (currentSkin = defaultSkin)
          : (currentSkin = goldenSkin);
        setSkin();
      } else {
        if (removePoints(1000)) {
          currentSkin = goldenSkin;
          setSkin();
          setCookie('skin', 'golden', 100);
          windowObject.querySelector('#goldenskin').textContent = 'Toggle';
        }
      }
    });
  } else if (windowClass === 'snake-window') {
    windowObject.innerHTML = `
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
        windowObject.querySelector('.field').append(f);
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
      if (
        dots[x].classList.contains('snake-body') ||
        dots[x].classList.contains('snake-current-position')
      ) {
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
      if (
        x === foodPlace ||
        dots[x].classList.contains('snake-body') ||
        dots[x].classList.contains('snake-current-position')
      ) {
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
          let coef = parseInt(
            e.classList.toString().split('snake-body-')[1].split(' ')[0],
            10
          );
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
      } else if (
        nextPos.classList.contains('snake-body') &&
        invincibilityLeft === 0
      ) {
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
      windowObject
        .querySelector('#n5_5')
        .classList.add('snake-current-position');
      placeFood();
      gameOverSign.classList.remove('game-over-sign-visible');
    }

    newGame();

    document.addEventListener('keydown', function () {
      const direction = getDirection(event.key);
      if (direction === 'pause') {
        clearInterval(snakeInterval);
        firstClick = true;
      } else if (direction) {
        const isSnakeBody = getNextSquare(
          windowObject.querySelector('.snake-current-position'),
          direction
        ).innerHTML;
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
  } else if (windowClass === 'parameters-window') {
    windowObject.innerHTML = `
            <div class="window-header">
                <div class="window-header-container">
                    <div class="window-header-logo">
                        <img src=${SettingsIcon}>
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
                <div>
                    <p>Choose theme color:</p>
                    <input type="color" value="#4daccf">
                </div>
            </div>
            `;
    windowObject
      .querySelector('input[type="color"]')
      .addEventListener('change', function () {
        document.documentElement.style.setProperty('--theme-color', this.value);
        document.documentElement.style.setProperty(
          '--theme-color-lighten',
          lightenDarken(this.value, 18)
        );
        document.documentElement.style.setProperty(
          '--theme-color-darken',
          lightenDarken(this.value, -20)
        );
      });
  } else {
    windowObject.innerHTML = `
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

  function rollOrExpandWindow(windowObject) {
    if (windowObject.classList.contains('window-opened')) {
      windowObject.style.transform = 'translate(100px, 50px)';
      // windowObject.style.left = '100px';
      // windowObject.style.top = '50px';
    } else {
      windowObject.style.transform = 'translate(0, 0)';
      // windowObject.style.left = '0px';
      // windowObject.style.top = '0px';
    }
    windowObject.classList.toggle('window-opened');
  }

  winHeader.addEventListener('dblclick', function () {
    rollOrExpandWindow(windowObject);
  });

  function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  }

  winHeader.addEventListener('mousedown', function (e) {
    let coords = getCoords(winHeader);
    let shiftX = e.pageX - coords.left;
    let shiftY = e.pageY - coords.top;

    function moveAt(e) {
      windowObject.style.transform = `translate(${e.pageX - shiftX}px, ${
        e.pageY - shiftY
      }px)`;
    }

    document.onmousemove = function (e) {
      windowObject.classList.contains('window-opened') &&
        windowObject.classList.remove('window-opened');

      moveAt(e);
    };

    winHeader.onmouseup = function () {
      document.onmousemove = null;
      winHeader.onmouseup = null;
    };
  });

  windowObject
    .querySelector('.window-roll-button')
    .addEventListener('click', function () {
      windowObject.style.display = 'none';
    });

  windowObject
    .querySelector('.window-expand-button')
    .addEventListener('click', function () {
      rollOrExpandWindow(windowObject);
    });

  windowObject
    .querySelector('.window-close-button')
    .addEventListener('click', function () {
      if (!isTaskbar) {
        document.querySelector('.taskbar-apps').removeChild(footerAppBar);
      } else {
        footerAppBar.classList.remove('taskbar-app-open');
        footerAppBar.addEventListener(
          'click',
          () => {
            openApp(isTaskbar, windowClass);
          },
          { once: true }
        );
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

  document.querySelector('body').append(windowObject);

  startMenu.classList.remove('in-focus');

  for (let i = 0; i < widthChange.length; i++) {
    widthChange[i].classList.remove('side-buttons-container-open');
  }

  for (let i = 0; i < dirs.length; i++) {
    dirs[i].style.height = '0px';
  }

  for (let i = 0; i < dirArrows.length; i++) {
    dirArrows[i].src = RollDownArrow;
  }

  for (let i = 0; i < dirImgs.length; i++) {
    dirImgs[i].src = StartMenuDirClosed;
  }

  for (let i = 0; i < popupMenus.length; i++) {
    popupMenus[i].classList.remove('popup-menu-open');
  }

  notificationBar.classList.remove('in-focus');
}

document.getElementsByClassName('volume')[0].addEventListener('click', () => {
  volumeMenu.classList.add('in-focus');
  volumeMenu.focus();
});

document.getElementsByClassName('internet')[0].addEventListener('click', () => {
  networkMenu.classList.add('in-focus');
  networkMenu.focus();
});

document.getElementsByClassName('lang')[0].addEventListener('click', () => {
  langSelector.classList.add('in-focus');
  langSelector.focus();
});

document.getElementsByClassName('time')[0].addEventListener('click', () => {
  calendar.classList.add('in-focus');
  calendar.focus();
});

document
  .getElementsByClassName('notification-bar-open-button')[0]
  .addEventListener('click', () => {
    notificationBar.classList.add('in-focus');
    notificationBar.focus();
  });

function startButtonClickHandler() {
  if (startMenu.className === 'in-focus') {
    startMenu.className = '';
  } else {
    startMenu.className = 'in-focus';
    startMenu.focus();
    startButton.addEventListener(
      'click',
      () => {
        startMenu.className = '';
        startButton.addEventListener('click', startButtonClickHandler, {
          once: true,
        });
      },
      { once: true }
    );
  }
}

startButton.addEventListener('click', startButtonClickHandler, { once: true });

shellExperience.forEach((e) => {
  e.addEventListener('blur', function () {
    this.classList.remove('in-focus');
    if (e === startMenu) {
      for (let i = 0; i < widthChange.length; i++) {
        widthChange[i].classList.remove('side-buttons-container-open');
      }
      for (let i = 0; i < dirs.length; i++) {
        dirs[i].style.height = '0px';
      }
      for (let i = 0; i < dirArrows.length; i++) {
        dirArrows[i].src = RollDownArrow;
      }
      for (let i = 0; i < dirImgs.length; i++) {
        dirImgs[i].src = StartMenuDirClosed;
      }
      for (let i = 0; i < popupMenus.length; i++) {
        popupMenus[i].classList.remove('popup-menu-open');
      }
    }
  });
});

document.getElementById('open-tooltips').addEventListener('click', () => {
  for (let i = 0; i < widthChange.length; i++) {
    widthChange[i].classList.toggle('side-buttons-container-open');
  }
});

Array.from(document.getElementsByClassName('start-menu-dir')).forEach((dir) => {
  dir.addEventListener('click', () => {
    let hiddenDir = event.currentTarget.nextElementSibling;
    let dirImg = event.currentTarget.firstElementChild.firstElementChild;
    let arrowImg = event.currentTarget.children[1];

    if (hiddenDir.style.height === '0px') {
      hiddenDir.style.height =
        (hiddenDir.children.length * 36).toString() + 'px';
      dirImg.src = StartMenuDirOpen;
      arrowImg.src = RollUpArrow;
    } else {
      hiddenDir.style.height = '0';
      dirImg.src = StartMenuDirClosed;
      arrowImg.src = RollDownArrow;
    }
  });
});

document
  .getElementById('toggle-notification-tiles')
  .addEventListener('click', (event) => {
    notificationTilesContainer.classList.toggle('container-small');
    if (notificationTilesContainer.classList.contains('container-small')) {
      event.currentTarget.innerHTML = 'Развернуть';
    } else {
      event.currentTarget.innerHTML = 'Свернуть';
    }
  });

volumeSlider.addEventListener('change', (event) => {
  changeVolume(parseInt(event.currentTarget.value));
});

volumeSlider.addEventListener('mousemove', (event) => {
  changeVolume(parseInt(event.currentTarget.value));
});

let volumeSliderSavedValue;

volumeBig.addEventListener('click', () => {
  if (volumeSlider.value != 0) {
    volumeSliderSavedValue = volumeSlider.value;
    volumeSlider.value = 0;
    changeVolume(0);
  } else {
    volumeSlider.value = volumeSliderSavedValue;
    changeVolume(volumeSliderSavedValue);
  }
});

function changeVolume(value) {
  document.getElementById('volume-slider-output').innerHTML = value;

  if (value === 0) {
    volumeBig.src = VolumeBig0;
  } else if (value >= 1 && value <= 32) {
    volumeBig.src = VolumeBig1_32;
  } else if (value >= 33 && value <= 65) {
    volumeBig.src = VolumeBig33_65;
  } else {
    volumeBig.src = VolumeBig;
  }
}

for (const bar of langSelectorBars) {
  bar.addEventListener('click', (event) => {
    selectLang(event.currentTarget.dataset.language, event.currentTarget);
  });
}

function selectLang(language, currentBar) {
  document.getElementById('lang-indicator').innerText = language;

  langSelectorBars.forEach((bar) => {
    bar.classList.remove('lang-selector-bar-active');
  });

  currentBar.classList.add('lang-selector-bar-active');
}

{
  function addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const monthNamesGenitive = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  function getMonthName(month, genitive) {
    month = genitive ? monthNamesGenitive[month] : monthNames[month];
    return month;
  }

  let now = new Date(),
    calendarTime = new Date(now.getFullYear(), now.getMonth());
  updateTime(now);

  setInterval(() => {
    now.setSeconds(now.getSeconds() + 1);
    updateTime(now);
  }, 1000);

  function updateTime(now) {
    document.querySelector('#insert-time').innerHTML = now.toLocaleTimeString();
    document.querySelector('#insert-date').innerHTML =
      String(now.getDate()) +
      ' ' +
      getMonthName(now.getMonth(), true) +
      ' ' +
      now.getFullYear() +
      ' г.';
    document.querySelector('#taskbar-time').innerHTML =
      String(now.getHours()) + ':' + String(addZero(now.getMinutes()));
  }

  function updateCalendar(year, month) {
    let d = new Date(year, month);

    let table = '<tr>';

    for (let i = 0; i < getDay(d); i++) {
      table += '<td></td>';
    }

    while (d.getMonth() === month) {
      table += `<td>${d.getDate()}</td>`;
      if (getDay(d) === 6) table += '</tr><tr>';
      d.setDate(d.getDate() + 1);
    }

    if (getDay(d) !== 0) {
      for (let i = getDay(d); i < 7; i++) {
        table += '<td></td>';
      }
    }

    table += '</tr>';
    document.getElementById('calendar-table').tBodies[1].innerHTML = table;

    d.setDate(d.getDate() - 1);

    document.getElementsByClassName(
      'current-month'
    )[0].innerText = `${getMonthName(month, false)} ${d.getFullYear()}`;
  }

  function getDay(date) {
    // Monday = 0, Sunday = 6
    let day = date.getDay();
    if (day === 0) day = 7;
    return day - 1;
  }

  updateCalendar(now.getFullYear(), now.getMonth());

  document
    .getElementById('btn-container')
    .addEventListener('click', (event) => {
      if (event.target.classList.contains('prev')) {
        calendarTime.setMonth(calendarTime.getMonth() - 1);
      } else if (event.target.classList.contains('next')) {
        calendarTime.setMonth(calendarTime.getMonth() + 1);
      }
      updateCalendar(calendarTime.getFullYear(), calendarTime.getMonth());
    });

  document.getElementById('insert-date').addEventListener('click', () => {
    calendarTime = new Date(now.getFullYear(), now.getMonth());
    updateCalendar(calendarTime.getFullYear(), calendarTime.getMonth());
  });
}

document
  .querySelectorAll('.toggle-popup')[0]
  .addEventListener('click', function () {
    document.querySelector('.user-popup').classList.toggle('popup-menu-open');
  });

document
  .querySelectorAll('.toggle-popup')[1]
  .addEventListener('click', function () {
    document.querySelector('.power-popup').classList.toggle('popup-menu-open');
  });

document
  .getElementsByClassName('roll-all-windows')[0]
  .addEventListener('click', function () {
    const windows = document.querySelectorAll('.window');

    let openWindowsCount = 0;

    windows.forEach(function (win) {
      if (win.style.display !== 'none') {
        openWindowsCount++;
      }
    });

    if (openWindowsCount === 0) {
      windows.forEach(function (win) {
        win.style.display = 'block';
      });
    } else {
      windows.forEach(function (win) {
        win.style.display = 'none';
      });
    }
  });

function lightenDarken(hex, lightenDarken) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  l += lightenDarken;
  h = Math.round(360 * h);

  var colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

  return colorInHSL;
}

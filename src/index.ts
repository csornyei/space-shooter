import * as PIXI from 'pixi.js';
import backBgImage from './assets/background_back.jpg';
import middleBgImage from './assets/background_middle.png';
import frontBgImage from './assets/background_front.png';
import splashScreenImage from './assets/splashScreen.png';
import Player from './Player';
import Rocket from './Rocket';
import {SCREEN_SIZE, MOVE_SPEED, ROCKET_SPEED, SPLASH_SCREEN_FADE_OUT, BACKGROUND_SPEED} from './constants';
import Enemy from './Enemy';
import MainMenu from './MainMenu';
import Ship from './Ship';

const appSettings = {
    ...SCREEN_SIZE,
    backgroundColor: 0xaaaaaa
}

let app: PIXI.Application;
let mainMenu: MainMenu;
let gameContainer: PIXI.Container;
const pressedKeys: {[key: string]: boolean} = {};
const rockets: Rocket[] = [];
const enemies: Enemy[] = [];
let shootWithSpace = false;
let isGameRunning = false;

const game = () => {
    setup();
    app.loader
        .add('bgBack', backBgImage)
        .add('bgMiddle', middleBgImage)
        .add('bgFront', frontBgImage);
    app.loader.load();
    const splashScreen = getSplashScreen();
    app.stage.addChild(splashScreen);
    mainMenu = new MainMenu();
    mainMenu.container.alpha = 0;
    app.stage.addChild(mainMenu.container);
    let fadeOutInterval: NodeJS.Timeout;
    setTimeout(() => {
        fadeOutInterval = setInterval(() => {
            splashScreen.alpha -= 0.05;
            mainMenu.container.alpha += 0.05
            if (splashScreen.alpha < 0) {
                app.stage.removeChild(splashScreen);
                clearInterval(fadeOutInterval);
            }
        }, SPLASH_SCREEN_FADE_OUT.speed)
    }, SPLASH_SCREEN_FADE_OUT.total);

    mainMenu.setupMainMenuControlls(app.stage, {
        game: () => {
            if (!isGameRunning) {
                startGame()
            }
        },
        exit: () => window.location.href = 'https://csornyei.com '
    });
}

const setup = () => {
    app = new PIXI.Application(appSettings);
    document.querySelector('#root')!.appendChild(app.view);
    app.stage.interactive = true;
    app.renderer.render(app.stage);
}

const getSplashScreen = () => {
    const splashSprite = new PIXI.Sprite(PIXI.Texture.from(splashScreenImage));
    splashSprite.x = 0;
    splashSprite.y = 0;

    return splashSprite;
}

const startGame = () => {
    isGameRunning = true;
    app.stage.removeChild(mainMenu.container);
    app.stage.removeListener('pointerdown');
    gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);
    const backgroundSprite = createBackground(gameContainer);
    let bgX = 0;
    const player = new Player({x: SCREEN_SIZE.height / 2, y: SCREEN_SIZE.width / 2});
    gameContainer.addChild(player.sprite);

    const fireRocket = () => {
            const newRocket = player.fireRocket();
            rockets.push(newRocket);
            gameContainer.addChild(newRocket.sprite);
    }

    app.stage.on('pointermove', (e: PIXI.InteractionEvent) => player.followMouse(e));
    app.stage.on('pointerdown', fireRocket);
    const enemySpawnerInterval = setInterval(() => {
        const enemy = new Enemy();
        enemies.push(enemy);
        gameContainer.addChild(enemy.sprite);
        enemies.forEach((enemy) => {
            enemy.changeDirection();
        })
    }, 2000);

    const moveBg = () => {
        bgX -= BACKGROUND_SPEED;
        backgroundSprite.front.tilePosition.x = bgX;
        backgroundSprite.mid.tilePosition.x = bgX / 2;
        backgroundSprite.back.tilePosition.x = bgX / 4;
    }

    const keyboardActions = () => {
        const vector = {x: 0, y: 0}
        if (pressedKeys['w'] || pressedKeys['ArrowUp']) {
            vector.y -=  MOVE_SPEED;
        }
        if (pressedKeys['s'] || pressedKeys['ArrowDown']) {
            vector.y += MOVE_SPEED;
        }
        if (pressedKeys['a'] || pressedKeys['ArrowLeft']) {
            vector.x -= MOVE_SPEED;
        }
        if (pressedKeys['d'] || pressedKeys['ArrowRight']) {
            vector.x += MOVE_SPEED;
        }
        player.move(vector);
        if (pressedKeys[' ']) {
            if (!shootWithSpace) {
                fireRocket();
                shootWithSpace = true;
            }
        }
    }

    const shipExplode = (ship: Ship) => new Promise((resolve) => {
        const explosionContainer = new PIXI.Container();
        gameContainer.addChild(explosionContainer);
        ship.explode(explosionContainer);
        setTimeout(() => {
            gameContainer.removeChild(explosionContainer);
            resolve(null);
        }, 500);
    })

    const rocketHandler = () => {
        rockets.forEach((rocket, idx) => {
            rocket.move(ROCKET_SPEED);
            if (rocket.sprite.x > SCREEN_SIZE.width) {
                gameContainer.removeChild(rocket.sprite);
                rockets.splice(idx, 1);
            }
        });
    }

    const enemyHandler = () => {
        enemies.forEach((enemy, idx) => {
            console.log(`${idx} is moving`);
            enemy.move();

            if (enemy.isColliding(player.sprite)) {
                if (enemy.alive) {
                    if (player.alive) {
                        enemy.alive = false;
                    }
                    clearInterval(enemySpawnerInterval);
                    player.alive = false;
                    shipExplode(player).then(() => {
                        setTimeout(() => {
                            gameOver();
                        }, 200);
                    })
                    shipExplode(enemy).then(() => {
                        gameContainer.removeChild(enemy.sprite);
                        enemies.splice(idx, 1);
                    })
                }
            }
            rockets.some((rocket, rocketIdx) => {
                if (enemy.isColliding(rocket.sprite)) {
                    enemy.alive = false;
                    shipExplode(enemy).then(() => {
                        gameContainer.removeChild(enemy.sprite);
                        enemies.splice(idx, 1);
                    })
                    gameContainer.removeChild(rocket.sprite);
                    rockets.splice(rocketIdx, 1);
                    return;
                }
                return;
            });

            if (enemy.sprite.x < 0) {
                enemy.alive = false;
            }
        })
    }

    app.ticker.add(moveBg);
    app.ticker.add(keyboardActions);
    app.ticker.add(rocketHandler);
    app.ticker.add(enemyHandler);
}

const gameOver = () => {
    isGameRunning = false;
    enemies.splice(0, enemies.length);
    rockets.splice(0, rockets.length);
    gameContainer.removeChildren();
    app.stage.removeChild(gameContainer);
    app.stage.addChild(mainMenu.container);
    mainMenu.setupMainMenuControlls(app.stage, {
        game: () => {
            if (!isGameRunning) {
                startGame()
            }
        },
        exit: () => window.location.href = 'https://csornyei.com '
    });
}

const createBackground = (container: PIXI.Container) => {
    const bgBack = createBg(app.loader.resources['bgBack'].texture, container);
    const bgMiddle = createBg(app.loader.resources['bgMiddle'].texture, container);
    const bgFront = createBg(app.loader.resources['bgFront'].texture, container);

    return {
        back: bgBack,
        mid: bgMiddle,
        front: bgFront
    };
}

const createBg = (texture: PIXI.Texture, container: PIXI.Container) => {
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position.set(0,0);

    container.addChild(tiling);
    return tiling;
}

const keyDown = (e: KeyboardEvent) => {
    pressedKeys[e.key] = true;
}

const keyUp = (e: KeyboardEvent) => {
    pressedKeys[e.key] = false;
    if (e.key === ' ') {
        shootWithSpace = false;
    }
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

game();
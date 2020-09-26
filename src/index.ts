import * as PIXI from 'pixi.js';
import backgroundImage from './assets/background.jpg';
import splashScreenImage from './assets/splashScreen.png';
import logoImage from './assets/logo.png';
import Player from './Player';
import Rocket from './Rocket';
import {SCREEN_SIZE, MOVE_SPEED, ROCKET_SPEED, MAIN_MENU_STARS, BUTTON_SIZE} from './constants';
import Enemy from './Enemy';
import { getRandom } from './utils';

const appSettings = {
    ...SCREEN_SIZE,
    backgroundColor: 0xaaaaaa
}

let app: PIXI.Application;
let mainMenu: PIXI.Container
const pressedKeys: {[key: string]: boolean} = {};
const rockets: Rocket[] = [];
const enemies: Enemy[] = [];
let shootWithSpace = false;
let mainMenuInterval: NodeJS.Timeout;

const game = () => {
    setup();
    const splashScreen = getSplashScreen();
    app.stage.addChild(splashScreen);
    mainMenu = createMainMenu();
    mainMenu.alpha = 0;
    app.stage.addChild(mainMenu);
    let fadeOutInterval: NodeJS.Timeout;
    setTimeout(() => {
        fadeOutInterval = setInterval(() => {
            splashScreen.alpha -= 0.05;
            mainMenu.alpha += 0.05
            if (splashScreen.alpha < 0) {
                app.stage.removeChild(splashScreen);
                clearInterval(fadeOutInterval);
            }
        }, 100)
    }, 2000);
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

const createMainMenu = () => {
    const mainMenu = new PIXI.Container();

    // Background
    const mainMenuBackground = new PIXI.Graphics();
    mainMenuBackground.beginFill(0x000000);
    mainMenuBackground.drawRect(0,0, SCREEN_SIZE.width, SCREEN_SIZE.height);
    mainMenu.addChild(mainMenuBackground);

    // Background -> stars
    const stars: PIXI.Graphics[] = [];

    for (let i = 0; i < SCREEN_SIZE.width / MAIN_MENU_STARS.STAR_DENSITY; i++) {
        for (let j = 0; j < SCREEN_SIZE.height / MAIN_MENU_STARS.STAR_DENSITY; j++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF);
            star.drawStar(
                getRandom(MAIN_MENU_STARS.STAR_DENSITY*i, MAIN_MENU_STARS.STAR_DENSITY*(i + 1)),
                getRandom(MAIN_MENU_STARS.STAR_DENSITY*j, MAIN_MENU_STARS.STAR_DENSITY*(j+1)),
                6, 5);
            stars.push(star);
            mainMenu.addChild(star);
        }
    }

    mainMenuInterval = setInterval(() => {
        stars.forEach((star) => {
            if (Math.random() > MAIN_MENU_STARS.STAR_FADE_OUT_CHANCE) {
                const starFadeOutInterval = setInterval(() => {
                    star.alpha -= MAIN_MENU_STARS.STAR_FADE_OUT_AMOUNT;
                }, 100);
                setTimeout(() => {
                    clearInterval(starFadeOutInterval);
                    const starFadeBackInterval = setInterval(() => {
                        star.alpha += MAIN_MENU_STARS.STAR_FADE_OUT_AMOUNT;
                    }, 100);
                    setTimeout(() => {
                        clearInterval(starFadeBackInterval);
                    }, 1000);
                }, 1000);
            }
        })
    }, 500)

    // Logo
    const logo = new PIXI.Sprite(PIXI.Texture.from(logoImage));
    logo.anchor.set(0.5);
    logo.position.y = SCREEN_SIZE.height / 5;
    logo.position.x = SCREEN_SIZE.width / 2;
    mainMenu.addChild(logo);

    // Buttons
    const buttonTexts = ['GAME 1', 'GAME 2', 'GAME 3', 'EXIT'] as const;
    const buttons: {button: PIXI.Container, title: typeof buttonTexts[number] }[] = [];
    buttonTexts.forEach((text, idx) => {
        const buttonY = SCREEN_SIZE.height / 5 * 2 + idx * (BUTTON_SIZE.height + 40);
        const button = createButton(buttonY, text);
        buttons.push({button, title: text});
        mainMenu.addChild(button);
    });

    const mainMenuButtonClicked = (title: typeof buttonTexts[number]) => {
        switch (title) {
            case 'GAME 1':
            case 'GAME 2':
            case 'GAME 3':
                startGame();
                clearInterval(mainMenuInterval);
                break;
            case 'EXIT':
                window.location.href = 'https://csornyei.com '
                break;
        }
    }

    app.stage.on('pointerdown', (e: PIXI.InteractionEvent) => {
        const {x, y} = e.data.global;
        buttons.forEach((buttonElement) => {
            const {button, title} = buttonElement;
            if (
                x > button.x &&
                x < button.x + button.width &&
                y > button.y &&
                y < button.y + button.height) {
                    mainMenuButtonClicked(title);
                }
        })
    })

    return mainMenu;
}

const createButton = (previouseElement: number, text: string) => {
    const button = new PIXI.Container();
    button.position.x = SCREEN_SIZE.width / 2 - BUTTON_SIZE.width / 2
    button.position.y = previouseElement + 20;
    const buttonGraphics = new PIXI.Graphics();
    buttonGraphics.beginFill(0xaaaaaa).drawRect(0, 0, BUTTON_SIZE.width, BUTTON_SIZE.height)
    button.addChild(buttonGraphics);
    const buttonText = new PIXI.Text(text, {align: 'center', fontSize: 24});
    buttonText.anchor.set(0.5);
    buttonText.position.x = button.width / 2;
    buttonText.position.y = button.height / 2;
    button.addChild(buttonText);
    return button;
}

const startGame = () => {
    app.stage.removeChild(mainMenu);
    const backgroundSprite = createBackground()
    app.stage.addChild(backgroundSprite);
    const player = new Player({x: SCREEN_SIZE.height / 2, y: SCREEN_SIZE.width / 2});
    app.stage.addChild(player.sprite);

    const fireRocket = () => {
        const newRocket = player.fireRocket();
        rockets.push(newRocket);
        app.stage.addChild(newRocket.sprite);
    }

    app.stage.on('pointermove', (e: PIXI.InteractionEvent) => player.followMouse(e));
    app.stage.on('pointerdown', fireRocket);

    const enemySpawnerInterval = setInterval(() => {
        const enemy = new Enemy();
        enemies.push(enemy);
        app.stage.addChild(enemy.sprite);
        enemies.forEach((enemy) => {
            enemy.changeDirection();
        })
    }, 2000);

    const moveBg = () => {
        if (backgroundSprite.x < (backgroundSprite.texture.width - appSettings.width) * -1) {
            backgroundSprite.x = 0;
        } else {
            backgroundSprite.x -= .5;
        }
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

    const rocketHandler = (delta: any) => {
        rockets.forEach((rocket, idx) => {
            rocket.move(ROCKET_SPEED);
            if (rocket.sprite.x > SCREEN_SIZE.width) {
                app.stage.removeChild(rocket.sprite);
                rockets.splice(idx, 1);
            }
        });
    }

    const enemyHandler = (delta: number) => {
        enemies.forEach((enemy, idx) => {
            enemy.move();

            if (enemy.isColliding(player.sprite)) {
                if (player.alive) {
                    enemy.alive = false;
                }
                player.alive = false;
                clearInterval(enemySpawnerInterval);
                app.stage.removeChild(player.sprite);
                app.stage.removeChildren();
                app.stage.addChild(mainMenu);
            }
            rockets.some((rocket, rocketIdx) => {
                if (enemy.isColliding(rocket.sprite)) {
                    enemy.alive = false;
                    app.stage.removeChild(rocket.sprite);
                    rockets.splice(rocketIdx, 1);
                    return;
                }
                return;
            });

            if (enemy.sprite.x < 0) {
                enemy.alive = false;
            }
            if (!enemy.alive) {
                app.stage.removeChild(enemy.sprite);
                enemies.splice(idx, 1);
            }
        })
    }

    app.ticker.add(moveBg);
    app.ticker.add(keyboardActions);
    app.ticker.add(rocketHandler);
    app.ticker.add(enemyHandler);
}

const createBackground = () => {
    const backgroundSprite = new PIXI.Sprite(PIXI.Texture.from(backgroundImage));
    backgroundSprite.x = 0;
    backgroundSprite.y = 0;
    return backgroundSprite
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
// startGame();
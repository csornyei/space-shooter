import * as PIXI from 'pixi.js';
import backgroundImage from './assets/background.jpg';
import Player from './Player';
import Rocket from './Rocket';
import {SCREEN_SIZE, MOVE_SPEED} from './constants';


const appSettings = {
    ...SCREEN_SIZE,
    backgroundColor: 0xaaaaaa
}

const app = new PIXI.Application(appSettings);
const pressedKeys: {[key: string]: boolean} = {};
const rockets: Rocket[] = [];
let shootWithSpace = false;

const keyDown = (e: KeyboardEvent) => {
    pressedKeys[e.key] = true;
}

const keyUp = (e: KeyboardEvent) => {
    pressedKeys[e.key] = false;
    if (e.key === ' ') {
        shootWithSpace = false;
    }
}

document.querySelector('#root')!.appendChild(app.view);

// Background
const backgroundSprite = new PIXI.Sprite(PIXI.Texture.from(backgroundImage));
backgroundSprite.x = 0;
backgroundSprite.y = 0;
app.stage.addChild(backgroundSprite);

const player = new Player({x: app.view.height / 2, y: app.view.width / 2});

app.stage.addChild(player.player);

const fireRocket = () => {
    const newRocket = player.fireRocket();
    rockets.push(newRocket);
    app.stage.addChild(newRocket.rocket);
}

app.stage.interactive = true;
app.stage.on('pointermove', (e: PIXI.InteractionEvent) => player.followMouse(e));
app.stage.on('pointerdown', fireRocket);

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

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
    player.movePlayer(vector);
    if (pressedKeys[' ']) {
        if (!shootWithSpace) {
            fireRocket();
            shootWithSpace = true;
        }
    }
}

const rocketHandler = (delta: any) => {
    rockets.forEach((rocket, idx) => {
        rocket.move();
        if (rocket.rocket.x > SCREEN_SIZE.width) {
            app.stage.removeChild(rocket.rocket);
            rockets.splice(idx, 1);
        }
    });
}

app.ticker.add(moveBg);
app.ticker.add(keyboardActions);
app.ticker.add(rocketHandler);

app.renderer.render(app.stage);
import * as PIXI from 'pixi.js';
import Enemy1 from './assets/enemy/1.png';
import Enemy2 from './assets/enemy/2.png';
import Enemy3 from './assets/enemy/3.png';
import Enemy4 from './assets/enemy/4.png';
import Enemy5 from './assets/enemy/5.png';
import Enemy6 from './assets/enemy/6.png';
import Enemy7 from './assets/enemy/7.png';
import Enemy8 from './assets/enemy/8.png';
import { SCREEN_SIZE, ENEMY_SPEED, GAME_AREA_BORDER } from './constants';
import { getRandom } from './utils';

export default class Enemy {
    enemy: PIXI.AnimatedSprite;
    // x should be always positive, as enemies move from right to left
    movementVector: {x: number, y: number};

    constructor() {
        const enemyTextures = [Enemy1, Enemy2, Enemy3, Enemy4, Enemy5, Enemy6, Enemy7, Enemy8].map(pic => PIXI.Texture.from(pic));
        this.enemy = new PIXI.AnimatedSprite(enemyTextures);
        this.enemy.anchor.set(.5);
        this.enemy.width = 100;
        this.enemy.height = 100;
        this.enemy.x = SCREEN_SIZE.width;
        this.enemy.y = getRandom(GAME_AREA_BORDER, SCREEN_SIZE.height - GAME_AREA_BORDER);
        this.movementVector = {x: 5, y: 0};
    }

    calculateAngle() {
        this.enemy.angle = -90 - (Math.atan(this.movementVector.y / this.movementVector.x) * 180/Math.PI);
    }

    changeDirection() {
        this.movementVector = {x: getRandom(ENEMY_SPEED.x.min, ENEMY_SPEED.x.max), y: getRandom(ENEMY_SPEED.y.min, ENEMY_SPEED.y.max)};
        this.calculateAngle();
    }

    move() {
        this.enemy.position.x -= this.movementVector.x;
        this.enemy.position.y += this.movementVector.y;
        if (this.enemy.position.y < GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
        if (this.enemy.position.y > SCREEN_SIZE.height - GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: -1 * Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
    }
}
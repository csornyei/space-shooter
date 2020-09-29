import * as PIXI from 'pixi.js';
import EnemyImage from './assets/enemy.png';
import { SCREEN_SIZE, ENEMY_SPEED, GAME_AREA_BORDER } from './constants';
import Ship from './Ship';
import { getRandom } from './utils';

export default class Enemy extends Ship {
    // x should be always positive, as enemies move from right to left
    movementVector: {x: number, y: number};

    constructor() {
        super(EnemyImage);
        this.width = 100;
        this.height = 100;
        this.x = SCREEN_SIZE.width;
        this.y = getRandom(GAME_AREA_BORDER, SCREEN_SIZE.height - GAME_AREA_BORDER);
        this.movementVector = {x: 5, y: 0};
    }

    calculateAngle() {
        this.angle = -90 - (Math.atan(this.movementVector.y / this.movementVector.x) * 180/Math.PI);
    }

    changeDirection() {
        this.movementVector = {x: getRandom(ENEMY_SPEED.x.min, ENEMY_SPEED.x.max), y: getRandom(ENEMY_SPEED.y.min, ENEMY_SPEED.y.max)};
        this.calculateAngle();
    }

    move() {
        this.position.x -= this.movementVector.x;
        this.position.y += this.movementVector.y;
        if (this.position.y < GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
        if (this.position.y > SCREEN_SIZE.height - GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: -1 * Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
    }

    isColliding(collider: PIXI.Sprite | PIXI.AnimatedSprite) {
        const CORRECTION = 30;
        return (
            collider.x + collider.width > this.x + CORRECTION &&
            collider.x < this.x + this.width &&
            collider.y + collider.height > this.y &&
            collider.y < this.y + this.height
            )
    }
}
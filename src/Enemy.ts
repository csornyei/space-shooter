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
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.sprite.x = SCREEN_SIZE.width;
        this.sprite.y = getRandom(GAME_AREA_BORDER, SCREEN_SIZE.height - GAME_AREA_BORDER);
        this.movementVector = {x: 5, y: 0};
    }

    calculateAngle() {
        this.sprite.angle = -90 - (Math.atan(this.movementVector.y / this.movementVector.x) * 180/Math.PI);
    }

    changeDirection() {
        this.movementVector = {x: getRandom(ENEMY_SPEED.x.min, ENEMY_SPEED.x.max), y: getRandom(ENEMY_SPEED.y.min, ENEMY_SPEED.y.max)};
        this.calculateAngle();
    }

    move() {
        this.sprite.position.x -= this.movementVector.x;
        this.sprite.position.y += this.movementVector.y;
        if (this.sprite.position.y < GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
        if (this.sprite.position.y > SCREEN_SIZE.height - GAME_AREA_BORDER) {
            this.movementVector = {...this.movementVector, y: -1 * Math.abs(this.movementVector.y)}
            this.calculateAngle()
        }
    }

    isColliding(collider: PIXI.Sprite | PIXI.AnimatedSprite) {
        const CORRECTION = 30;
        return (
            collider.x + collider.width > this.sprite.x + CORRECTION &&
            collider.x < this.sprite.x + this.sprite.width &&
            collider.y + collider.height > this.sprite.y &&
            collider.y < this.sprite.y + this.sprite.height
            )
    }
}
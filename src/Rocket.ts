import * as PIXI from 'pixi.js';
import BulletImage from './assets/bullet.png';

export default class Rocket {
    rocket: PIXI.Sprite;
    speed: number;

    constructor(x: number, y: number, speed = 8) {
        this.rocket = new PIXI.Sprite(PIXI.Texture.from(BulletImage));
        this.rocket.anchor.set(0.5);
        this.rocket.x = x;
        this.rocket.y = y;
        this.rocket.width = 48;
        this.rocket.height = 48;
        this.rocket.angle = 90;
        this.speed = speed
    }

    move() {
        this.rocket.position.x += this.speed;
    }
}
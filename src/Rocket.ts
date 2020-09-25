import * as PIXI from 'pixi.js';
import BulletImage from './assets/bullet.png';
import Ship from './Ship';

export default class Rocket extends Ship {

    constructor(x: number, y: number) {
        super(BulletImage)
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = 48;
        this.sprite.height = 48;
        this.sprite.angle = 90;
    }
}
import BulletImage from './assets/bullet.png';
import Ship from './Ship';

export default class Rocket extends Ship {

    constructor(x: number, y: number) {
        super(BulletImage)
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.angle = 90;
    }
}
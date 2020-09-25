import * as PIXI from 'pixi.js';
import Rocket from './Rocket';
import playerImage from './assets/player.png';
import Ship from './Ship';

export default class Player extends Ship {

    constructor(startPosition: {x: number, y: number}) {
        super(playerImage)
        this.sprite.height = 128;
        this.sprite.width = 128;
        this.sprite.angle = 90;
        this.sprite.x = startPosition.x;
        this.sprite.y = startPosition.y;
    }

    followMouse(e: PIXI.InteractionEvent): void {
        const {x, y} = e.data.global;
        this.sprite.x = x;
        this.sprite.y = y;
    }


    fireRocket(): Rocket {
        return new Rocket(this.sprite.x + this.sprite.width / 2, this.sprite.y);
    }
}
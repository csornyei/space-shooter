import * as PIXI from 'pixi.js';
import Rocket from './Rocket';
import playerImage from './assets/player.png';
import Ship from './Ship';

export default class Player extends Ship {

    constructor(startPosition: {x: number, y: number}) {
        super(playerImage)
        this.height = 128;
        this.width = 128;
        this.angle = 90;
        this.x = startPosition.x;
        this.y = startPosition.y;
    }

    followMouse(e: PIXI.InteractionEvent): void {
        const {x, y} = e.data.global;
        this.x = x;
        this.y = y;
    }


    fireRocket(): Rocket {
        return new Rocket(this.x + this.width / 2, this.y);
    }
}
import * as PIXI from 'pixi.js';
import Rocket from './Rocket';
import playerImage1 from './assets/player/1.png';
import playerImage2 from './assets/player/2.png';
import playerImage3 from './assets/player/3.png';
import playerImage4 from './assets/player/4.png';
import playerImage5 from './assets/player/5.png';

export default class Player {
    player: PIXI.AnimatedSprite;

    constructor(startPosition: {x: number, y: number}) {
        const playerTextureArray = [playerImage1, playerImage2, playerImage3, playerImage4, playerImage5].map(pic => PIXI.Texture.from(pic));
        this.player = new PIXI.AnimatedSprite(playerTextureArray);
        this.player.animationSpeed = 3;
        this.player.height = 128;
        this.player.width = 128;
        this.player.angle = 90;
        this.player.anchor.set(0.5);
        this.player.x = startPosition.x;
        this.player.y = startPosition.y;
    }

    followMouse(e: PIXI.InteractionEvent): void {
        const {x, y} = e.data.global;
        this.player.x = x;
        this.player.y = y;
    }

    movePlayer(vector: {x: number, y: number}): void {
        this.player.x += vector.x;
        this.player.y += vector.y;
    }

    fireRocket(): Rocket {
        return new Rocket(this.player.x + this.player.width / 2, this.player.y);
    }
}
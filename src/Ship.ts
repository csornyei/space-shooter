import * as PIXI from 'pixi.js';

export default class Ship {
    sprite: PIXI.Sprite;
    alive: boolean;

    constructor(image: any) {
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(image));
        this.alive = true;
        this.sprite.anchor.set(.5);
    }

    move(vector: {x: number, y: number}) {
        this.sprite.position.x += vector.x;
        this.sprite.position.y += vector.y;
    }
}
import * as PIXI from 'pixi.js';
import * as particles from 'pixi-particles';
import explosion0 from './assets/explosion/1_0.png';
import explosion1 from './assets/explosion/1_1.png';
import explosion2 from './assets/explosion/1_2.png';
import explosion3 from './assets/explosion/1_3.png';
import explosion4 from './assets/explosion/1_4.png';
import explosion5 from './assets/explosion/1_5.png';
import explosion6 from './assets/explosion/1_6.png';
import explosion7 from './assets/explosion/1_7.png';
import explosion8 from './assets/explosion/1_8.png';
import explosion9 from './assets/explosion/1_9.png';
import explosion10 from './assets/explosion/1_10.png';
import explosion11 from './assets/explosion/1_11.png';
import explosion12 from './assets/explosion/1_12.png';
import explosion13 from './assets/explosion/1_13.png';
import explosion14 from './assets/explosion/1_14.png';
import explosion15 from './assets/explosion/1_15.png';
import explosion16 from './assets/explosion/1_16.png';

export default class Ship extends PIXI.Sprite {
    alive: boolean;

    constructor(image: any) {
        super(PIXI.Texture.from(image));
        this.alive = true;
        this.anchor.set(.5);
    }

    move(vector: {x: number, y: number}) {
        this.position.x += vector.x;
        this.position.y += vector.y;
    }

    explode(container: PIXI.Container) {
        const emitter = new particles.Emitter(container, [
            explosion0, explosion1, explosion2,
            explosion3, explosion4, explosion5,
            explosion6, explosion7, explosion8,
            explosion9, explosion10, explosion11,
            explosion12, explosion13, explosion14,
            explosion15, explosion16
        ], {
            alpha: {
                list: [
                    {
                        value: 0.8,
                        time: 0
                    },
                    {
                        value: 0.1,
                        time: 1
                    }
                ],
                isStepped: false
            },
            scale: {
                list: [
                    {
                        value: 1,
                        time: 0
                    },
                    {
                        value: 0.3,
                        time: 1
                    }
                ],
                isStepped: false
            },
            color: {
                list: [
                    {
                        value: "fb1010",
                        time: 0
                    },
                    {
                        value: "f5b830",
                        time: 1
                    }
                ],
                isStepped: false
            },
            speed: {
                list: [
                    {
                        value: 200,
                        time: 0
                    },
                    {
                        value: 100,
                        time: 1
                    }
                ],
                isStepped: false
            },
            startRotation: {
                min: 0,
                max: 360
            },
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.1,
                max: 1
            },
            frequency: 0.008,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0.31,
            maxParticles: 10,
            pos: {
                x: this.position.x,
                y: this.position.y
            },
            addAtBack: false,
            spawnType: "circle",
            spawnCircle: {
                x: 0,
                y: 0,
                r: 10
            }
        });

        let elapsed = Date.now();

        const update = () => {
            requestAnimationFrame(() => this.explode(container));
            let now = Date.now();
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };

        emitter.emit = true;
        update();
    }
}
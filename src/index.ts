import * as PIXI from 'pixi.js';
import background from './assets/background.jpg';

const appSettings = {
    width: 800,
    height: 600,
    backgroundColor: 0xaaaaaa
}

const app = new PIXI.Application(appSettings);

document.getElementById('root')?.appendChild(app.view);
const bgTexture = PIXI.Texture.from(background);
const backgroundSprite = new PIXI.Sprite(bgTexture);
backgroundSprite.x = 0;
backgroundSprite.y = 0;
app.stage.addChild(backgroundSprite);

const moveBg = () => {
    if (backgroundSprite.x < (backgroundSprite.texture.width - appSettings.width) * -1) {
        backgroundSprite.x = 0;
    } else {
        backgroundSprite.x -= 5;
    }
}

app.ticker.add(moveBg);

app.renderer.render(app.stage);
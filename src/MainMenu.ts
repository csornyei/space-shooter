import * as PIXI from 'pixi.js';
import logoImage from './assets/logo.png';
import { BUTTON_SIZE, MAIN_MENU_STARS, SCREEN_SIZE, BUTTON_TEXTS } from './constants';
import { getRandom } from './utils';

export default class MainMenu {
    container: PIXI.Container;
    mainMenuInterval: NodeJS.Timeout | null;
    buttons: {button: PIXI.Container, title: typeof BUTTON_TEXTS[number]}[]

    constructor() {
        this.container = new PIXI.Container();
        this.container.addChild(this.createBackground());
        this.mainMenuInterval = null;
        this.addStarsToBackground().forEach(star => this.container.addChild(star));
        this.container.addChild(this.createLogo());
        this.buttons = this.getButtons();
        this.buttons.forEach(({button}) => this.container.addChild(button))
    }

    createBackground() {
        const mainMenuBackground = new PIXI.Graphics();
        mainMenuBackground.beginFill(0x000000);
        mainMenuBackground.drawRect(0,0, SCREEN_SIZE.width, SCREEN_SIZE.height);
        return mainMenuBackground;
    }

    addStarsToBackground() {
        const stars: PIXI.Graphics[] = [];

        for (let i = 0; i < SCREEN_SIZE.width / MAIN_MENU_STARS.STAR_DENSITY; i++) {
            for (let j = 0; j < SCREEN_SIZE.height / MAIN_MENU_STARS.STAR_DENSITY; j++) {
                const star = new PIXI.Graphics();
                star.beginFill(0xFFFFFF);
                star.drawStar(
                    getRandom(MAIN_MENU_STARS.STAR_DENSITY*i, MAIN_MENU_STARS.STAR_DENSITY*(i + 1)),
                    getRandom(MAIN_MENU_STARS.STAR_DENSITY*j, MAIN_MENU_STARS.STAR_DENSITY*(j+1)),
                    6, 5);
                stars.push(star);
            }
        }

        this.mainMenuInterval = setInterval(() => {
            stars.forEach((star) => {
                if (Math.random() > MAIN_MENU_STARS.STAR_FADE_OUT_CHANCE) {
                    const starFadeOutInterval = setInterval(() => {
                        star.alpha -= MAIN_MENU_STARS.STAR_FADE_OUT_AMOUNT;
                    }, 100);
                    setTimeout(() => {
                        clearInterval(starFadeOutInterval);
                        const starFadeBackInterval = setInterval(() => {
                            star.alpha += MAIN_MENU_STARS.STAR_FADE_OUT_AMOUNT;
                        }, 100);
                        setTimeout(() => {
                            clearInterval(starFadeBackInterval);
                        }, 1000);
                    }, 1000);
                }
            })
        }, 500)
        return stars;
    }

    createLogo() {
        const logo = new PIXI.Sprite(PIXI.Texture.from(logoImage));
        logo.anchor.set(0.5);
        logo.position.y = SCREEN_SIZE.height / 5;
        logo.position.x = SCREEN_SIZE.width / 2;
        return logo;
    }

    createButton(previouseElement: number, text: string) {
        const button = new PIXI.Container();
        button.position.x = SCREEN_SIZE.width / 2 - BUTTON_SIZE.width / 2
        button.position.y = previouseElement + 20;
        const buttonGraphics = new PIXI.Graphics();
        buttonGraphics.beginFill(0xaaaaaa).drawRect(0, 0, BUTTON_SIZE.width, BUTTON_SIZE.height)
        button.addChild(buttonGraphics);
        const buttonText = new PIXI.Text(text, {align: 'center', fontSize: 24});
        buttonText.anchor.set(0.5);
        buttonText.position.x = button.width / 2;
        buttonText.position.y = button.height / 2;
        button.addChild(buttonText);
        return button;
    }

    getButtons() {
        return BUTTON_TEXTS.map((text, idx) => {
            const buttonY = SCREEN_SIZE.height / 5 * 2 + idx * (BUTTON_SIZE.height + 40);
            const button = this.createButton(buttonY, text);
            return {button, title: text};
        });
    }

    isClickedOnButton = (button: PIXI.Container, mousePosition: {x: number, y: number}) => (
        mousePosition.x > button.x &&
        mousePosition.x < button.x + button.width &&
        mousePosition.y > button.y &&
        mousePosition.y < button.y + button.height
    );

    setupMainMenuControlls = (stage: PIXI.Container, actions: {game: () => void, exit: () => void}) => {
        stage.on('pointerdown', (e: PIXI.InteractionEvent) => {
            this.buttons.forEach((buttonElement) => {
                const {button, title} = buttonElement;
                if ( this.isClickedOnButton(button, e.data.global) ) {
                    switch (title) {
                        case 'GAME 1':
                        case 'GAME 2':
                        case 'GAME 3':
                            actions.game();
                            clearInterval(this.mainMenuInterval!);
                            break;
                        case 'EXIT':
                            actions.exit();
                            break;
                    }
                }
            });
        });
    }
}
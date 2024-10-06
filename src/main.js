import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { gameWindow } from './vars';

const config = {
    type: Phaser.WEBGL,
    width: gameWindow.width,
    height: gameWindow.height,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            },
            enableSleeping: true
        }
        
    },
    scene: [
        MainMenu,
        Boot,
        Preloader,
        Game
        
    ]
};

export default new Phaser.Game(config);

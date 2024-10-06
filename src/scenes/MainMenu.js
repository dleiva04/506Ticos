import { Scene } from 'phaser';
import { gameWindow } from '../vars';
export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    
    create() {
        // Display a message to prompt the player to start the game
        this.add.text(gameWindow.width / 2, 300, 'Press ENTER to Start', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Capture Enter key input
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Add a listener for the Enter key
        console.log('antes')
        this.enterKey.on('down', () => {
            console.log('dentro')
            this.scene.start('Game'); // Transition to the GameScene when Enter is pressed
        });
    }
}
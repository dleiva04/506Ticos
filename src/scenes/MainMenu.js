import { Scene } from 'phaser';
import { gameWindow } from '../vars';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        // Load the background image
        this.load.image('background', 'assets/background.jpg');

        // Load the title image
        this.load.image('title', 'assets/title.png');

        // Load the background music
        this.load.audio('backgroundMusic', 'assets/backgroundMusic.mp3');
    }

    create() {
        // Play the background music
        const music = this.sound.add('backgroundMusic', { loop: true, volume: 0.1 });
        music.play();

        // Add the background image and scale it to fill the entire screen
        const background = this.add.image(0, 0, 'background').setOrigin(0);
        background.displayWidth = gameWindow.width;
        background.displayHeight = gameWindow.height;

        // Add the title image
        const title = this.add.image(gameWindow.width / 2, 350, 'title').setOrigin(0.5);

        // Add the description text
        this.add.text(gameWindow.width / 2, 500, 'A game that allows you to find near-earth objects on the solar system based on real NASA data', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Add the "Press ENTER to Start" text
        const startText = this.add.text(gameWindow.width / 2, 600, 'Press ENTER to Start', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Create a flickering effect for the start text
        this.time.addEvent({
            delay: 500,
            callback: () => {
                startText.visible = !startText.visible;
            },
            loop: true
        });

        // Capture Enter key input
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Add a listener for the Enter key
        this.enterKey.on('down', () => {
            music.stop(); // Stop the background music
            this.scene.start('Game'); // Transition to the GameScene when Enter is pressed
        });
    }
}
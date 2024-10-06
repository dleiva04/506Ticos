import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {

    }

    preload() {
        this.load.setPath('assets');

        // load all main menu assets
        this.load.image('star', 'assets/star.png');
        this.load.image('bigStar', 'assets/bigstar.png');
        this.load.image('ship', 'assets/rocket.png');
    }

    create() {
        
        this.scene.start('Game');
    }
}

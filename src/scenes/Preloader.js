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

    }

    create() {
        this.scene.start('Game');
    }
}

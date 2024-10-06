import { Scene } from 'phaser';
import { gameConfig, planetData } from '../vars';

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('star', 'assets/star.png');
        this.load.image('bigStar', 'assets/bigstar.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('mercury', 'assets/mercury.png');
        this.load.image('venus', 'assets/venus.png');
        this.load.image('earth', 'assets/earth.png');
        this.load.image('mars', 'assets/mars.png');
        this.load.image('jupiter', 'assets/jupiter.png');
        this.load.image('saturn', 'assets/saturn.png');
        this.load.audio('backgroundMusic2', 'assets/backgroundMusic2.mp3');
        this.load.image('title', 'assets/title.png');
    }

    create() {

        // Add music
        const music = this.sound.add('backgroundMusic2', { loop: true, volume: 0.1 });
        music.play();
    
        // Set the world bounds
        this.matter.world.setBounds(0, 0, gameConfig.canvasSize, gameConfig.canvasSize);
        this.cameras.main.setBounds(0, 0, gameConfig.canvasSize, gameConfig.canvasSize).setName('main');
    
        // Create minimap
        this.minimap = this.cameras.add(0, this.cameras.main.height - 300, 300, 300).setZoom(0.05).setName('mini');
        this.minimap.setBackgroundColor(0x002244);
    
        // Draw orbits
        const centerX = gameConfig.canvasSize / 2;
        const centerY = gameConfig.canvasSize / 2;
        this.drawOrbits(centerX, centerY);
    
        // Create the sun and planets
        const sun = this.add.image(centerX, centerY, 'sun');
        sun.setDisplaySize(6955, 6955);

        // Position planets
        this.mercury = this.add.image(centerX, centerY, 'mercury').setScale(0.25).setDisplaySize(146.4, 146.4);
        this.venus = this.add.image(centerX, centerY, 'venus').setScale(0.5).setDisplaySize(363.1, 363.1);
        this.earth = this.add.image(centerX, centerY, 'earth').setScale(0.1).setDisplaySize(382.3, 382.3);
        this.mars = this.add.image(centerX, centerY, 'mars').setScale(0.20).setDisplaySize(203.4, 159.2);
        this.jupiter = this.add.image(centerX, centerY, 'jupiter').setScale(0.5).setDisplaySize(4194.6, 4194.6);
        this.saturn = this.add.image(centerX, centerY, 'saturn').setScale(0.9).setDisplaySize(6000, 2500);
    
        // Add labels for each planet
        this.labels = {
            mercury: this.add.text(0, 0, 'Mercury', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5),
            venus: this.add.text(0, 0, 'Venus', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5),
            earth: this.add.text(0, 0, 'Earth', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5),
            mars: this.add.text(0, 0, 'Mars', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5),
            jupiter: this.add.text(0, 0, 'Jupiter', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5),
            saturn: this.add.text(0, 0, 'Saturn', { fontSize: '400px', fill: '#fff' }).setOrigin(0.5)
        };
    
        this.orbitAngle = 0; 
        this.createStarfield();
        // Position the ship near Earth
        const earthOrbitRadius = planetData.earth.orbitRadius; 
        const earthStartAngle = planetData.earth.startAngle;
        const shipX = centerX + earthOrbitRadius * Math.cos(earthStartAngle);
        const shipY = centerY + earthOrbitRadius * Math.sin(earthStartAngle);

        // Create player ship at calculated position
        this.player = this.matter.add.sprite(shipX, shipY, 'ship')
            .setFixedRotation(false)
            .setFrictionAir(0.5)
            .setMass(30)
            .setScale(0.1);

        // Follow player with the main camera
        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set the minimap to follow the player
        this.minimap.startFollow(this.player);

        // Ensure player is visible on the minimap
        this.minimap.scrollX = this.player.x - this.minimap.width / 2;
        this.minimap.scrollY = this.player.y - this.minimap.height / 2;
    }
    

    update() {
        this.playerUpdate();
        this.updateMinimap();
        this.updateOrbit(this.mercury, planetData.mercury, this.labels.mercury);
        this.updateOrbit(this.venus, planetData.venus, this.labels.venus);
        this.updateOrbit(this.earth, planetData.earth, this.labels.earth);
        this.updateOrbit(this.mars, planetData.mars, this.labels.mars);
        this.updateOrbit(this.jupiter, planetData.jupiter, this.labels.jupiter);
        this.updateOrbit(this.saturn, planetData.saturn, this.labels.saturn);
    }

    createStarfield() {
        // Create a group of stars
        var group = this.add.group({ key: 'star', frameQuantity: gameConfig.canvasSize });
        group.createMultiple({ key: 'bigStar', frameQuantity: 7000 });
        var rect = new Phaser.Geom.Rectangle(0, 0, gameConfig.canvasSize, gameConfig.canvasSize);
        Phaser.Actions.RandomRectangle(group.getChildren(), rect);
        group.children.iterate(function (child) {
            var sf = Math.max(0.3, Math.random());
            if (child.texture.key === 'bigStar') {
                sf = 0.2;
            }
            child.setScrollFactor(sf);
        }, this);
    }

    playerUpdate() {
        if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-0.05);
        } else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(0.05);  
        } else {
            this.player.setAngularVelocity(0); 
        }

        // Thrust the ship forward in the direction it is facing
        if (this.cursors.up.isDown) {
            this.player.thrust(0.05); 
        } else if (this.cursors.down.isDown) {
            this.player.thrustBack(0.05); 
        }
    }

    updateMinimap() {
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - this.minimap.width / 2, 0, gameConfig.canvasSize);
        this.minimap.scrollY = Phaser.Math.Clamp(this.player.y - this.minimap.height / 2, 0, gameConfig.canvasSize);
    }

    updateOrbit(planet, data, label) {
        // Increment orbit angle by the planet's speed
        data.startAngle += data.speed;

        // Calculate new position using sine and cosine for circular motion
        const centerX = gameConfig.canvasSize / 2;
        const centerY = gameConfig.canvasSize / 2;
        const orbitX = centerX + data.orbitRadius * Math.cos(data.startAngle);
        const orbitY = centerY + data.orbitRadius * Math.sin(data.startAngle);

        // Update the planet's position
        planet.setPosition(orbitX, orbitY);

        // Update the planet's label position
        let labelYOffset = 300;
        if (label.text === 'Jupiter') {
            labelYOffset = 1500; 
        } else if (label.text === 'Saturn') {
            labelYOffset = 1100;  
        }
        label.setPosition(orbitX, orbitY + labelYOffset);
    }

    drawOrbits(centerX, centerY) {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);
        for (const planet in planetData) {
            const orbitRadius = planetData[planet].orbitRadius;
            graphics.strokeCircle(centerX, centerY, orbitRadius);
        }
    }
}
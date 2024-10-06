import { Scene } from 'phaser';
import { gameConfig } from '../vars';

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
    }

    create() {

        //  El mundo es de 70000 x 70000
        this.matter.world.setBounds(0, 0, gameConfig.canvasSize, gameConfig.canvasSize);
        this.cameras.main.setBounds(0, 0, gameConfig.canvasSize, gameConfig.canvasSize).setName('main');

        // Cambiar el tamaño del minimapa a 500x300
        // Para cambiar el nivel de zoom out se altera el valor de setZoom, entre más pequeño el valor, más zoom
        this.minimap = this.cameras.add(0, this.cameras.main.height - 300, 300, 300).setZoom(0.19).setName('mini');
        this.minimap.setBackgroundColor(0x002244);

        // Create the static point at the center of the map
        const centerX = gameConfig.canvasSize / 2; // 35000
        const centerY = gameConfig.canvasSize / 2; // 35000
        
        // Orbiting objects (planets)
        this.add.image(centerX, centerY, 'sun'); // Sun at the center
        this.mercury = this.add.image(centerX, centerY, 'mercury').setScale(0.25);
        this.venus = this.add.image(centerX, centerY, 'venus').setScale(0.5);
        this.earth = this.add.image(centerX, centerY, 'earth').setScale(0.1);
        this.mars = this.add.image(centerX, centerY, 'mars').setScale(0.20);
        this.jupiter = this.add.image(centerX, centerY, 'jupiter').setScale(0.5);
        this.saturn = this.add.image(centerX, centerY, 'saturn').setScale(0.9);

        this.orbitAngle = 0; // Start angle

        this.createStarfield();

        // Añadir nave del jugador y configurar física
        this.player = this.matter.add.sprite(gameConfig.canvasSize / 2 - 30, gameConfig.canvasSize / 2, 'ship')
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
        this.updateOrbit(this.mercury, 400);
        this.updateOrbit(this.venus, 600);
        this.updateOrbit(this.earth, 900);
        this.updateOrbit(this.mars, 1200);
        this.updateOrbit(this.jupiter, 1800);
        this.updateOrbit(this.saturn, 2700);
    }

    createStarfield() {
        // Crear el fondo de estrellas
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
            this.player.setAngularVelocity(-0.05);  // Rotate left
        } else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(0.05);  // Rotate right
        } else {
            this.player.setAngularVelocity(0);  // Stop rotating when no key is pressed
        }

        // Thrust the ship forward in the direction it is facing
        if (this.cursors.up.isDown) {
            this.player.thrust(0.05);  // Apply thrust forward
        } else if (this.cursors.down.isDown) {
            this.player.thrustBack(0.05);  // Apply thrust backward (optional)
        }
    }

    updateMinimap() {
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - this.minimap.width / 2, 0, gameConfig.canvasSize);
        this.minimap.scrollY = Phaser.Math.Clamp(this.player.y - this.minimap.height / 2, 0, gameConfig.canvasSize);
    }

    updateOrbit(orbitingObject, orbitRadius) {
        // Increase the orbit angle over time to create the orbit motion
        this.orbitAngle += 0.001; // Adjust for orbit speed

        // Calculate new position using sine and cosine for circular motion
        const centerX = gameConfig.canvasSize / 2;
        const centerY = gameConfig.canvasSize / 2;
        const orbitX = centerX + orbitRadius * Math.cos(this.orbitAngle);
        const orbitY = centerY + orbitRadius * Math.sin(this.orbitAngle);

        // Update the position of the orbiting object
        orbitingObject.setPosition(orbitX, orbitY);
    }
}

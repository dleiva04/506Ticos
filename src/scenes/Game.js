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
        // this.minimap = this.cameras.add(0, 570, 150, 150).setZoom(0.19).setName('mini');
        // this.minimap.setBackgroundColor(0x002244);
        // this.minimap.scrollX = gameConfig.canvasSize;
        // this.minimap.scrollY = gameConfig.canvasSize;


        // Create the static point at the center of the map
        const centerX = gameConfig.canvasSize / 2; // 35000
        const centerY = gameConfig.canvasSize / 2; // 35000
        
        // Orbiting object
        // this.add.circle(centerX, centerY, 325, 0xffff00); // Sol
        this.add.image(centerX,centerY,'sun')
        this.mercury = this.add.image(centerX,centerY,'mercury').setScale(0.25); 
        this.venus = this.add.image(centerX,centerY,'venus').setScale(0.5); 
        this.earth = this.add.image(centerX,centerY,'earth').setScale(0.1); 
        this.mars = this.add.image(centerX,centerY,'mars').setScale(0.20);  
        this.jupiter = this.add.image(centerX,centerY,'jupiter').setScale(0.5);   
        this.saturn = this.add.image(centerX,centerY,'saturn').setScale(0.9);   

        this.orbitAngle = 0; // Start angle
        this.orbitRadius = 150; // Distance from the center (radius of the orbit)

        this.createStarfield();

        // Añadir nave del jugador y configurar física
        this.player = this.matter.add.sprite(gameConfig.canvasSize / 2 - 30, gameConfig.canvasSize / 2, 'ship')
            .setFixedRotation(false)
            .setFrictionAir(0.3)
            .setMass(30)
            .setScale(0.2);
        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Crear el sprite para la nave en el minimapa
        this.playerMinimap = this.add.sprite(0, 0, 'ship').setScale(0.1); // Cambia el tamaño si es necesario

        
    }

    update() {

        this.playerUpdate()
        // this.minimapUpdate()
        this.updateOrbit(this.mercury, 400)
        this.updateOrbit(this.venus, 600)
        this.updateOrbit(this.earth, 900)
        this.updateOrbit(this.mars, 1200)
        this.updateOrbit(this.jupiter, 1800)
        this.updateOrbit(this.saturn, 2700)
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
            // this.minimap.ignore(child); // Ignorar objetos en el minimapa
        }, this);
    }

    playerUpdate() {
        console.log(this.player.x)
        if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-0.05);  // Rotate left
        } else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(0.05);  // Rotate right
        } else {
            this.player.setAngularVelocity(0);  // Stop rotating when no key is pressed
        }

        // Thrust the ship forward in the direction it is facing
        if (this.cursors.up.isDown) {
            this.player.thrust(0.1);  // Apply thrust forward
        } else if (this.cursors.down.isDown) {
            this.player.thrustBack(0.1);  // Apply thrust backward (optional)
        }
        // else
        //     {
        //         this.player.setAngularVelocity(0); // Detener rotación si no se presiona nada
        //     }

        // if (this.cursors.up.isDown)
        //     {
        //         // Calcular la dirección en la que la nave está orientada
        //         const angle = this.player.rotation;

        //         // Aplicar una fuerza en la dirección de la rotación
        //         const force = 0.5; // Puedes ajustar este valor para más o menos velocidad
        //         const forceX = Math.cos(angle) * force;
        //         const forceY = Math.sin(angle) * force;

        //         // Aplicar la fuerza en la dirección actual de la rotación
        //         this.player.applyForce({ x: forceX, y: forceY });
        //     }
    }

    minimapUpdate() {
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x, 300, gameConfig.canvasSize);
        this.minimap.scrollY = Phaser.Math.Clamp(this.player.y, 300, gameConfig.canvasSize);
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

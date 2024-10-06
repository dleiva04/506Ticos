import { Scene } from 'phaser';

export class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");
    }

    preload ()
    {
        this.load.image('star', 'assets/star.png');
        this.load.image('bigStar', 'assets/bigstar.png');
        this.load.image('ship', 'assets/rocket.png');
    }

    //test

    create () {
    //  El mundo es de 70000 x 70000
    this.matter.world.setBounds(0, 0, 70000, 70000);
    this.cameras.main.setBounds(0, 0, 70000, 70000).setName('main');

    // Cambiar el tamaño del minimapa a 500x300
    this.minimap = this.cameras.add(0, 570, 150, 150).setZoom(0.19).setName('mini');
    this.minimap.setBackgroundColor(0x002244);
    this.minimap.scrollX = 70000;
    this.minimap.scrollY = 70000;

    this.createStarfield();

    // Añadir nave del jugador y configurar física
    this.player = this.matter.add.sprite(1600, 200, 'ship')
        .setFixedRotation(false)
        .setFrictionAir(0.05)
        .setMass(30);
    this.cameras.main.startFollow(this.player, false, 0.2, 0.2);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Crear el sprite para la nave en el minimapa
    this.playerMinimap = this.add.sprite(0, 0, 'ship').setScale(0.1); // Cambia el tamaño si es necesario
    }

    update () 
    {
        
        this.playerUpdate()
        this.minimapUpdate()
        
    }

    

    createStarfield ()
    {
        // Crear el fondo de estrellas
        var group = this.add.group({ key: 'star', frameQuantity: 70000 });
        group.createMultiple({ key: 'bigStar', frameQuantity: 7000 });

        var rect = new Phaser.Geom.Rectangle(0, 0, 70000, 70000);
        Phaser.Actions.RandomRectangle(group.getChildren(), rect);

        group.children.iterate(function (child) {
            var sf = Math.max(0.3, Math.random());
            if (child.texture.key === 'bigStar') {
                sf = 0.2;
            }
            child.setScrollFactor(sf);
            this.minimap.ignore(child); // Ignorar objetos en el minimapa
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
    
    minimapUpdate(){
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x, 300, 70000);
        this.minimap.scrollY = Phaser.Math.Clamp(this.player.y, 300, 70000);
    }
    
}


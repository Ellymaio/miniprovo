const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let background;
let ground;
let obstacles;
let score = 0;
let scoreText;

function preload() {
    this.load.image('background', 'assets/background.png'); // Carica il tuo sfondo
    this.load.image('ground', 'assets/ground.png'); // Carica l'immagine del terreno
    this.load.image('obstacle', 'assets/obstacle.png'); // Carica l'immagine degli ostacoli
    this.load.spritesheet('provolone', 'assets/provolone.png', { frameWidth: 32, frameHeight: 32 }); // Carica il provolone
}

function create() {
    background = this.add.tileSprite(400, 300, 800, 600, 'background');

    // Crea il terreno più stretto
    ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground').setScale(1).refreshBody(); // Cambia a setScale(1)

    // Crea il personaggio
    player = this.physics.add.sprite(100, 450, 'provolone');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('provolone', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    player.anims.play('run', true);

    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    background.tilePositionX += 2; // Scorrimento dello sfondo

    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-350); // Salto
    }

    score += 0.01; // Incremento del punteggio
    scoreText.setText('Score: ' + Math.floor(score));
}

function addObstacle() {
    const obstacle = obstacles.create(800, Phaser.Math.Between(400, 550), 'obstacle'); // Posizione casuale in alto
    obstacle.setVelocityX(-200);
    obstacle.setCollideWorldBounds(false);
    obstacle.setImmovable(true);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    scoreText.setText('Game Over! Score: ' + Math.floor(score));
}

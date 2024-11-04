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
    // Carica le immagini che useremo (le metterai nella cartella "assets")
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.spritesheet('provolone', 'assets/provolone.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // Aggiunge lo sfondo
    background = this.add.tileSprite(400, 300, 800, 600, 'background');

    // Aggiunge il terreno
    ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground').setScale(2).refreshBody();

    // Aggiunge il personaggio
    player = this.physics.add.sprite(100, 450, 'provolone');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animazione del personaggio
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('provolone', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    player.anims.play('run', true);

    // Controlli con la tastiera
    cursors = this.input.keyboard.createCursorKeys();

    // Gruppo per gli ostacoli
    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    // Collisioni
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // Mostra il punteggio
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    background.tilePositionX += 2; // Fa scorrere lo sfondo

    // Salta quando premi la barra spaziatrice
    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }

    // Incrementa il punteggio nel tempo
    score += 0.01;
    scoreText.setText('Score: ' + Math.floor(score));
}

function addObstacle() {
    const obstacle = obstacles.create(800, 550, 'obstacle');
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

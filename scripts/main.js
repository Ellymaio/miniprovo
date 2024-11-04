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
let obstacleTimer = 1500; // Intervallo iniziale per gli ostacoli

function preload() {
    this.load.image('background', 'assets/background.png'); // Immagine dello sfondo
    this.load.image('ground', 'assets/ground.png'); // Immagine del terreno
    this.load.image('obstacle', 'assets/obstacle.png'); // Immagine degli ostacoli
    this.load.spritesheet('provolone', 'assets/provolone.png', { frameWidth: 32, frameHeight: 32 }); // Sprite del protagonista
}

function create() {
    // Aggiunge lo sfondo e lo fa scorrere
    background = this.add.tileSprite(400, 300, 800, 600, 'background');

    // Aggiunge la strada e la fa scorrere
    ground = this.add.tileSprite(400, 580, 800, 40, 'ground');
    this.physics.add.existing(ground, true); // Fa in modo che la strada sia statica

    // Crea il personaggio (provolone)
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

    // Aggiunge i controlli
    cursors = this.input.keyboard.createCursorKeys();

    // Crea il gruppo per gli ostacoli
    obstacles = this.physics.add.group();

    // Aggiunge un timer per gli ostacoli
    this.time.addEvent({
        delay: obstacleTimer,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    // Collide player con il terreno
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // Mostra il punteggio
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    // Fa scorrere lo sfondo e la strada per simulare il movimento
    background.tilePositionX += 2;
    ground.tilePositionX += 4;

    // Gestisce il salto del protagonista
    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }

    // Incrementa il punteggio
    score += 0.01;
    scoreText.setText('Score: ' + Math.floor(score));

    // Aumenta la frequenza degli ostacoli ogni 25 punti
    if (Math.floor(score) % 25 === 0 && obstacleTimer > 500) {
        obstacleTimer -= 100; // Riduce il tempo tra un ostacolo e l'altro
    }
}

function addObstacle() {
    // Aggiunge un ostacolo alla strada
    const obstacle = obstacles.create(800, 550, 'obstacle'); // Posiziona gli ostacoli in basso, allineati alla strada
    obstacle.setVelocityX(-200); // Fa muovere l'ostacolo verso sinistra
    obstacle.setCollideWorldBounds(false);
    obstacle.setImmovable(true);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    scoreText.setText('Game Over! Score: ' + Math.floor(score));
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
import Utilities from "../Utilities";
import GamePause from "./GamePause";
import MainGame from "./MainGame";

let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Input.Keyboard.Types.CursorKeys;
let platforms: Phaser.Physics.Arcade.StaticGroup;
let stars: Phaser.Physics.Arcade.Group;
let base: SecretChapter;
let scoreText: Phaser.GameObjects.Text
let escKey;
let spaceKey;
let ctrlKey;
let keys;
let muteButton;
let triggerTimer: Phaser.Time.TimerEvent;
let triggerTimerGameEnd: Phaser.Time.TimerEvent;

type TItem = Phaser.Tilemaps.Tile
const starPositions: number[] = []

export default class SecretChapter extends Phaser.Scene {
	/**
	 *
	 */
	constructor() {
		super({key: SecretChapter.Name});
	}

	/**
	 * Unique name of the scene.
	 */
	public static Name = "SecretChapter";
	public static IsActive = true;

	public preload(): void {

		// player = this.physics.add.sprite(100, 100, 'player');
		// player.setCollideWorldBounds(true); // Sınırları kaldır
	}

	public create(): void {
		base = this

		Utilities.LogSceneMethodEntry("SecretChapter", "create");

		triggerTimerGameEnd = this.time.addEvent({
			callback: this.timerEventGameEnd,
			callbackScope: this,
			delay: 10000,
			loop: true
		});

		const image = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'secretbg')
		const scaleX = this.cameras.main.width / image.width
		const scaleY = this.cameras.main.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.physics.add.staticGroup();

		platforms.create(200, 585, 'platformdxcode');
		platforms.create(600, 585, 'platformdxcode');
		platforms.create(600, 485, 'platformdxcode');
		platforms.create(700, 400, 'platformdxcode');
		platforms.create(800, 325, 'platformdxcode');

		player = this.physics.add.sprite(100, 300, 'male');

		player.setCollideWorldBounds(true);
		
		base.createLogos()

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('male', { start: 9, end: 10 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'male', frame: 0 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('male', { start: 9, end: 10 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'up',
			frames: [ { key: 'male', frame: 1 } ] ,
			frameRate: 20,
		})
		this.anims.create({
			key: 'sleep',
			frames: [ { key: 'male', frame: 5 } ] ,
			frameRate: 20,
		})

		cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(player, platforms);
		
		scoreText = this.add.text(16, 16, `Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`, {
			fontSize: "32px",
			fontFamily: 'FontName'
		});
		scoreText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 3);

		escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
		keys = this.input.keyboard.addKeys('W,A,S,D,M');
		
		muteButton = this.add.sprite(750, 35, this.sound.mute ? 'muteButton' : 'soundButton').setInteractive();

		muteButton.on('pointerdown', this.updateMuteIcon);
		this.input.keyboard.on('keydown-M', this.updateMuteIcon);
	}

	updateMuteIcon() {
		// Ses durumuna göre iconu değiştirin
		if (base.sound.mute) {
			base.sound.mute = false
			muteButton.setTexture('soundButton');
		} else {
			base.sound.mute = true
			muteButton.setTexture('muteButton');
		}
	}

	public timerEventGameEnd(): void {
		//  Create our own EventEmitter instance
		MainGame.EventEmitter.emit('updateScore');
		SecretChapter.IsActive = false
		this.scene.resume(MainGame.Name);
		this.scene.stop(SecretChapter.Name);
	}

	public timerEvent(): void {
		const position = Utilities.getRandomInt(this.cameras.main.width);
		starPositions.push(position);
		const star = stars.create(position, 50, 'dxcodelogo')
		star.setScale(.2)
		star.body.drag.set(150)
		star.setCollideWorldBounds(true);
	}

	createLogos() {
		starPositions.length = 0;

		stars = this.physics.add.group();
		
		triggerTimer = this.time.addEvent({
			callback: this.timerEvent,
			callbackScope: this,
			delay: 1000,
			loop: true
		});

		this.physics.add.overlap(platforms, stars, this.dropItem, null);

		// @ts-ignore:next-line
		stars.children.iterate((child) => {
			//  Give each star a slightly different bounce
			// @ts-ignore:next-line
			child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
		});
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, this.collectItem, null);
	}

	dropItem(player: Phaser.Physics.Arcade.Sprite, item: TItem) {
		item.destroy();
	}

	collectItem(player: Phaser.Physics.Arcade.Sprite, item: TItem) {
		item.destroy();
		base.sound.play('heal')
		MainGame.Score += 30;
		scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
	}

	public update() {
		player.setScale(0.5, 0.5);

		if (Phaser.Input.Keyboard.JustDown(escKey))
		{
			this.scene.pause(SecretChapter.Name);
			this.scene.launch(GamePause.Name);
		} 
		
		if (player.body.velocity.x < 0)
			player.flipX = true; // Sola hareket ederken görüntüyü aynala
		else if (player.body.velocity.x > 0)
			player.flipX = false; // Sağa hareket ederken görüntüyü eski haline getir

		if (cursors.left.isDown || keys.A.isDown)
		{
			player.setVelocityX(-160);
			player.anims.play('left', true);
		}
		else if (cursors.right.isDown || keys.D.isDown)
		{
			player.setVelocityX(160);
			player.anims.play('right', true);
		}
		else
		{
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		if (cursors.up.isDown && player.body.touching.down || Phaser.Input.Keyboard.JustDown(spaceKey) && player.body.touching.down || keys.W.isDown && player.body.touching.down)
			player.setVelocityY(-330);

		if (!player.body.touching.down)
			player.anims.play('up', true);
	}
}

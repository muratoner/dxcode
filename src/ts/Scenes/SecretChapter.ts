/* eslint-disable @typescript-eslint/ban-ts-comment */
import Utilities from "../Utilities";
import { ImageKey, SceneKeys } from "../Utilities/Keys";
import GamePause from "./GamePause";
import MainGame from "./MainGame";

let player: Phaser.Physics.Arcade.Sprite;
let secretCircle: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let platforms: Phaser.Physics.Arcade.StaticGroup;
let stars: Phaser.Physics.Arcade.Group;
let base: SecretChapter;
let scoreText: Phaser.GameObjects.Text
let escKey;
let spaceKey;
let keys;
let muteButton;
let triggerTimer: Phaser.Time.TimerEvent;
let triggerTimerCountdown: Phaser.Time.TimerEvent;
let triggerTimerGameEnd: Phaser.Time.TimerEvent;

type TItem = Phaser.Tilemaps.Tile
const starPositions: number[] = []

export default class SecretChapter extends Phaser.Scene {
	/**
	 *
	 */
	constructor() {
		super({key: SceneKeys.SecretChapter});
	}

	/**
	 * Unique name of the scene.
	 */
	public static IsActive = false;

	public create(): void {
		base = this
		this.input.createDefaultCursor();

		let countdown = 20
		
		SecretChapter.IsActive = true

		const camera = this.cameras.main

		Utilities.LogSceneMethodEntry(SceneKeys.SecretChapter, this.create.name);
		const character = Utilities.getCharacterName()

		triggerTimerGameEnd = this.time.addEvent({
			callback: this.timerEventGameEnd,
			callbackScope: this,
			delay: countdown * 1000,
			loop: true
		});

		const image = this.add.sprite(camera.width / 2, camera.height / 2, ImageKey.secretbg)
		const scaleX = camera.width / image.width
		const scaleY = camera.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		secretCircle = this.physics.add.sprite(700, 200, ImageKey.secretCircle);
		secretCircle.setScale(0.5)
		secretCircle.setVelocity(-100, 0);
		secretCircle.setCollideWorldBounds(true)

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.physics.add.staticGroup();

		platforms.create(camera.width, camera.height - 100, ImageKey.platformDxcode).setScale(1.6).setOrigin(1).refreshBody();
		platforms.create(camera.width + 200, camera.height - 200, ImageKey.platformDxcode).setScale(1.6).setOrigin(1).refreshBody();
		platforms.create(camera.width + 400, camera.height - 300, ImageKey.platformDxcode).setScale(1.6).setOrigin(1).refreshBody();

		platforms.create(0, camera.height - 50, ImageKey.platformDxcode).setOrigin(0).setScale(1.6).refreshBody();
		platforms.create(camera.width, camera.height, ImageKey.platformDxcode).setOrigin(1).setScale(1.6).refreshBody();

		this.physics.add.collider(secretCircle, platforms);
		player = this.physics.add.sprite(100, 300, character);

		player.setCollideWorldBounds(true);
		
		base.createLogos()

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(character, { start: 9, end: 10 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: character, frame: 0 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(character, { start: 9, end: 10 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'up',
			frames: [ { key: character, frame: 1 } ] ,
			frameRate: 20,
		})
		this.anims.create({
			key: 'sleep',
			frames: [ { key: character, frame: 5 } ] ,
			frameRate: 20,
		})

		cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(player, platforms);
		this.physics.add.collider(player, secretCircle, this.timerEventGameEnd, null);
		
		scoreText = this.add.text(16, 16, `Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`, {
			fontSize: "32px",
			fontFamily: 'FontName'
		});
		scoreText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		keys = this.input.keyboard.addKeys('W,A,S,D,M');
		
		muteButton = this.add.sprite(camera.width - 20, 50, this.sound.mute ? ImageKey.mute : ImageKey.sound).setOrigin(1).setInteractive();

		muteButton.on('pointerdown', this.updateMuteIcon);
		this.input.keyboard.on('keydown-M', this.updateMuteIcon);

		const countdownText = this.add.textx(camera.width / 2, 40, countdown.toString(), 'h1').setOrigin(0.5, 0).setDepth(1);

		triggerTimerCountdown = this.time.addEvent({
			callback: () => {
				countdown--;
				countdownText.setText(countdown.toString())
			},
			callbackScope: this,
			delay: 1000,
			loop: true
		});
	}

	public update() {
		player.setScale(0.5, 0.5);

		if (Phaser.Input.Keyboard.JustDown(escKey))
		{
			this.scene.pause(SceneKeys.SecretChapter);
			this.scene.launch(SceneKeys.GamePause);
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

	updateMuteIcon() {
		// Ses durumuna göre iconu değiştirin
		if (base.sound.mute) {
			base.sound.setMute(false)
			muteButton.setTexture( ImageKey.sound);
		} else {
			base.sound.setMute(true)
			muteButton.setTexture(ImageKey.mute);
		}
	}

	public timerEventGameEnd(): void {
		//  Create our own EventEmitter instance
		MainGame.EventEmitter.emit('updateScore');
		SecretChapter.IsActive = false
		MainGame.pauseGame()
		base.scene.stop(SceneKeys.SecretChapter);
	}

	public timerEvent(): void {
		const position = Utilities.getRandomInt(this.cameras.main.width);
		starPositions.push(position);
		const star = stars.create(position, 50, ImageKey.dxcodeLogo)
		star.setScale(.2)
		star.body.drag.set(225)
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
}

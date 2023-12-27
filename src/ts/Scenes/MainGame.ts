import { onValue, ref } from "firebase/database";
import "firebase/firestore";
import Utilities from "../Utilities";
import GameOver from "./GameOver";
import GamePause from "./GamePause";
import Firebase from "../Utilities/Firebase";
import { ImageKey, SceneKeys, SoundKeys } from "../Utilities/Keys";

let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let platforms: Phaser.Physics.Arcade.StaticGroup;
let barrels: Phaser.Physics.Arcade.Group;
let bombs: Phaser.Physics.Arcade.Group;
let base: MainGame;
let gameOver = false;
let scoreText: Phaser.GameObjects.Text
let spaceKey;
let keys;
let muteButton: Phaser.GameObjects.Sprite;
let level

type TItem = Phaser.Tilemaps.Tile
const barrelPosition: number[] = []

export default class MainGame extends Phaser.Scene {
	/**
	 *
	 */
	constructor() {
		super({key: SceneKeys.MainGame});
	}

	/**
	 * Unique name of the scene.
	 */
	public static Score = 0;
	public static HighScore = 0;
	public static EventEmitter: Phaser.Events.EventEmitter;
	hearts: Phaser.GameObjects.Sprite[]
	camera: Phaser.Cameras.Scene2D.Camera

	public create(): void {
		Utilities.LogSceneMethodEntry(MainGame.name, "create");

		base = this

		this.input.createDefaultCursor()

		gameOver = false
		level = 1
		this.hearts = []
		MainGame.Score = 0
		MainGame.HighScore = 0

		const character = Utilities.getCharacterName()
		this.camera = this.cameras.main

		const image = this.add.sprite(this.camera.width / 2, this.camera.height / 2, ImageKey.talltrees)
		const scaleX = this.camera.width / image.width
		const scaleY = this.camera.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		player = this.physics.add.sprite(100, this.camera.height - 200, character);
		player.setCollideWorldBounds(true);

		bombs = this.physics.add.group();

		this.createPlatforms()
		this.createStars()

		for (let i = 0; i < 1; i++) {
			const bomb = bombs.create(24, 24, ImageKey.bomb);
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 300), 20);
			bomb.allowGravity = false;
		}

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

		cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(player, platforms);		
		this.physics.add.collider(bombs, platforms);
		this.physics.add.collider(player, bombs, this.hitBomb, null);

		scoreText = this.add.text(16, 16, `Puan: 0 - ${MainGame.HighScore} 🏆`, {
			fontSize: "32px",
			fontFamily: 'FontName'
		});
		scoreText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		// Listen real time highscore on firebase
		const refHighScore = ref(Firebase.database, 'highscore')
		onValue(refHighScore, (snapshot) => {
			const res = snapshot.val();
			MainGame.HighScore = +(res?.score || 0)
			scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
		});

		const keyboard = this.input.keyboard

		spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		keys = keyboard.addKeys('W,A,S,D,M');

		keyboard.on('keydown-ENTER', () => {
			this.scene.pause(SceneKeys.MainGame);
			this.scene.launch(GamePause.Name);
		})

		keyboard.on('keydown-F', () => {
			if (this.scale.isFullscreen) {
				this.scale.stopFullscreen();
				// On stop fulll screen
			} else {
				this.scale.startFullscreen();
				// On start fulll screen
			}
		})
		
		muteButton = this.add.sprite(this.camera.width - 50, 35, this.sound.mute ? ImageKey.mute : ImageKey.sound).setInteractive();
		muteButton.on('pointerdown', this.updateMuteIcon);
		keyboard.on('keydown-M', this.updateMuteIcon);

		//  Create our own EventEmitter instance
		MainGame.EventEmitter = new Phaser.Events.EventEmitter();

		//  Set-up an event handler
		MainGame.EventEmitter.on('updateScore', this.handler, this);

		for (let i = 0; i < 3; i++) {
			this.hearts.push(this.add.sprite(this.camera.width - 20 - (i * 40), this.camera.height - 20, ImageKey.heart))
		}

		this.scene.launch(SceneKeys.SecretChapter)
	}

	public update() {

		player.setScale(0.5, 0.5);

		if (player.body.velocity.x < 0) {
			player.flipX = true; // Sola hareket ederken görüntüyü aynala
		} else if (player.body.velocity.x > 0) {
			player.flipX = false; // Sağa hareket ederken görüntüyü eski haline getir
		}
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
		{
			player.setVelocityY(-330);
		}

		if (!player.body.touching.down) {
			player.anims.play('up', true);
		}

		// Level
		if (barrels.countActive(true) === 0) {
			//  A new batch of stars to collect
			base.createStars()
			const x = player.x < 400
				? Phaser.Math.Between(400, 800)
				: Phaser.Math.Between(0, 400);

			level += 1;

			if (level % 5 == 0) {
				this.scene.pause(SceneKeys.MainGame);
				this.scene.launch(SceneKeys.SecretChapter)
			}

			const bomb = bombs.create(x, 16, ImageKey.bomb);
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;
		}
	}

	createPlatforms () {
		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.physics.add.staticGroup();

		function createPlatform(x: number, y: number, scale = 1.7) {
			platforms.create(x, y, ImageKey.platform).setScale(scale).refreshBody();
		}

		//  Here we create the ground.
		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		createPlatform(340, this.camera.height - 20);
		createPlatform(950, this.camera.height - 20);

		//  Now let's create some ledges
		createPlatform(this.camera.width - 300, 525);
		createPlatform(100, 350);
		createPlatform(-100, 175);
		createPlatform(this.camera.width / 2, this.camera.height / 2 - 150, .8);
		createPlatform(this.camera.width, 350);
		createPlatform(this.camera.width + 100, 175);
	}

	handler() {
		scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
	}

	updateMuteIcon() {
		// Ses durumuna göre iconu değiştirin
		if (base.sound.mute) {
			base.sound.setMute(false)
			muteButton.setTexture(ImageKey.sound);
		} else {
			base.sound.setMute(true)
			muteButton.setTexture(ImageKey.mute);
		}
	}

	createStars() {
		barrelPosition.length = 0;

		const physics = this.physics

		barrels = physics.add.group();
		const length = 5 + bombs.getLength();
		const spaceSize = this.camera.width / length * 0.5
		for (let i = 0; i < length; i++) {
			let newPosition;
			let isOverlapping;
		
			do {
				isOverlapping = false;
				newPosition = Utilities.getRandomInt(this.camera.width);
		
				// Yeni konumu mevcut yıldızların konumlarıyla karşılaştır
				for (let j = 0; j < barrelPosition.length; j++) {
					if (Math.abs(newPosition - barrelPosition[j]) < spaceSize) {
						isOverlapping = true;
						break; // Yeterince uzaklıkta değil, yeni bir konum seç
					}
				}
			} while (isOverlapping);
		
			// Yeterince uzaklıkta bir konum bulundu, yeni konumu ekle
			barrelPosition.push(newPosition);

			const barrel = barrels.create(newPosition, 50, ImageKey.barrel)
			barrel.body.drag.set(10)
			barrel.setCollideWorldBounds(true);
		}

		barrels.children.iterate((child) => {
			// @ts-ignore
			//  Give each star a slightly different bounce
			child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
			return true
		});
		physics.add.collider(barrels, platforms);
		physics.add.overlap(player, barrels, this.collectItem, null);
		physics.add.collider(bombs, barrels, this.hitBarrel, null);
	}

	collectItem(player: Phaser.Physics.Arcade.Sprite, item: TItem) {
		item.destroy();
		base.sound.play(SoundKeys.heal)

		//  Add and update the score
		MainGame.Score += 10;
		scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
	}

	hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: TItem) {
		const heart = base.hearts.pop()
		base.tweens.add({
			targets: heart,
			x: base.camera.width / 2,
			ease: 'Quad.out',
			duration: 5000,
		});
		bomb.destroy()

		if(base.hearts.length == 0) {
			base.physics.pause();
			player.setTint(0xff0000);
			player.anims.play("turn");
			gameOver = true;
			
			base.sound.play(SoundKeys.bomb);

			if (MainGame.HighScore <= 0 || MainGame.HighScore < MainGame.Score) {
				MainGame.HighScore = MainGame.Score
				Firebase.setScore(MainGame.Score)
			}
	
			Firebase.setHighScore(MainGame.Score)

			base.scene.pause(SceneKeys.MainGame);
			base.scene.launch(GameOver.Name)
		} else {
			base.sound.play(SoundKeys.loseheart);
			heart.destroy(true)
		}
	}

	hitBarrel(bomb: Phaser.Physics.Arcade.Sprite, barrel: TItem) {
		// @ts-ignore:next-line
		let count = barrel.customData?.hitBombCount || 0
		count++;
		if (count >= 2) {
			barrel.destroy();
		} else {
			// @ts-ignore:next-line
			barrel.customData = {
				hitBombCount: count
			}
			// @ts-ignore:next-line
			barrel.setTexture(ImageKey.barrelDanger);
		}
	}

	static pauseGame(){
		base.scene.pause(SceneKeys.MainGame);
		base.scene.launch(GamePause.Name);
	}
}

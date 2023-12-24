/* eslint-disable @typescript-eslint/ban-ts-comment */
import Utilities from "../Utilities";
import GameOver from "./GameOver";
import GamePause from "./GamePause";
import {initializeApp} from 'firebase/app';
import { Database, getDatabase, onValue, ref, set } from "firebase/database";
import SecretChapter from "./SecretChapter";
import "firebase/firestore";
import { Firestore, doc, getFirestore, setDoc } from "firebase/firestore";

let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Input.Keyboard.Types.CursorKeys;
let platforms: Phaser.Physics.Arcade.StaticGroup;
let stars: Phaser.Physics.Arcade.Group;
let bombs: Phaser.Physics.Arcade.Group;
let base: MainGame;
let gameOver = false;
let scoreText: Phaser.GameObjects.Text
let escKey;
let spaceKey;
let ctrlKey;
let keys;
let muteButton: Phaser.GameObjects.Sprite;
let level

type TItem = Phaser.Tilemaps.Tile
const starPositions: number[] = []

// Add your firebase configs here
const firebaseConfig = {
	apiKey: "AIzaSyAvT41yWX0XcrLQGSzDpBqNMdUUDb_vXA8",
	authDomain: "ctrlzzz-9bbf5.firebaseapp.com",
	databaseURL: "https://ctrlzzz-9bbf5-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "ctrlzzz-9bbf5",
	storageBucket: "ctrlzzz-9bbf5.appspot.com",
	messagingSenderId: "419914893697",
	appId: "1:419914893697:web:71d3e7add245bfc7a7c080",
	measurementId: "G-Y3E566MD8Q"
};

export default class MainGame extends Phaser.Scene {
	/**
	 *
	 */
	constructor() {
		super({key: MainGame.Name});
		
		const app = initializeApp(firebaseConfig);
		// Initialize Cloud Storage and get a reference to the service
		MainGame.databaseFireStore = getFirestore(app);
		MainGame.database = getDatabase();
	}

	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";
	public static Score = 0;
	public static HighScore = 0;
	public static EventEmitter: Phaser.Events.EventEmitter;
	public static database: Database;
	public static databaseFireStore: Firestore;

	public create(): void {
		base = this

		gameOver = false
		level = 1
		MainGame.Score = 0
		MainGame.HighScore = 0

		Utilities.LogSceneMethodEntry("MainGame", "create");
		let character = Utilities.getCharacterName()

		const image = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'talltrees')
		const scaleX = this.cameras.main.width / image.width
		const scaleY = this.cameras.main.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.physics.add.staticGroup();

		//  Here we create the ground.
		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		platforms.create(200, 585, 'ground').setScale(1).refreshBody();
		platforms.create(600, 585, 'ground').setScale(1).refreshBody();
	
		//  Now let's create some ledges
		platforms.create(600, 410, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 230, 'ground');

		player = this.physics.add.sprite(100, 300, character);

		player.setCollideWorldBounds(true);

		bombs = this.physics.add.group();
		
		base.createStars()

		for (let i = 0; i < 1; i++) {
			const bomb = bombs.create(24, 24, "bomb");
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
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
		const refHighScore = ref(MainGame.database, 'highscore')
		onValue(refHighScore, (snapshot) => {
			const res = snapshot.val();
			MainGame.HighScore = +(res?.score || 0)
			scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
		});

		escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
		keys = this.input.keyboard.addKeys('W,A,S,D,M');
		
		muteButton = this.add.sprite(750, 35, this.sound.mute ? 'muteButton' : 'soundButton').setInteractive();
		muteButton.on('pointerdown', this.updateMuteIcon);
		this.input.keyboard.on('keydown-M', this.updateMuteIcon);

		//  Create our own EventEmitter instance
		MainGame.EventEmitter = new Phaser.Events.EventEmitter();

		//  Set-up an event handler
		MainGame.EventEmitter.on('updateScore', this.handler, this);
	}

	handler() {
		scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
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

	createStars() {
		starPositions.length = 0;

		stars = this.physics.add.group();
		const length = 5 + bombs.getLength();
		const spaceSize = this.cameras.main.width / length * 0.5
		for (let i = 0; i < length; i++) {
			let newPosition;
			let isOverlapping;
		
			do {
				isOverlapping = false;
				newPosition = Utilities.getRandomInt(this.cameras.main.width);
		
				// Yeni konumu mevcut yıldızların konumlarıyla karşılaştır
				for (let j = 0; j < starPositions.length; j++) {
					if (Math.abs(newPosition - starPositions[j]) < spaceSize) {
						isOverlapping = true;
						break; // Yeterince uzaklıkta değil, yeni bir konum seç
					}
				}
			} while (isOverlapping);
		
			// Yeterince uzaklıkta bir konum bulundu, yeni konumu ekle
			starPositions.push(newPosition);

			const star = stars.create(newPosition, 50, 'star')
			star.body.drag.set(150)
			star.setCollideWorldBounds(true);
		}

		// @ts-ignore:next-line
		stars.children.iterate((child) => {
			//  Give each star a slightly different bounce
			// @ts-ignore:next-line
			child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
		});
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, this.collectItem, null);
		this.physics.add.collider(bombs, stars, this.hitStar, null);
	}

	collectItem(player: Phaser.Physics.Arcade.Sprite, item: TItem) {
		item.destroy();
		base.sound.play('heal')

		//  Add and update the score
		MainGame.Score += 10;
		scoreText.setText(`Puan: ${MainGame.Score} - ${MainGame.HighScore} 🏆`);
	}

	async hitBomb(player: Phaser.Physics.Arcade.Sprite) {
		base.physics.pause();
		player.setTint(0xff0000);
		player.anims.play("turn");
		gameOver = true;

		if (MainGame.HighScore <= 0 || MainGame.HighScore < MainGame.Score) {
			MainGame.HighScore = MainGame.Score
			set(ref(MainGame.database, 'highscore'), {score: MainGame.Score});
			await setDoc(doc(MainGame.databaseFireStore, "highscores", localStorage.getItem('playerName')), {score: MainGame.Score});
		}
	}

	hitStar(bomb: Phaser.Physics.Arcade.Sprite, star: TItem) {
		// @ts-ignore:next-line
		let count = star.customData?.hitBombCount || 0
		count++;
		if (count >= 2) {
			star.destroy();
		} else {
			// @ts-ignore:next-line
			star.customData = {
				hitBombCount: count
			}
		}
	}

	public update() {

		player.setScale(0.5, 0.5);

		if (gameOver) {
			this.sound.play('bomb');
			this.time.delayedCall(200, function() {
				this.scene.pause(MainGame.Name);
				this.scene.launch(GameOver.Name)
			}, [], this);
		}

		if (Phaser.Input.Keyboard.JustDown(escKey))
		{
			this.scene.pause(MainGame.Name);
			this.scene.launch(GamePause.Name);
		} 

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
		if (stars.countActive(true) === 0) {
			//  A new batch of stars to collect
			base.createStars()
			const x = player.x < 400
				? Phaser.Math.Between(400, 800)
				: Phaser.Math.Between(0, 400);

			level += 1;

			if (level % 5 == 0) {
				this.scene.pause(MainGame.Name);
				this.scene.launch(SecretChapter.Name)
			}

			const bomb = bombs.create(x, 16, "bomb");
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;
		}
	}
}

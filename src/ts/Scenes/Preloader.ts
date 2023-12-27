import Utilities from "../Utilities";
import { ImageKey } from "../Utilities/Keys";
import SplashScreen from "./SplashScreen";

export default class Preloader extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "Preloader";


	public preload(): void {
		this.addProgressBar();
		this.input.createDefaultCursor();

		this.load.path = "assets/";
		this.load.image("phaser_pixel_medium_flat");
		this.load.image("logo-256");
		this.load.image('arkaplan', 'backgrounds/game_background_3/game_background_3.png');
		this.load.image('secretbg', 'backgrounds/dxcode-background.jpg');
		this.load.image('platformdxcode', 'platform-dxcode.png');
		this.load.image('dxcodelogo', 'dxcode-logo.png');
		this.load.image('dxcodelogodark', 'dxcode-dark.png');
		this.load.image('dxcodelogowhite', 'dxcode-white.png');
		this.load.image('talltrees', 'backgrounds/colored_talltrees.png');
		this.load.image('secretcircle', 'secret-circle.png');
		this.load.image('heart', 'heart.png');
		this.load.image('soundButton', 'sound.png');
		this.load.image('muteButton', 'mute.png');
		this.load.image('ground', 'platform.png');
		this.load.image(ImageKey.barrel, 'barrel.png');
		this.load.image(ImageKey.barrelDanger, 'barrel-danger.png');
		this.load.image(ImageKey.bomb, 'bomb.png');
		this.load.spritesheet('dude', 'characters/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet('male', 'characters/male.png', { frameWidth: 80, frameHeight: 110 });
		this.load.spritesheet('female', 'characters/female.png', { frameWidth: 80, frameHeight: 110 });

		this.load.audio('bomb', 'sounds/bomb.wav');
		this.load.audio('heal', 'sounds/heal.wav');
		this.load.audio('loseheart', 'sounds/lose-heart.wav');
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Preloader", "create");

		this.scene.start(SplashScreen.Name);
	}

	/**
	 * Adds a progress bar to the display, showing the percentage of assets loaded and their name.
	 */
	private addProgressBar(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		/** Customizable. This text color will be used around the progress bar. */
		const outerTextColor = '#ffffff';

		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: "Yükleniyor...",
			style: {
				font: "20px monospace",
				color: outerTextColor
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				font: "18px monospace",
				color: "#ffffff"
			}
		});
		percentText.setOrigin(0.5, 0.5);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: "",
			style: {
				font: "18px monospace",
				color: outerTextColor
			}
		});

		assetText.setOrigin(0.5, 0.5);

		this.load.on("progress", (value: number) => {
			percentText.setText(parseInt(value * 100 + "", 10) + "%");
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect((width / 4) + 10, (height / 2) - 30 + 10, (width / 2 - 10 - 10) * value, 30);
		});

		this.load.on("fileprogress", (file: Phaser.Loader.File) => {
			assetText.setText("Dosya: " + file.key);
		});

		this.load.on("complete", () => {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});
	}
}

import Utilities from "../Utilities";
import { ImageKey, SceneKeys, SoundKeys } from "../Utilities/Keys";

export default class Preloader extends Phaser.Scene {
	public preload(): void {
		this.addProgressBar();
		this.input.createDefaultCursor();


		this.load.path = "assets/";
		this.load.image(ImageKey.phaserPixelMediumFlat);
		this.load.image(ImageKey.logo256);
		this.load.image(ImageKey.secretCircle);
		this.load.image(ImageKey.heart);
		this.load.image(ImageKey.sound);
		this.load.image(ImageKey.mute);
		this.load.image(ImageKey.platform);
		this.load.image(ImageKey.barrel);
		this.load.image(ImageKey.barrelDanger);
		this.load.image(ImageKey.bomb);
		this.load.image(ImageKey.dxcodeLogo);
		this.load.image(ImageKey.dxcodeLogoWhite);

		this.load.image(ImageKey.arkaplan, 'backgrounds/game_background_3/game_background_3.png');
		this.load.image(ImageKey.secretbg, 'backgrounds/dxcode-background.jpg');
		this.load.image(ImageKey.platformDxcode);
		this.load.image(ImageKey.talltrees, 'backgrounds/colored_talltrees.png');
		
		this.load.spritesheet('dude', 'characters/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet('male', 'characters/male.png', { frameWidth: 80, frameHeight: 110 });
		this.load.spritesheet('female', 'characters/female.png', { frameWidth: 80, frameHeight: 110 });

		this.load.audio(SoundKeys.bomb, 'sounds/bomb.wav');
		this.load.audio(SoundKeys.heal, 'sounds/heal.wav');
		this.load.audio(SoundKeys.loseheart, 'sounds/lose-heart.wav');
	}

	public create(): void {
		Utilities.LogSceneMethodEntry(SceneKeys.Preloader, this.create.name);

		this.scene.start(SceneKeys.SplashScreen);
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
				font: "20px FontName",
				color: outerTextColor
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				font: "18px FontName",
				color: "#ffffff"
			}
		});
		percentText.setOrigin(0.5, 0.5);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: "",
			style: {
				font: "18px FontName",
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

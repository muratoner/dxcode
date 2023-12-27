import Utilities from "../Utilities";
import MainGame from "./MainGame";
import MainMenu from "./MainMenu";
import GameOver from "./GameOver";

export default class SplashScreen extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "SplashScreen";

	public preload(): void {
		this.load.path = "assets/";
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("SplashScreen", "create");

		this.scene.start(GameOver.Name)

		this.input.createDefaultCursor();

		const camera = this.cameras.main
		const centerX = camera.centerX
		const centerY = camera.centerY

		const image = this.add.image(centerX - 150, centerY * 0.5, 'logo-256')
		image.setScale(.7, .7)

		const imageDark = this.add.image(centerX + 150, centerY * 0.5, 'dxcodelogowhite')
		imageDark.setScale(.5, .5)

		const poweredByText = this.add.text(centerX, centerY - 25, "Powered By");
		poweredByText.setOrigin(0.5, 0.5);
		poweredByText.setFontFamily("FontName").setFontSize(20).setFill("#1b5397");
		this.add.image(centerX, centerY, "phaser_pixel_medium_flat");

		this.input.on("pointerdown", this.loadMainMenu, this);

		this.time.addEvent({
			// Run after three seconds.
			delay: 3000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});

		this.input.keyboard.on('ENTER', () => {
			this.scene.start(MainMenu.Name);
		})
	}

	/**
	 * Load the next scene, the main menu.
	 */
	private loadMainMenu(): void {
		this.scene.start(MainMenu.Name);
	}
}

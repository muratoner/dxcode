import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

let enterKey;

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

		const image = this.add.image(230, this.cameras.main.centerY * 0.5, 'logo-256')
		image.setScale(.7, .7)

		const imageDark = this.add.image(550, this.cameras.main.centerY * 0.5, 'dxcodelogowhite')
		imageDark.setScale(.5, .5)

		const poweredByText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 25, "Powered By");
		poweredByText.setOrigin(0.5, 0.5);
		poweredByText.setFontFamily("FontName").setFontSize(20).setFill("#1b5397");
		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");

		this.input.setDefaultCursor("pointer");
		this.input.on("pointerdown", this.loadMainMenu, this);

		this.time.addEvent({
			// Run after three seconds.
			delay: 3000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});

		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}

	public update(): void {
		if (Phaser.Input.Keyboard.JustDown(enterKey))
		{
			this.scene.start(MainMenu.Name);
		}
	}

	/**
	 * Load the next scene, the main menu.
	 */
	private loadMainMenu(): void {
		this.scene.start(MainMenu.Name);
	}
}

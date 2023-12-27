import Utilities from "../Utilities";
import { ImageKey, SceneKeys } from "../Utilities/Keys";

export default class SplashScreen extends Phaser.Scene {
	public create(): void {
		Utilities.LogSceneMethodEntry(SceneKeys.SplashScreen, "create");
		this.scene.start(SceneKeys.MainGame)

		this.input.createDefaultCursor();

		const camera = this.cameras.main
		const centerX = camera.centerX
		const centerY = camera.centerY

		const image = this.add.image(centerX - 150, centerY * 0.5, ImageKey.logo256)
		image.setScale(.7, .7)

		const imageDark = this.add.image(centerX + 150, centerY * 0.5, ImageKey.dxcodeLogoWhite)
		imageDark.setScale(.5, .5)

		const poweredByText = this.add.text(centerX, centerY - 25, "Powered By");
		poweredByText.setOrigin(0.5, 0.5);
		poweredByText.setFontFamily("FontName").setFontSize(20).setFill("#1b5397");
		this.add.image(centerX, centerY, ImageKey.phaserPixelMediumFlat);

		this.input.on("pointerdown", this.loadMainMenu, this);

		this.time.addEvent({
			// Run after three seconds.
			delay: 3000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});

		this.input.keyboard.on('keydown-ENTER', () => {
			this.loadMainMenu()
		})
	}

	/**
	 * Load the next scene, the main menu.
	 */
	private loadMainMenu(): void {
		this.scene.start(SceneKeys.MainMenu);
	}
}

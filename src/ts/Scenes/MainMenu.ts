import Utilities from "../Utilities";
import MainGame from "./MainGame";
import MainSettings from "./MainSettings";

let enterKey;

export default class MainMenu extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainMenu";

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");

		const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'arkaplan')
		const scaleX = this.cameras.main.width / image.width
		const scaleY = this.cameras.main.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		const textYPosition = this.cameras.main.height / 3;
		
		const helloMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, "\"Doğamıza sahip çıkarak, dünyayı temiz tutalım,\nçünkü temiz bir dünya, sağlıklı bir geleceğin temelidir.\"");
		helloMessage
			.setFontFamily("FontName")
			.setFontSize(20)
			.setFill("#fff")
			.setAlign("center")
			.setOrigin(0.5);
		helloMessage.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const newGameText = this.add.text(this.cameras.main.centerX, textYPosition, "Başla");
		newGameText
			.setFontFamily("FontName")
			.setFontSize(50)
			.setFill("#fff")
			.setAlign("center")
			.setOrigin(0.5);

		newGameText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 3);
		newGameText.setInteractive();
		newGameText.on("pointerdown", () => { this.scene.start(MainGame.Name); }, this);

		const settingsText = this.add.text(this.cameras.main.centerX, textYPosition + 75, "Ayarlar");
		settingsText.setOrigin(0.5);
		settingsText.setFontFamily("FontName").setFontSize(30).setFill("#fff");
		settingsText.setInteractive();
		settingsText.on("pointerdown", () => { this.scene.start(MainSettings.Name); }, this);
		settingsText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 3);

		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}

	public update(): void {
		if (Phaser.Input.Keyboard.JustDown(enterKey))
			this.scene.start(MainGame.Name);
	}
}

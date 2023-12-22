import Utilities from "../Utilities";
import MainGame from "./MainGame";
import MainSettings from "./MainSettings";

let characterImage: Phaser.GameObjects.Image
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

		const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'talltrees')
		const scaleX = this.cameras.main.width / image.width
		const scaleY = this.cameras.main.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		const textYPosition = this.cameras.main.height / 3;
		
		const helloMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, "\"Doğamıza sahip çıkarak, dünyayı temiz tutalım,\nçünkü temiz bir dünya, sağlıklı bir geleceğin temelidir.\"");
		helloMessage
			.setFontFamily("FontName")
			.setFontSize(20)
			.setFill("#1b5397")
			.setAlign("center")
			.setOrigin(0.5);
		helloMessage.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const newGameText = this.add.text(this.cameras.main.centerX, textYPosition, "Başla");
		newGameText
			.setFontFamily("FontName")
			.setFontSize(50)
			.setFill("#1b5397")
			.setAlign("center")
			.setOrigin(0.5);

		newGameText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		newGameText.setInteractive();
		newGameText.on("pointerdown", () => { this.scene.start(MainGame.Name); }, this);

		const settingsText = this.add.text(this.cameras.main.centerX, textYPosition + 75, "Nasıl Oynanır");
		settingsText.setOrigin(0.5);
		settingsText.setFontFamily("FontName").setFontSize(30).setFill("#1b5397");
		settingsText.setInteractive();
		settingsText.on("pointerdown", () => { this.scene.start(MainSettings.Name); }, this);
		settingsText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const changeSkin = this.add.text(this.cameras.main.centerX, textYPosition + 150, "Karakterini Değiştir");
		changeSkin
			.setFontFamily("FontName").setFontSize(30).setFill("#1b5397")
			.setOrigin(0.5);
		changeSkin.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		changeSkin.setInteractive();
		changeSkin.on("pointerdown", () => { 
			const characterSkin = localStorage.getItem('characterSkin')
			const newCharacterSkin = characterSkin == "female" ? 'male' : 'female'
			localStorage.setItem('characterSkin', newCharacterSkin)

			characterImage.setTexture(newCharacterSkin)
		}, this);

		characterImage = this.add.image(this.cameras.main.centerX, textYPosition + 210, Utilities.getCharacterName()).setInteractive()
		characterImage.on("pointerdown", () => { 
			const characterSkin = localStorage.getItem('characterSkin')
			const newCharacterSkin = characterSkin == "female" ? 'male' : 'female'
			localStorage.setItem('characterSkin', newCharacterSkin)

			characterImage.setTexture(newCharacterSkin)
		}, this);

		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}

	public update(): void {
		if (Phaser.Input.Keyboard.JustDown(enterKey))
			this.scene.start(MainGame.Name);
	}
}

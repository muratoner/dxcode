import Utilities from "../Utilities";
import { SceneKeys } from "../Utilities/Keys";
import MainMenu from "./MainMenu";
export default class MainSettings extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainSettings";

	public create(): void {
		Utilities.LogSceneMethodEntry("MainSettings", "create");
		this.input.createDefaultCursor();
		
		const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'talltrees')
		const scaleX = this.cameras.main.width / image.width
		const scaleY = this.cameras.main.height / image.height
		const scale = Math.max(scaleX, scaleY)
		image.setScale(scale).setScrollFactor(0)

		const startYPosition = this.cameras.main.height - 450;
		const fontSize = 15;
		const titleSize = 25;

		const goalTitle = this.add.text(this.cameras.main.centerX, startYPosition, "Oyunun Amacı:");
		goalTitle
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(titleSize).setFill("#1b5397")
		goalTitle.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		const goalContent = this.add.text(this.cameras.main.centerX, startYPosition + 35, "Atıkları toplayarak ve çevreyi temizleyerek puan kazanın. Bombalara ve büyük toplara dikkat edin.");
		goalContent
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(fontSize).setFill("#1b5397")
		goalContent.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		
		const moveTitle = this.add.text(this.cameras.main.centerX, startYPosition + 80, "Karakter Hareketi:");
		moveTitle
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(titleSize).setFill("#1b5397")
		moveTitle.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		const moveContent = this.add.text(this.cameras.main.centerX, startYPosition + 115, "W, A, D tuşları, Space tuşu veya ok yönleri kullanılarak karakteri yukarı, sol, sağ yönlere hareket ettirin.");
		moveContent
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(fontSize).setFill("#1b5397")
		moveContent.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const soundTitle = this.add.text(this.cameras.main.centerX, startYPosition + 160, "Ses Kontrolü:");
		soundTitle
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(titleSize).setFill("#1b5397")
		soundTitle.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		const soundContent = this.add.text(this.cameras.main.centerX, startYPosition + 195, "M tuşunu kullanarak oyunun sesini kapatıp açabilirsiniz.");
		soundContent
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(fontSize).setFill("#1b5397")
		soundContent.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const pauseTitle = this.add.text(this.cameras.main.centerX, startYPosition + 240, "Oyun Kontrolleri:");
		pauseTitle
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(titleSize).setFill("#1b5397")
		pauseTitle.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		const pauseContent = this.add.text(this.cameras.main.centerX, startYPosition + 275, "Oyunu durdurmak veya başlatmak için ENTER tuşunu kullanın.");
		pauseContent
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(fontSize).setFill("#1b5397")
		pauseContent.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		
		// Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, startYPosition + 320 , "Geri Dön");
		backText
			.setOrigin(0.5)
			.setFontFamily("FontName").setFontSize(titleSize).setFill("#1b5397")
			.setInteractive();
		backText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);
		backText.on("pointerdown", () => { this.scene.start(SceneKeys.MainMenu); }, this);
	}
}

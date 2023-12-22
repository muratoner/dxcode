import Utilities from "../Utilities";
import MainGame from "./MainGame";
import SecretChapter from "./SecretChapter";
let escKey;

export default class GamePause extends Phaser.Scene {
	public static Name = "GamePause";

	public create(): void {
		Utilities.LogSceneMethodEntry("GamePause", "create");
		const gamePauseText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Duraklatıldı', {
			fontFamily: 'FontName',
			fontSize: '32px',
			color: '#fff',
			align: 'center'
		});
		gamePauseText.setOrigin(0.5);
		gamePauseText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 3);

		const gamePauseDesc = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, '"Durakladığında, oyunun sadece bir parçasını gözden geçiriyorsun.\nBu, geri dönüşü olmayan bir felakete yol açan eylemlerden daha güçlüdür.\nOyununu sürdürerek, sadece karakterini değil,\naynı zamanda sürdürülebilir bir dünyayı kurtarıyorsun. \nGeri dön, çünkü gerçek bir kahraman,\nsadece oyununu değil, aynı zamanda dünyayı da korur!"', {
			fontFamily: 'FontName',
			fontSize: '20px',
			color: '#fff',
			align: 'center'
		});
		gamePauseDesc.setOrigin(0.5);
		gamePauseDesc.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
	}

	public update() {
		if (SecretChapter.IsActive) {
			if (Phaser.Input.Keyboard.JustDown(escKey)) {
				this.scene.resume(SecretChapter.Name);
				this.scene.stop(GamePause.Name);
			}
		} else {
			if (Phaser.Input.Keyboard.JustDown(escKey)) {
				this.scene.resume(MainGame.Name);
				this.scene.stop(GamePause.Name);
			}
		}
	}
}

import Utilities from "../Utilities";
import { SceneKeys } from "../Utilities/Keys";
import MainGame from "./MainGame";
import SecretChapter from "./SecretChapter";
let enterKey;

export default class GamePause extends Phaser.Scene {
	public static Name = "GamePause";

	public create(): void {
		Utilities.LogSceneMethodEntry("GamePause", "create");
		this.input.createDefaultCursor();
				
		const gamePauseText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Duraklatıldı', {
			fontFamily: 'FontName',
			fontSize: '32px',
			color: '#1b5397',
			align: 'center'
		});
		gamePauseText.setOrigin(0.5);
		gamePauseText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const gamePauseDescText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 40, 'Oyuna devam etmek için Enter\'a basın.', {
			fontFamily: 'FontName',
			fontSize: '20px',
			color: '#1b5397',
			align: 'center'
		});
		gamePauseDescText.setOrigin(0.5);
		gamePauseDescText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const gamePauseDesc = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 105, '"Durakladığında, oyunun sadece bir parçasını gözden geçiriyorsun.\nBu, geri dönüşü olmayan bir felakete yol açan eylemlerden daha güçlüdür.\nOyununu sürdürerek, sadece karakterini değil,\naynı zamanda sürdürülebilir bir dünyayı kurtarıyorsun. \nGeri dön, çünkü gerçek bir kahraman,\nsadece oyununu değil, aynı zamanda dünyayı da korur!"', {
			fontFamily: 'FontName',
			fontSize: '20px',
			color: '#1b5397',
			align: 'center'
		});
		gamePauseDesc.setOrigin(0.5);
		gamePauseDesc.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}

	public update() {
		if (SecretChapter.IsActive) {
			if (Phaser.Input.Keyboard.JustDown(enterKey)) {
				SecretChapter.IsActive = false
				this.scene.resume(SceneKeys.SecretChapter);
				this.scene.stop(GamePause.Name);
			}
		} else {
			if (Phaser.Input.Keyboard.JustDown(enterKey)) {
				this.scene.resume(SceneKeys.MainGame);
				this.scene.stop(GamePause.Name);
			}
		}
	}
}

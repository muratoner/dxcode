import Utilities from "../Utilities";
import MainGame from "./MainGame";
let enterKey;

export default class GameOver extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "GameOver";

	public create(): void {
		Utilities.LogSceneMethodEntry("GameOver", "create");
		const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over\nPress Enter to Restart', {
			fontFamily: Utilities.getFontName(),
			fontSize: '32px',
			color: '#1b5397',
			align: 'center'
		});
		gameOverText.setOrigin(0.5);
		gameOverText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const gamePauseDesc = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, '"Maalesef, bu seviyede dünya biraz daha karmaşık hale geldi.\nAncak kahraman, geri dönüş yaparak sürdürülebilir bir geleceğin temellerini atabilir.\nOyun bitmedi, asıl macera şimdi başlıyor!\nDaha temiz bir dünya için yeniden başla ve doğanın kahramanı ol"', {
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
		if (Phaser.Input.Keyboard.JustDown(enterKey)){
			this.scene.start(MainGame.Name)
			this.scene.stop(GameOver.Name);
		}
	}
}

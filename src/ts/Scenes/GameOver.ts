import { Colors } from "../UI/Colors";
import Utilities from "../Utilities";
import Firebase from "../Utilities/Firebase";
import { SceneKeys } from "../Utilities/Keys";

export default class GameOver extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "GameOver";

	public create(): void {
		Utilities.LogSceneMethodEntry(GameOver.Name, "create");

		this.input.createDefaultCursor();

		const camera = this.cameras.main

		const r = this.add.graphics();
		r.setPosition(camera.width / 2 - 155, 5)
		r.fillStyle(0xffffff, 1);
		r.fillRoundedRect(8, 8, 330, 400, 8);

		const centerText = {
			align: 'center'
		}
		this.add.textx(camera.width / 2, camera.height / 2 + 120, 'Tekrar Dene\nYeniden başlamak için sadece Enter tuşuna basabilirsin! 🎮', 'h1', centerText).setOrigin(.5);

		this.add.textx(camera.width / 2, camera.height / 2 + 250, '"Maalesef, bu seviyede dünya biraz daha karmaşık hale geldi.\nAncak kahraman, geri dönüş yaparak sürdürülebilir bir geleceğin temellerini atabilir.\nOyun bitmedi, asıl macera şimdi başlıyor!\nDaha temiz bir dünya için yeniden başla ve doğanın kahramanı ol"', 'default', centerText).setOrigin(.5);

		this.input.keyboard.on("keydown-ENTER",() => {
			this.scene.start(SceneKeys.MainGame)
			this.scene.stop(SceneKeys.GameOver);
		})

		this.time.delayedCall(500, async () => {
			const res = await Firebase.getHighScores()
			if (res.length > 0) {
				res.forEach((item, i) => {
					const self = item.id == Utilities.getPlayerName()
					const data = item.data()
					if(item) {
						const style: Phaser.Types.GameObjects.Text.TextStyle = {
							color: self ? Colors.GameOverSelfTextColor :  i == 0 ? Colors.GameOverCampionTextColor : Colors.DefaultTextColor,
							align: 'left'
						}
						this.add.textx(camera.width / 2 - 120, 25 + (i * 38), `${i+1}. ${item.id.slice(0, 15)} - ${data.score} ${i == 0 ? '🏆' : ''} ${self ? '<-' : ''}`, i == 0 ? 'h3' : 'h5', style).setOrigin(0);
					}
				})
			} else {
				Utilities.Log("No data available")
			}
		});
	}
}

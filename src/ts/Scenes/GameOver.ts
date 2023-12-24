import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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

		this.input.setDefaultCursor('url(assets/cursor.png), pointer');

		const r = this.add.graphics();
		r.setPosition(this.cameras.main.width / 2 - 155, 5)
		r.fillStyle(0xffffff, 1);
		r.fillRoundedRect(8, 8, 330, 300, 8);

		const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 85, 'Game Over\nPress Enter to Restart', {
			fontFamily: Utilities.getFontName(),
			fontSize: '32px',
			color: '#1b5397',
			align: 'center'
		});
		gameOverText.setOrigin(0.5);
		gameOverText.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		const gamePauseDesc = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 110, '"Maalesef, bu seviyede dünya biraz daha karmaşık hale geldi.\nAncak kahraman, geri dönüş yaparak sürdürülebilir bir geleceğin temellerini atabilir.\nOyun bitmedi, asıl macera şimdi başlıyor!\nDaha temiz bir dünya için yeniden başla ve doğanın kahramanı ol"', {
			fontFamily: 'FontName',
			fontSize: '20px',
			color: '#1b5397',
			align: 'center'
		});
		gamePauseDesc.setOrigin(0.5);
		gamePauseDesc.setShadow(1, 1, 'rgba(0,0,0,0.9)', 2);

		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

		this.time.delayedCall(500, () => {
			const citiesRef = query(collection(MainGame.databaseFireStore, "highscores"), orderBy("score", "desc"), limit(10));
			getDocs(citiesRef).then((snapshot) => {
				if (!snapshot.empty) {
					const docs = snapshot.docs
					docs .forEach((item, i) => {
						const data = item.data()
						if(item) {
							this.add.text(this.cameras.main.width / 2 - 130, 25 + (i * 28), `${i+1}. ${item.id.slice(0, 15)} - ${data.score}`, {
								fontFamily: 'FontName',
								fontSize: '20px',
								color: '#1b5397'					
							});
						}
					})
				} else {
			  console.log("No data available");
				}
		  }).catch((error) => {
				console.error(error);
		  });
		});
	}

	public update() {
		if (Phaser.Input.Keyboard.JustDown(enterKey)){
			this.scene.start(MainGame.Name)
			this.scene.stop(GameOver.Name);
		}
	}
}

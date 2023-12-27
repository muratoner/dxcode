import 'phaser';
import Boot from "./Scenes/Boot";
import GameOver from './Scenes/GameOver';
import MainGame from "./Scenes/MainGame";
import GamePause from "./Scenes/GamePause";
import MainMenu from "./Scenes/MainMenu";
import SecretChapter from "./Scenes/SecretChapter";
import MainSettings from "./Scenes/MainSettings";
import Preloader from "./Scenes/Preloader";
import SplashScreen from "./Scenes/SplashScreen";
import Utilities from "./Utilities";
import './Prototypes/InputPlugin'
import Firebase from './Utilities/Firebase';
import { SceneKeys } from './Utilities/Keys';

const gameConfig: Phaser.Types.Core.GameConfig = {
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true,
		}
	},
	width: 1280,
	height: 720,
	type: Phaser.AUTO,
	parent: "content",
	title: "Ctrl+Zzz DxCode Challenge Game"
};

export default class Game extends Phaser.Game {
	constructor(config: Phaser.Types.Core.GameConfig) {
		Utilities.LogSceneMethodEntry("Game", "constructor");

		Firebase.initialize()

		super(config);

		this.scene.add(SceneKeys.Boot, Boot);
		this.scene.add(SceneKeys.Preloader, Preloader);
		this.scene.add(SceneKeys.SplashScreen, SplashScreen);
		this.scene.add(SceneKeys.MainMenu, MainMenu);
		this.scene.add(SceneKeys.MainGame, MainGame);
		this.scene.add(SceneKeys.SecretChapter, SecretChapter);
		this.scene.add(SceneKeys.GameOver, GameOver);
		this.scene.add(SceneKeys.GamePause, GamePause);
		this.scene.add(SceneKeys.MainSettings, MainSettings);
		
		this.scene.start(SceneKeys.Boot);
	}
}

/**
 * Workaround for inability to scale in Phaser 3.
 * From http://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
 */
function resize(): void {
	const canvas = document.querySelector("canvas");
	const width = window.innerWidth;
	const height = window.innerHeight;
	const wratio = width / height;
	const ratio = Number(gameConfig.width) / Number(gameConfig.height);
	if (wratio < ratio) {
		canvas.style.width = width + "px";
		canvas.style.height = (width / ratio) + "px";
	} else {
		canvas.style.width = (height * ratio) + "px";
		canvas.style.height = height + "px";
	}
}

window.onload = (): void => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const game = new Game(gameConfig);
	// Uncomment the following two lines if you want the game to scale to fill the entire page, but keep the game ratio.
	resize();
	window.addEventListener("resize", resize, true);
};

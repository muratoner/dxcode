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
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';

const gameConfig: Phaser.Core.Types.GameConfig = {
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false,
		}
	},
	plugins: {
		global: [{
			key: 'rexInputTextPlugin',
			plugin: InputTextPlugin,
			start: true
		},
		]
	},
	width: 800,
	height: 600,
	type: Phaser.AUTO,
	parent: "content",
	title: "Starter Project for Phaser 3 with Visual Studio Code, TypeScript, and NodeJS"
};

export default class Game extends Phaser.Game {
	constructor(config: Phaser.Core.Types.GameConfig) {
		Utilities.LogSceneMethodEntry("Game", "constructor");

		super(config);

		this.scene.add(Boot.Name, Boot);
		this.scene.add(Preloader.Name, Preloader);
		this.scene.add(SplashScreen.Name, SplashScreen);
		this.scene.add(MainMenu.Name, MainMenu);
		this.scene.add(MainGame.Name, MainGame);
		this.scene.add(SecretChapter.Name, SecretChapter);
		this.scene.add(GameOver.Name, GameOver);
		this.scene.add(GamePause.Name, GamePause);
		this.scene.add(MainSettings.Name, MainSettings);
		this.scene.start(Boot.Name);
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

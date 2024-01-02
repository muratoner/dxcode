import Utilities from "../Utilities";
import { SceneKeys } from "../Utilities/Keys";

export default class Boot extends Phaser.Scene {
	public create(): void {
		Utilities.LogSceneMethodEntry(SceneKeys.Boot, this.create.name);

		this.input.createDefaultCursor();

		this.scene.start(SceneKeys.Preloader);
	}
}

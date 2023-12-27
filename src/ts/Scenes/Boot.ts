import Utilities from "../Utilities";
import Preloader from "./Preloader";

export default class Boot extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "Boot";

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Boot", "create");

		this.input.createDefaultCursor();

		this.scene.start(Preloader.Name);
	}
}

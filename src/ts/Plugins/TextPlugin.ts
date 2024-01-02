import { Colors } from "../UI/Colors";
import Utilities from "../Utilities";
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

Phaser.GameObjects.GameObjectFactory.prototype.textx = function(x, y, text, type = 'default', style) {
	const _style: TextStyle = {
		fontFamily: Utilities.getFontName(),
		color: Colors.DefaultTextColor,
		fontSize: '20px',
		...style
	}

	switch (type) {
	case "h1":
		_style.fontSize = '32px'
		break
	case "h2":
		_style.fontSize = '30px'
		break
	case "h3":
		_style.fontSize = '28px'
		break
	case "h4":
		_style.fontSize = '26px'
		break
	case "h5":
		_style.fontSize = '24px'
		break
	}

	return (this as Phaser.GameObjects.GameObjectFactory).text(x, y, text, _style).setOrigin(0);
}

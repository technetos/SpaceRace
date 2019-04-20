var KeyBoardState = {
  pressUp: false,
  pressDown: false,
  pressLeft: false,
  pressRight: false,
};

window.addEventListener('keydown', function (e) {
	switch (e.keyCode) {
		case 87://w
			KeyBoardState.pressUp = true;
			break;
		case 83://s
			KeyBoardState.pressDown = true;
			break;
		case 65://a
			KeyBoardState.pressLeft = true;
			break;
		case 68://d
			KeyBoardState.pressRight = true;
			break;
	}
});

window.addEventListener('keyup', function (e) {
	switch (e.keyCode) {
		case 87://w
			KeyBoardState.pressUp = false;
			break;
		case 83://s
			KeyBoardState.pressDown = false;
			break;
		case 65://a
			KeyBoardState.pressLeft = false;
			break;
		case 68://d
			KeyBoardState.pressRight = false;
			break;
	}
});

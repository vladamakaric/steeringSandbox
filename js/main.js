window.onload = main;

function main(){
	var ui = UI.UIConstructor();

	var mainLoop = function(timestamp){
		var dt = 1;
		ui.update(dt);
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
}

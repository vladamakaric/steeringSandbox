window.onload = main;

function main(){

	var v1 = $V([0,0]);
	var v2 = $V([100,100]);

	var v3 = $V([110,110]);

	var ls1 = $LS(v1,v2);

	console.log(ls1.length() + " " + ls1.isProjectionOn(v3) + " " + ls1.isProjectionOn($V([20,20])));

	var ui = UI.UIConstructor();

	var mainLoop = function(timestamp){
		var dt = 1;
		ui.update(dt);
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
}

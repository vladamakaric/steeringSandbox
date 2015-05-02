window.onload = main;

function main(){

	var v1 = $V([3,4]);
	var v2 = $V([9,-3]);

	var A = Line.create([0,0], [2,1]);
	var B = Line.create([0,100], [1,0]);
	var v3 = A.intersectionWith(B);
	console.log(v3.e(1) + ' ' + v3.e(2));

	var ui = UI.UIConstructor();

	var mainLoop = function(timestamp){
		var dt = 1;
		ui.update(dt);
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
}

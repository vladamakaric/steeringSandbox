var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var path = [$V([100,100]), $V([250,200]),
			$V([120,500]), $V([500, 500])];
		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([0,1]),
										  orientation: 0}, 
										  {invMass: 1,
										   maxForce: 0.08,
										   maxSpeed: 1.7},
										  [path]);

		var boids = [boid];
		var simulation = SIMUL.SimulationConstructor(boids, null);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		DRAW.c = c;

		var canvasPointerEvents = CanvPtrEventMngr(canvas);

		canvasPointerEvents.ptrDown = function(pos){
			var V = $V([pos.x, pos.y]);
			simulation.boids[0].state.position = V;
		}

		canvasPointerEvents.attachEvents();
		////////////////////////////////////




		///////////////////////////////////

		that.update = function(dt){
			c.clearRect(0,0, canvas.width, canvas.height);	
			simulation.update(dt);
			interf.DRAW.boids(c, simulation.boids, 10);
			DRAW.openPath(c,path);
		}

		return that;
	}

	return interf;
}(UI || {}));

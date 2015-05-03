var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([0,1]),
										  orientation: 0}, 
										  {invMass: 1,
										   maxForce: 0.05,
										   maxSpeed: 1.7},
										  null);

		var boids = [boid];
		var simulation = SIMUL.SimulationConstructor(boids, null);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');


		////////////////////////////////////


		var path = [$V([10,10]), $V([100,100]), $V([200,100])];


		///////////////////////////////////

		that.update = function(dt){
			simulation.update(dt);
			c.clearRect(0,0, canvas.width, canvas.height);	
			interf.DRAW.boids(c, simulation.boids, 10);

			DRAW.openPath(c,path);
		}

		return that;
	}

	return interf;
}(UI || {}));

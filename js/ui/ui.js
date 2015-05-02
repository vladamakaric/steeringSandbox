var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([1,1]),
										  orientation: 0}, 
										  null,
										  null);

		var boids = [boid];
		var simulation = SIMUL.SimulationConstructor(boids, null);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		that.update = function(dt){
			simulation.update(dt);
			c.clearRect(0,0, canvas.width, canvas.height);	
			interf.DRAW.boids(c, simulation.boids, 10);
		}

		return that;
	}

	return interf;
}(UI || {}));

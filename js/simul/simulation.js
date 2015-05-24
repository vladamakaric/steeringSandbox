var SIMUL = (function (interf) {

	interf.Simulation = function(boids, lineSegs){
		var that = {};
		that.boids = boids;
		that.lineSegs = lineSegs;

		that.update = function(dt){

			boids.forEach(function(boid){
				var BWI = SIMUL.BoidWorldInfo(boid, that, 100);
				boid.update(dt, BWI);
			});
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

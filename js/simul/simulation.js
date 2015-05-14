var SIMUL = (function (interf) {

	interf.SimulationConstructor = function(boids, lineSegs){
		var that = {};
		that.boids = boids;
		that.lineSegs = lineSegs;

		that.update = function(dt){

			boids.forEach(function(boid){
				var BWI = SIMUL.BoidWorldInfo(boid, that);
				boid.update(dt, BWI);
			});
		}


		return that;
	}

	return interf;
}(SIMUL || {}));

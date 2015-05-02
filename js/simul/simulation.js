var SIMUL = (function (interf) {

	interf.SimulationConstructor = function(boids, lineSegs){
		var that = {};
		that.boids = boids;
		that.lineSegs = lineSegs;
		var BWI = interf.BoidWorldInfoConstructor(that);

		that.update = function(dt){

			boids.forEach(function(boid){
				boid.update(dt, BWI);
			});
		}


		return that;
	}

	return interf;
}(SIMUL || {}));

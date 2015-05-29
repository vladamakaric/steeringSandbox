var SIMUL = (function (interf) {

	interf.Simulation = function(boids, lineSegs){
		var that = {};
		that.boids = boids;
		that.lineSegs = lineSegs;

		that.update = function(dt){

			boids.forEach(function(boid){
				var BWI = SIMUL.BoidWorldInfo(boid, that);
				boid.update(dt, BWI);
			});
		}

		that.removeBoid = function(boid){
			that.boids.splice(that.boids.indexOf(boid), 1);
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

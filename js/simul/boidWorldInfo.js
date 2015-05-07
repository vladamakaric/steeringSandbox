var SIMUL = (function (interf) {

	interf.BoidWorldInfoConstructor = function(simulation){
		var that = {};

		//TODO: Sta ako se desi da je pogodjeno deljeno teme 2 LS-a?
		//Taj specijalni slucaj bice obradjen jedino ako bude falilo
		that.getNearestLineSegmentIntersection = function(lineSeg, V){

			var lineSegs = simulation.lineSegs;

			var closestLS = null;
			var closestIP = null;
			var minSqDistIP = Number.MAX_VALUE;

			lineSegs.forEach(function(ls){

				var interP = ls.intersectionWith(lineSeg);

				if(interP!=null){
					var distSq = interP.subtract(V).lengthSq();
						
					if(minSqDistIP > distSq){
						minSqDistIP = distSq;
						closestIP = interP;
						closestLS = ls;
					}
				}
			});

			if(closestLS == null)
				return null;

			return {lineSegment: closestLS, intersectionPoint: closestIP};
		}






		that.getNeighborsInRadius = function(r){

			return null;
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

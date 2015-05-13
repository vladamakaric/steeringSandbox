var SIMUL = (function (interf) {

	interf.BoidWorldInfoConstructor = function(simulation){
		var that = {};

		that.getNearestLineSegmentPoint = function(V){
			var lineSegs = simulation.lineSegs;

			var closestLS = null;
			var closestPoint = null;
			var minSqDistPoint = Number.MAX_VALUE;

			var ls2 = null;
			lineSegs.forEach(function(ls){

				var cp = ls.pointClosestTo(V);


				if(closestPoint){
					if(cp.eql(closestPoint))
						ls2 = ls; 
				}

				var distSq = cp.subtract(V).lengthSq();

				
					
				if(minSqDistPoint > distSq){
					minSqDistPoint = distSq;
					closestPoint = cp;
					closestLS = ls;
					ls2 = null;
				}
			});

			if(closestLS == null)
				return null;

			//najblizi je cosak koji dele ove dve duzi
			if(ls2 && closestLS){

				var ls3Dir  = V.subtract(closestPoint).getCWPerp2D().scale(111);


				var ls3 = $LS(closestPoint.add(ls3Dir.x(-1)), closestPoint.add(ls3Dir));


				
				return {lineSegment: ls3, closestPoint: closestPoint, corner: true};
			}

			return {lineSegment: closestLS, closestPoint: closestPoint};
		}


		that.isPathClear = function(lineSeg){

			var lineSegs = simulation.lineSegs;

			return !lineSeg.intersectsLineSegments(lineSegs);
		}



		//TODO: Sta ako se desi da je pogodjeno deljeno teme 2 LS-a?
		//Taj specijalni slucaj bice obradjen jedino ako bude falilo
		//E pa zatrebalo je:
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

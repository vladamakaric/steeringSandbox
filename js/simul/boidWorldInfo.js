var SIMUL = (function (interf) {

	interf.BoidWorldInfo = function(boid, simulation, POVRadius){
		var that = {};

		that.neighborBoids = getNeighborBoids();

		function getNeighborBoids(){

			var neighbors = simulation.boids.filter(function(pNeighbor){ 

				if(pNeighbor == boid)
					return false;

				return boid.state.position.distanceFrom(pNeighbor.state.position)<boid.properties.FOVRadius;
			});

			return neighbors;
		}

		function getBoidsTimeOfCollision(boidA, boidB){
			return VECTOR_UTIL.getTimeUntilConstantVelocityMovingBallsCollision({
				velA: {x: boidA.state.velocity.e(1), y: boidA.state.velocity.e(2)},
				velB: {x: boidB.state.velocity.e(1), y: boidB.state.velocity.e(2)},
				posB: {x: boidB.state.position.e(1), y: boidB.state.position.e(2)},
				posA: {x: boidA.state.position.e(1), y: boidA.state.position.e(2)},
				rA: boidA.properties.radius,
				rB: boidB.properties.radius
			});
		}



		//neradi dobro kada vec postoji sudar, tada treba da vrati najblizi po razdaljini a ne po vremenu
		that.getFirstCollisionInFOV = function(angle){

			var candidates = that.getNeighborsInFOV(angle);


			var collisions = candidates.reduce(function(memo, nb) {

				var bdist = boid.distanceTo(nb);
				
				if(bdist<0){
					memo.push({ penetration: bdist, boid: nb});
					return memo;
				}

				var time = getBoidsTimeOfCollision(boid, nb);

				if (time != null && time > 0)
					memo.push({ time: time, boid: nb});

				return memo;
			}, []);


			if(collisions.length==0)
				return null;

			var firstCollision = _.min(collisions, function(col){ return col.penetration || col.time; });

			return firstCollision;
		}

		that.getNeighborsInFOV = function(angle){

			function neighborInFOV(neighbor){
				var dir = Vector.getUnitFromAngle(boid.state.orientation);
				var toNeighbor= neighbor.state.position.subtract(boid.state.position); 
				return dir.angleFrom(toNeighbor) < angle/2;
			}

			return that.neighborBoids.filter(function(nb){
				return neighborInFOV(nb); 
			});
		}

		that.getDistanceToObstacle = function(V, obstacleInfo){
			var dists = obstacleInfo.lineSegments.map(function(ls){ return ls.distanceFrom(V); });
			return dists.min();
		}

		that.getClosestObstacleInfoOfPoint = function (V){
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

			lss = [];
			lss.push(closestLS);
			if(ls2)
				lss.push(ls2);

			return {closestPoint: closestPoint, lineSegments: lss};
		}

		that.closestObstacleInfo = that.getClosestObstacleInfoOfPoint(boid.state.position);

		that.isPathClear = function(lineSeg){

			var lineSegs = simulation.lineSegs;

			return !lineSeg.intersectsLineSegments(lineSegs);
		}

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

var BEHAVIOR = (function(interf){

	interf.Cohesion = function(r){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			function getNeighborsInFrustum(angle){

				function neighborInFrustum(neighbor){
					var dir = Vector.getUnitFromAngle(boid.state.orientation);
					var toNeighbor= neighbor.state.position.subtract(boid.state.position); 
					return dir.angleFrom(toNeighbor) < angle;
				}

				return BWI.neighborBoids.filter(function(nb){
					return neighborInFrustum(nb); 
				});
			}

			var averagePos = $V([0,0]);


			var visibleNeighbors = getNeighborsInFrustum(Math.PI/4);

			if(!visibleNeighbors.length)
				return $V([0,0]);
			visibleNeighbors.forEach(function(nb){
				averagePos = averagePos.add(nb.state.position);
			});


			averagePos = averagePos.x(1/visibleNeighbors.length);

			var c = DRAW.c.strokeStyle;
			DRAW.c.strokeStyle = 'blue';		
			DRAW.circleOutline(DRAW.c, averagePos, 10);
			DRAW.fillStyle = c;

			return STEERING.seek(boid, averagePos, 0);
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

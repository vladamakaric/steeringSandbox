var BEHAVIOR = (function(interf){

	interf.Align = function(){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var averageVel = $V([0,0]);

			if(!BWI.visibleNeighbors.length)
				return $V([0,0]);

			BWI.visibleNeighbors.forEach(function(nb){
				averageVel = averageVel.add(nb.state.velocity);
			});

			// if(averageVel.length()<0.6)
			// 	return $V([0,0]);

			averageVel = averageVel.x(1/BWI.visibleNeighbors.length);
			return STEERING.velocityMatch(boid, averageVel);
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

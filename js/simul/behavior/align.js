var BEHAVIOR = (function(interf){

	interf.Align = function(){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var averageVel = $V([0,0]);

			var neighbors = BWI.getNeighborsInFOV(Math.PI);

			if(!neighbors.length)
				return $V([0,0]);

			var velSum = 0;
			neighbors.forEach(function(nb){
				averageVel = averageVel.add(nb.state.velocity);
				velSum += nb.state.velocity.length();
			});

			var koef = velSum/(boid.properties.maxSpeed*neighbors.length);

			averageVel = averageVel.x(1/neighbors.length);

			return STEERING.velocityMatch(boid, averageVel).x(koef);
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

var BEHAVIOR = (function(interf){

	interf.Separation = function(){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var orient = boid.state.orientation;
			var repulsiveForce = $V([0,0]);

			var neighbors = BWI.getNeighborsInFOV(Math.PI*2);

			if(!neighbors.length)
				return $V([0,0]);





			neighbors.forEach(function(nb){
				var toBoid = pos.subtract(nb.state.position);

				var dist = boid.distanceTo(nb);
				var distTol = (vel.length() + nb.state.velocity.length())/(2*boid.properties.maxSpeed);

				var distTol = Math.pow(distTol, 3);
				var cuttOff = distTol*20;

				
				if(cuttOff < 1)
					return;

				if(dist<cuttOff)
					repulsiveForce = repulsiveForce.add(toBoid.x(1/dist));
			});

			// if(vel.lengthSq()<0.11 || vel.dot(repulsiveForce) > 0)
			// 	return $V([0,0]);

			return repulsiveForce;
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

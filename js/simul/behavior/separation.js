var BEHAVIOR = (function(interf){

	interf.Separation = function(){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var orient = boid.state.orientation;
			var repulsiveForce = $V([0,0]);

			if(!BWI.visibleNeighbors.length)
				return $V([0,0]);

			BWI.visibleNeighbors.forEach(function(nb){
				var toBoid = pos.subtract(nb.state.position);
				repulsiveForce = repulsiveForce.add(toBoid.x(1/toBoid.lengthSq()));
			});

			if(vel.lengthSq()<0.11 || vel.dot(repulsiveForce) > 0)
				return $V([0,0]);

			return repulsiveForce;
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

var BEHAVIOR = (function(interf){

	interf.Cohesion = function(r){

		var that = {};

		var fovAngle = Math.PI/4;

		that.getSteeringForce = function(boid, BWI){

			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var orient = boid.state.orientation;

			var fovHalfAngle = boid.properties.FOVAngle/2;
			var averagePos = $V([0,0]);
			var dir = Vector.getUnitFromAngle(boid.state.orientation);

			DRAW.c.beginPath();
			DRAW.c.moveTo(pos.e(1) ,pos.e(2));
			DRAW.c.arc(pos.e(1) ,pos.e(2), boid.properties.FOVRadius, orient - fovHalfAngle, orient + fovHalfAngle);
			DRAW.c.closePath();
			DRAW.c.stroke();

			if(!BWI.visibleNeighbors.length)
				return $V([0,0]);

			BWI.visibleNeighbors.forEach(function(nb){
				averagePos = averagePos.add(nb.state.position);
			});

			// averagePos = averagePos.add(pos);
			averagePos = averagePos.x(1/(BWI.visibleNeighbors.length+0));

			var c = DRAW.c.strokeStyle;
			DRAW.c.strokeStyle = 'blue';		
			DRAW.circleOutline(DRAW.c, averagePos, 10);
			DRAW.fillStyle = c;

			return STEERING.seek(boid, averagePos, 25, vel.length()/boid.properties.maxSpeed);
		}

		return that;
	}

	return interf;
})(BEHAVIOR || {});

var BEHAVIOR = (function(interf){

	function normalizeAngle(ang){
		if(ang> Math.PI)
			ang = -Math.PI*2 + ang;

		if(ang<-Math.PI)
			ang += Math.PI*2;

		return ang;
	}
	
	interf.Wander = function(r, d){
		var that = {};
		var angle = 0;

		that.getSteeringForce = function(boid, BWI){
			var vel = boid.state.velocity;
			var pos = boid.state.position;

			 if(Math.random()>0.7){

				 var delta =Math.sign(2*Math.random()-1)*0.2; 

				angle = normalizeAngle(angle); 

				if(Math.abs(angle)>Math.PI/4)
					delta = Math.abs(delta)*-1*Math.sign(angle);

				angle+=delta;

			 }

			var orientation = boid.state.orientation;
			var future = vel.scale(d);
			var rand = $V([Math.cos(angle + orientation), Math.sin(angle + orientation)]).x(r);
			var seekTarget = pos.add(future.add(rand));

			// DRAW.circleOutline(DRAW.c, pos.add(future), r);
			// DRAW.line(DRAW.c, pos, seekTarget);

			return STEERING.seek(boid, seekTarget, 0);
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

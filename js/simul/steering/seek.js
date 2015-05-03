var STEERING = (function (interf) {

	interf.seek = function(boid, dest, arriveR){
		var vel = boid.state.velocity;
		var pos = boid.state.position;
		var maxSpeed = boid.properties.maxSpeed;
		var maxForce = boid.properties.maxForce;

		var toDest = dest.subtract(pos);
	
		var destVel = toDest.truncate(maxSpeed);

		var dist = toDest.length();

		if(dist < arriveR){
			destVel = destVel.scale(dist/arriveR);
		}

		var force = destVel.subtract(vel).truncate(maxForce);
		return force;
	}

	return interf;
}(STEERING || {}));

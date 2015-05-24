var STEERING = (function (interf) {

	interf.velocityMatch = function(boid, targetVel){

		var vel = boid.state.velocity;
		var pos = boid.state.position;
		var maxSpeed = boid.properties.maxSpeed;
		var maxForce = boid.properties.maxForce;

		var force = targetVel.truncate(maxSpeed).subtract(vel).truncate(maxForce);
		return force;
	}

	return interf;
}(STEERING || {}));

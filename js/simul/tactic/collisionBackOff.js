var TACTIC = (function(interf){

	interf.CollisionBackOff = function(boid, BWI){
		var that = {};
		var oldMaxForce = boid.properties.maxForce;

		boid.properties.maxForce = 0.3;

		var vel = boid.state.velocity;
		var pos = boid.state.position;

		var COP = BWI.closestObstacleInfo.closestPoint;
		var toBoid = pos.subtract(COP); 

		var goal = COP.add(toBoid.scale(boid.properties.radius*2.2));
		var startVel = vel.dup();


		that.getNextStep = function(boid, BWI){
			vel = boid.state.velocity;
			pos = boid.state.position;

			if(startVel.dot(vel)<-0.9 || pos.subtract(goal).length()<2){
				boid.properties.maxForce = oldMaxForce;
				return {status: TACTIC.FINISHED};
			}

			var force = STEERING.seek(boid, goal, 7);
			return {status: TACTIC.IN_PROGRESS, force: force};
		}

		return that;
	}

	return interf;

})(TACTIC || {});

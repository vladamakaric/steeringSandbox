var BEHAVIOR = (function(interf){

	interf.PathFollow= function(path, capsuleR, prongL){
		var that = {};

		that.getSteeringForce = function(boid, BWI){
			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var cindx = PATH.getClosestLSIndx(pos, path);
			var closestLS = $LS(path[cindx], path[cindx+1]);
			var locOnCLS = closestLS.pointClosestTo(pos);

			// if(locOnCLS == path[0])
			// 	return STEERING.seek(boid, path[0], 0); 
			var projOnPath = {pos: locOnCLS, lsIndx: cindx};

			var velScale = vel.length()/boid.properties.maxSpeed;

			var target = PATH.advancePathLocation(path, projOnPath, prongL*velScale);


			var future = pos.add(vel.scale(prongL));

			var futureInCapsule = PATH.getDistance(future, path) < capsuleR; 

			var targetIsGoal = target.pos.subtract(path.last()).length()<0.3;
		
			var projToTarget = target.pos.subtract(projOnPath.pos);

			if(futureInCapsule && vel.dot(projToTarget) > 0 && !targetIsGoal)
				return STEERING.seek(boid, future, 0); 
			
			var arriveR = 0;
		
			if(targetIsGoal)
				arriveR = capsuleR*2;

			return STEERING.seek(boid, target.pos, arriveR);
		}
		return that;
	}

	return interf;

})(BEHAVIOR || {});

var BEHAVIOR = (function(interf){

	interf.PathFollowConstructor = function(path, capsuleR, prongL){
		var that = {};

		that.getSteeringForce = function(boid){
			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var cindx = PATH.getClosestLSIndx(pos, path);
			var closestLS = $LS(path[cindx], path[cindx+1]);
			var locOnCLS = closestLS.pointClosestTo(pos);


			
			

			if(locOnCLS == path[0])
				return STEERING.seek(boid, path[0], 0); 




			var projOnPath = {pos: locOnCLS, lsIndx: cindx};
			var curSpeed = boid.state.velocity.length()+1;




			var velScale = vel.length()/boid.properties.maxSpeed;

			var target = PATH.advancePathLocation(path, projOnPath, prongL*velScale);

			var future = pos.add(vel.scale(prongL));

			// DRAW.point(DRAW.c, target.pos);
			var projToTarget = target.pos.subtract(projOnPath.pos);

			var targetIsGoal = target.pos.subtract(path[path.length-1]).length()<0.3;
		
			if(PATH.getDistance(future, path) < capsuleR && vel.dot(projToTarget) > 0 && !targetIsGoal)
				return STEERING.seek(boid, future, 0); 
			
			var arriveR = 0;
		
			if(targetIsGoal)
				arriveR = capsuleR;

			return STEERING.seek(boid, target.pos, arriveR);
		}
		return that;
	}

	return interf;

})(BEHAVIOR || {});

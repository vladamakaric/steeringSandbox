var BEHAVIOR = (function(interf){


	interf.pathFollow = function(boid, path, capsuleR, prongL){
		var pos = boid.state.position;
		var vel = boid.state.velocity;
		var cindx = PATH.getClosestLSIndx(pos, path);
		var closestLS = $LS(path[cindx], path[cindx+1]);
		var locOnCLS = closestLS.pointClosestTo(pos);
		var projOnPath = {pos: locOnCLS, lsIndx: cindx};
		var curSpeed = boid.state.velocity.length()+1;
		var target = PATH.advancePathLocation(path, projOnPath, prongL);

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







	return interf;

})(BEHAVIOR || {});

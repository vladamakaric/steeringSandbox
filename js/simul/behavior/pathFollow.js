var BEHAVIOR = (function(interf){

	interf.PathFollowConstructor = function(path, capsuleR, prongL){
		var that = {};

		that.getSteeringForce = function(boid, BWI){
			var pos = boid.state.position;
			var vel = boid.state.velocity;
			var cindx = PATH.getClosestLSIndx(pos, path);
			var closestLS = $LS(path[cindx], path[cindx+1]);
			var locOnCLS = closestLS.pointClosestTo(pos);

			// if(locOnCLS == path[0])
			// 	return STEERING.seek(boid, path[0], 0); 

			var cpDesc = BWI.getNearestLineSegmentPoint(pos);





			var projOnPath = {pos: locOnCLS, lsIndx: cindx};
			var curSpeed = boid.state.velocity.length()+1;
			var velScale = vel.length()/boid.properties.maxSpeed;

			var target = PATH.advancePathLocation(path, projOnPath, prongL*velScale);

			var projToTarget = target.pos.subtract(projOnPath.pos);

			var distToCP = cpDesc.closestPoint.subtract(pos).length();
			var r = 25;

			var future = pos.add(vel.scale(prongL));


			var futureInCapsule = PATH.getDistance(future, path) < capsuleR; 

			if(distToCP<r){

				var scale = distToCP/r;
				scale*=scale*scale*scale*scale*scale;
				var newTarget = PATH.advancePathLocation(path, projOnPath, prongL*velScale*scale);


				var goal = newTarget.pos;

				var targetToFuture = future.subtract(goal);


				//interpolacija izmedju trenutnog smera i ogranicenja na putanju
				//ukoliko blizina boid-a nije prevelika, ako je prevelika mora se
				//ostro skrenuti ka putanju, bez interpolacije
				if(scale>0.8 && futureInCapsule)
				goal = goal.add(targetToFuture.x(scale));

				DRAW.point(DRAW.c, goal);


				return STEERING.seek(boid, goal, arriveR);
			}



			var targetIsGoal = target.pos.subtract(path[path.length-1]).length()<0.3;
		
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

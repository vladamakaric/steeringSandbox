var BEHAVIOR = (function(interf){

	interf.WallAvoid = function(innerR, outerR){

		var that = {};

		that.getSteeringForce = function(boid, BWI){
			var vel = boid.state.velocity;
			var pos = boid.state.position;

			var COP = BWI.closestObstacleInfo.closestPoint;
			var toBoid = pos.subtract(COP); 
			var dist = toBoid.length();

			if(dist>outerR)
				return $V([0,0]);

			var future = pos.add(vel.x(10));
			var futureDist = BWI.getDistanceToObstacle(future, BWI.closestObstacleInfo); 

			if((futureDist>innerR && dist>innerR))
				return $V([0,0]);

			var tangentDir = toBoid.getCWPerp2D().toUnitVector();
			var headOnImpactFactor = tangentDir.dot(vel.toUnitVector());
			var tangentFollowDisplacement = tangentDir.x(headOnImpactFactor*dist);

			var minDisp = 10;
			if(tangentFollowDisplacement.length()<minDisp){
				tangentFollowDisplacement = tangentFollowDisplacement.scale(minDisp);
			}

			var distFromObstacle = innerR;

			var targetPos = COP.add(tangentFollowDisplacement).add(toBoid.scale(distFromObstacle));
			var targetCOI = BWI.getClosestObstacleInfoOfPoint(targetPos);

			var targetCOP = targetCOI.closestPoint;
			var targetObstacleDistance = targetCOP.distanceFrom(targetPos);

			//Nikad tacka pracenja nesme da se udalji vise od distFromLS, to moze da se desi zobg virtuelnih LS
			if(targetObstacleDistance>distFromObstacle){
				targetPos = targetCOP.add(targetPos.subtract(targetCOP).scale(distFromObstacle));

			}else
			//ako je u cosku i krenuo na pogresnu stranu, obrni
			if(targetObstacleDistance<17){
				targetPos = COP.add(tangentFollowDisplacement.x(-1.4)).add(toBoid.scale(distFromObstacle));
			}
			
			return STEERING.seek(boid, targetPos, 0);
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

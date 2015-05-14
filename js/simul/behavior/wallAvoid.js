var BEHAVIOR = (function(interf){

	interf.FrontLateralProngsGenerator = function(fprongL, sprongL){

		return function(boid){ 
			var vel = boid.state.velocity;
			var frontProng = vel.x(fprongL);
		
			var velLen = vel.length();
			var sideProng1 = frontProng.rotate(Math.PI/3,$V([0,0])).scale(sprongL);
			var sideProng2 = frontProng.rotate(-Math.PI/3,$V([0,0])).scale(sprongL);

			var sideProng3 = frontProng.rotate(Math.PI/6,$V([0,0])).scale(velLen*sprongL);
			var sideProng4 = frontProng.rotate(-Math.PI/6,$V([0,0])).scale(velLen*sprongL);
			return [frontProng, sideProng3, sideProng4];
		};
	}

	interf.WallRepell = function(boid, cpDesc){

		var that = {};

		var vel = boid.state.velocity;
		var pos = boid.state.position;

		var normal = cpDesc.lineSegment.getNormal();
		var toBoid =pos.subtract(cpDesc.closestPoint); 
		normal = normal.x(normal.dot(toBoid)).toUnitVector();

		var goal = cpDesc.closestPoint.add(normal.scale(boid.properties.radius*2.2));

		var startVel = vel.dup();

		that.getSteeringForce = function(boid, worldInfo){

			vel = boid.state.velocity;
			pos = boid.state.position;

			if(startVel.dot(vel)<-0.9 || pos.subtract(goal).length()<2)
				return null;

			return STEERING.seek(boid, goal, 7);
		}


		return that;
	}


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

			//Nikad tacka nesme pracenja nesme da se udalji vise od distFromLS, to moze da se desi zobg virtuelnih LS
			if(targetObstacleDistance>distFromObstacle){
				targetPos = targetCOP.add(targetPos.subtract(targetCOP).scale(distFromObstacle));

			}else
			//ako je u cosku i krenuo na pogresnu stranu, obrni
			if(targetObstacleDistance<17){
				targetPos = COP.add(tangentFollowDisplacement.x(-1.4)).add(toBoid.scale(distFromObstacle));
			}
			
			// DRAW.point(DRAW.c, targetPos);
			return STEERING.seek(boid, targetPos, 0);
		}

		return that;
	}

	interf.Wander = function(r, d){
		var that = {};
		var angle = Math.PI/2 + Math.PI;
		var angleVel = 0.00;

		that.getSteeringForce = function(boid, BWI){
			var vel = boid.state.velocity;
			var pos = boid.state.position;

			var future = vel.scale(d);
			
			var amount = Math.random()*0.02;

			if(Math.random()>0.5)
				amount=-amount;

			angleVel+=amount;

			if(Math.random()>0.9)
				angleVel=0;

			// angle+=angleVel;
			var rand = $V([Math.cos(angle), Math.sin(angle)]).x(r);


			var seekTarget = pos.add(future.add(rand));

			// DRAW.circleOutline(DRAW.c, pos.add(future), r);
			// DRAW.line(DRAW.c, pos, seekTarget);

			var futureSeek = pos.add(vel.x(r));

			if(Math.random()>0.95)
				return STEERING.seek(boid, futureSeek, 0);

			return STEERING.seek(boid, seekTarget, 0);
		}

		return that;




	}


	interf.WallAvoidConstructor = function(prongsGenFunc){
		var that = {};


		


		that.getSteeringForce = function(boid, BWI){

			var vel = boid.state.velocity;
			var pos = boid.state.position;

			var prongs = prongsGenFunc(boid);

			var prongDelta;
			var interPDesc;

			prongs.some(function(prongD){

				prongDelta = prongD;

				var prongEndPoint = pos.add(prongDelta);

				DRAW.line(DRAW.c, pos, prongEndPoint);
				var prongLS = $LS(pos, prongEndPoint);
				interPDesc = BWI.getNearestLineSegmentIntersection(prongLS, pos);

				if(interPDesc)
					return true;
			});

			if(!interPDesc)
				return $V([0,0]);

			var ls = interPDesc.lineSegment;
			var pt = interPDesc.intersectionPoint;
			
			DRAW.point(DRAW.c, pt);

			
			
			var normal = ls.getNormal().toUnitVector();

			//make normal point away from boid
			normal = normal.x(normal.dot(prongDelta)).toUnitVector();

			var CW = -normal.cross2D(vel);

			var normalVelCompSize = vel.dot(normal);

			//force is applied perpendicular to current speed, and away from wall, that way
			//the wall doesn't slow down the boid, it only changes it's direction.
			var steeringForce = vel.getCWPerp2D().x(CW).scale(normalVelCompSize*0.05 + 0.04);

			return steeringForce;
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

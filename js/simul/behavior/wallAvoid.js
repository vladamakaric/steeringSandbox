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

	interf.WallRepell = function(){

		var that = {};



		return that;

	}


	interf.WallAvoid = function(innerR, outerR){

		var that = {};

		that.getSteeringForce = function(boid, BWI){

			var vel = boid.state.velocity;
			var pos = boid.state.position;

			//NEVALJA!!! Treba da izbaci 2 LS-a, pa da biram!!! 
			var cpDesc = BWI.getNearestLineSegmentPoint(pos);


			var normal = cpDesc.lineSegment.getNormal();
			// var normal =

			var toBoid =pos.subtract(cpDesc.closestPoint); 
			normal = normal.x(normal.dot(toBoid)).toUnitVector();
			var dist = toBoid.length();

				



			if(dist>outerR)
				return $V([0,0]);

			var future = pos.add(vel.x(20));
			// DRAW.point(DRAW.c, future);
			var futureDist = cpDesc.lineSegment.distanceFrom(future);

			var futureDistR = cpDesc.lineSegment.distanceFrom(pos.add(vel.scale(boid.properties.radius)));

			DRAW.point(DRAW.c, pos.add(vel.scale(boid.properties.radius)));

			if(futureDistR<boid.properties.radius*0.7)
				alert("alpha smor");

			if(futureDist>innerR)
				return $V([0,0]);

			var scale = dist/innerR;
			var lsDir = cpDesc.lineSegment.getDir().toUnitVector();

			var headOnImpactFactor= lsDir.dot(vel.toUnitVector());

			var followDir = lsDir.x(headOnImpactFactor*dist);

			var minDisp = 10;
			if(followDir.length()<minDisp){

				followDir = followDir.scale(minDisp);


				
			}

			var distFromLS = innerR;
			
			// if(Math.abs(headOnImpactFactor)<0.2){	
			// 	distFromLS = innerR + (1-headOnImpactFactor/0.2)*20;
			// 	// alert("juu");
			// }

			// distFromLS += (1-headOnImpactFactor)*(outerR-innerR);
			
			
			var targetPos = cpDesc.closestPoint.add(followDir).add(normal.scale(distFromLS));

			DRAW.point(DRAW.c, targetPos);
			return STEERING.seek(boid, targetPos, 0);
		}

		return that;
	}



	interf.Wander = function(r, d){
		var that = {};
		var angle = Math.PI/2;
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

			var future = pos.add(vel.x(r));

			if(Math.random()>0.95)
				return STEERING.seek(boid, future, 0);

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

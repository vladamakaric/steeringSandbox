var BEHAVIOR = (function(interf){

	interf.FrontLateralProngsGenerator = function(fprongL, sprongL){

		return function(boid){ 
			var vel = boid.state.velocity;
			var frontProng = vel.x(fprongL);
		
			var sideProng1 = frontProng.rotate(Math.PI/3,$V([0,0])).scale(sprongL);
			var sideProng2 = frontProng.rotate(-Math.PI/3,$V([0,0])).scale(sprongL);

			return [frontProng,sideProng2];
		};
	}

	interf.WallDistanceConstructor = function(r){

		var that = {};

		that.getSteeringForce = function(boid, BWI){


			var vel = boid.state.velocity;
			var pos = boid.state.position;
			cpDesc = BWI.getNearestLineSegmentPoint(pos);

			var force = pos.subtract(cpDesc.closestPoint);
			if(force.length() < r){

				var fDir = vel.getCWPerp2D();
				
				fDir = fDir.x(fDir.dot(force));

				return fDir.scale(r/force.length());
			}

			return $V([0,0]);
		}





		return that;

	}

	interf.WallAvoidConstructor = function(prongsGenFunc){
		var that = {};
		var counter = 0;


		


		that.getSteeringForce = function(boid, BWI){

			// counter++;
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
			// var proj = ls.line.pointClosestTo(prongEndPoint).to2D();

			var normal = ls.getNormal().toUnitVector();

			//make normal point away from boid
			normal = normal.x(normal.dot(prongDelta)).toUnitVector();
			// console.log("Smor");

			var CW = -normal.cross2D(vel);

			// DRAW.line(DRAW.c, pos, pos.add(normal));
			var normalVelCompSize = vel.dot(normal);
			var steeringForce = vel.getCWPerp2D().x(CW).scale(normalVelCompSize*0.05 + 0.002);
				
			// steeringForce = steeringForce.truncate(boid.properties.maxForce);
			// DRAW.line(DRAW.c, pos, pos.add(steeringForce));

			return steeringForce;
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

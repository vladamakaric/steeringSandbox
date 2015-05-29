var BEHAVIOR = (function(interf){
	interf.CollisionAvoidance = function(boid){

		var that = {};

		var oldMaxForce;

		that.getSteeringForce = function(boid, BWI){

			if(boid.precedence == undefined)
				boid.precedence = Math.random();

			if(Math.random()>0.99)
				boid.precedence = Math.random();

			if(!oldMaxForce)
				oldMaxForce = boid.properties.maxForce;


			var vel = boid.state.velocity;
			var pos = boid.state.position;

			if(vel.length()<0.001)
				return $V([0,0]);

			function isRightClear(boid, probeLength){

				if(boid.state.velocity.length()==0)
					return true;


				var probe = $LS(boid.state.position, 
							pos.add(boid.state.velocity.getCWPerp2D().scale(probeLength)));

				return BWI.isPathClear(probe);
			}

			function isLeftClear(boid, probeLength){
				return isRightClear(boid, -probeLength);
			}

			var collision;
			boid.properties.maxForce = oldMaxForce;
			var r = boid.properties.radius;
			
			if(collision = BWI.getFirstCollisionInFOV(Math.PI*2))
			{
				 if(collision.time>35)
					return $V([0,0]);

				boid.properties.maxForce = 0.1;

				var otherBoid = collision.boid;
				var obPos = otherBoid.state.position;
				var obVel = collision.boid.state.velocity;
				var collisionPos = pos.add(vel.x(collision.time));
				var fromCP = pos.subtract(collisionPos);

				// DRAW.circleOutline(DRAW.c, collisionPos, 10);

				var force= $V([0,0]);

				var cross = vel.cross2D(obVel);

				if(vel.dot(obVel)<0 ){

					var probe2 = $LS(pos, pos.add(vel.scale(boid.properties.radius*4)));
					var probe = $LS(pos, pos.add(vel.getCWPerp2D().scale(boid.properties.radius*4)));
					var toOther = obPos.subtract(pos);
					force = vel.getCWPerp2D();

					// DRAW.c.fillStyle = 'red';
					// DRAW.point(DRAW.c, probe.B );
					// DRAW.lineSegments(DRAW.c, [probe, probe2]);

					//TODO proveriti dali komsija moze da skrene desno, ako nemoze treba skrenuti levo
					if(!isRightClear(boid, boid.properties.radius*4)){

						if(collisionPos.distanceFrom(obPos)<r){
							force = vel.scale(-10);
						}else if(pos.distanceFrom(obPos)<r){

						}else
							force = vel.x(-1);

						if(!isRightClear(otherBoid, r*4)){
							force = vel.scale(-10);
						}
					}

				}else
				{

					if(!boid.isInFrontOf(collision.boid)){

						force = vel.x(-1);
						var dist = boid.distanceTo(collision.boid);

						if(dist>10){
							force = vel.getCWPerp2D().scale(boid.properties.maxForce*10/dist);

							if(boid.precedence > 0.5)
								force = force.x(-1);
						}

						// DRAW.c.fillStyle = 'red';
						// DRAW.point(DRAW.c, avgPos);
					}

					// var avgVelDir = vel.add(obVel).x(0.5);
					// var avgPos = pos.add(obPos).x(0.5);
					// var avpToPos = pos.subtract(avgPos);
					//
					// if(avgVelDir.dot(avpToPos)<0){
					// 	var toOther = obPos.subtract(pos);
					//
					//
					//
					//
					//
					// }
				}

				return force;
			}
			


			return $V([0,0]);
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

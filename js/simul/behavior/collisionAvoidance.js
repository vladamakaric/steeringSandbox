var BEHAVIOR = (function(interf){
	interf.CollisionAvoidance = function(boid){

		var that = {};

		var oldMaxForce;

		that.getSteeringForce = function(boid, BWI){

			if(boid.precedence == undefined)
				boid.precedence = Math.random();

			if(Math.random()>0.999)
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
				boid.properties.maxForce = 0.3;

				var otherBoid = collision.boid;
				var obPos = otherBoid.state.position;
				var obVel = collision.boid.state.velocity;
				var collisionPos = pos.add(vel.x(collision.time));
				var fromCP = pos.subtract(collisionPos);

				DRAW.circleOutline(DRAW.c, collisionPos, 10);

				var force= $V([0,0]);

				var cross = vel.cross2D(obVel);

				console.log(collision.time);


				if(collision.time < 2)
				{
					var fromOther = pos.subtract(obPos);
					boid.state.velocity = $V([0,0]);
					force = fromOther.scale(10);
				}
				else
				if(vel.dot(obVel)<0){

					var probe2 = $LS(pos, pos.add(vel.scale(boid.properties.radius*4)));
					var probe = $LS(pos, pos.add(vel.getCWPerp2D().scale(boid.properties.radius*4)));
					var toOther = obPos.subtract(pos);
					force = vel.getCWPerp2D();

					DRAW.c.fillStyle = 'red';
					DRAW.point(DRAW.c, probe.B );
					DRAW.lineSegments(DRAW.c, [probe, probe2]);

					
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
					if(collisionPos.distanceFrom(obPos)<r){
						force = vel.scale(-10);
					}else if(pos.distanceFrom(obPos)<r){


					}else
					if(boid.precedence > otherBoid.precedence){
						force = vel.x(-1);

						DRAW.c.fillStyle = 'green';
						
						DRAW.point(DRAW.c, pos.add(vel.scale(20)) );
					}
					
                    //
                    //
					// var dT = pos.distanceFrom(collisionPos);
					// var dO = otherBoid.state.position.distanceFrom(collisionPos);
                    //
					// var feelerCW = $LS( obPos, obPos.add(obVel.getCWPerp2D().scale(otherBoid.properties.radius*4)));
					// var feelerCCW = $LS( obPos, obPos.add(obVel.getCWPerp2D().scale(-otherBoid.properties.radius*4)));
                    //
					// // if(!BWI.isPathClear(feelerCW)){
                    // //
					// // }else
					// // if(!BWI.isPathClear(feelerCCW)){
                    // //
					// // }else
					// if(cross>0)
					// {
					// 	force = vel.getCWPerp2D().x(-1);
                    //
                    //
					// 		// alert('smor');
					// 		force = $V([0,0]);
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

var BEHAVIOR = (function(interf){
	interf.CollisionAvoidance = function(boid){

		var that = {};

		var oldMaxForce;

		that.getSteeringForce = function(boid, BWI){
			if(!oldMaxForce)
				oldMaxForce = boid.properties.maxForce;

			var vel = boid.state.velocity;
			var pos = boid.state.position;

			var collision;
			boid.properties.maxForce = oldMaxForce;
			
			if(collision = BWI.getFirstCollisionInFOV(Math.PI*2))
			{

				var otherBoid = collision.boid;
				var obPos = otherBoid.state.position;
				boid.properties.maxForce = 0.3;
				var obVel = collision.boid.state.velocity;
				var collisionPos = pos.add(vel.x(collision.time));
				var fromCP = pos.subtract(collisionPos);

				DRAW.circleOutline(DRAW.c, collision.boid.state.position, 20);
				var force= $V([0,0]);

				var cross = vel.cross2D(obVel);
				if(vel.dot(obVel)<0){


					var toOther = obPos.subtract(pos);
					force = vel.getCWPerp2D();
					
					var feelerLS = $LS( pos, pos.add(force.scale(boid.properties.radius*4)));

					if(!BWI.isPathClear(feelerLS)){
						// alert('smor');
						force = vel.x(-1);
					}
				}else
				{

					var dT = pos.distanceFrom(collisionPos);
					var dO = otherBoid.state.position.distanceFrom(collisionPos);

					var feelerCW = $LS( obPos, obPos.add(obVel.getCWPerp2D().scale(otherBoid.properties.radius*4)));
					var feelerCCW = $LS( obPos, obPos.add(obVel.getCWPerp2D().scale(-otherBoid.properties.radius*4)));

					// if(!BWI.isPathClear(feelerCW)){
                    //
					// }else
					// if(!BWI.isPathClear(feelerCCW)){
                    //
					// }else
					if(cross>0)
					{
						force = vel.getCWPerp2D().x(-1);


							// alert('smor');
							force = $V([0,0]);
						
					}
				}


				if(force.length()!=0){





				}
				



				return force.scale(boid.properties.maxForce);
			}

			return $V([0,0]);
		}

		return that;
	}

	return interf;

})(BEHAVIOR || {});

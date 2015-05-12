var SIMUL = (function (interf) {

	interf.BoidConstructor = function(state, properties, behaviors){
		var that = {};
		that.state = state;
		that.properties = properties;
		that.behaviors = behaviors;

		var evadeBehav = null;

		that.update = function(dt, BWI){
			var force = $V([0,0]);
			
			var cpDesc = BWI.getNearestLineSegmentPoint(state.position);

			var worldInfo = {cpDesc:cpDesc};
			
			if(!evadeBehav){
				var pos = state.position;
				var vel = state.velocity;

				var future = vel.scale(properties.radius*2);

				var futureDistR = cpDesc.lineSegment.distanceFrom(pos.add(future));

				// DRAW.point(DRAW.c, pos.add(future));

				if(!BWI.isPathClear($LS(pos,pos.add(future))))
				{
					console.log("obrt!!!");
					evadeBehav = BEHAVIOR.WallRepell(that,cpDesc);
					that.properties.maxForce = 0.3;
				}
			}

			if(evadeBehav)
			{
				force = evadeBehav.getSteeringForce(that);
				if(force === null)
				{
					force = $V([0,0]);
					evadeBehav = null;
					that.properties.maxForce = 0.08;
				}
			}
			else
			behaviors.some(function(bd){
				var steeringForce = bd.behavior.getSteeringForce(that, worldInfo, BWI );

				force = force.add(steeringForce.x(bd.weight));

				  // if(steeringForce.lengthSq() > Sylvester.precision)
				  // 	return true;
			});

			force = force.truncate(properties.maxForce);


			var acc = force.x(properties.invMass);
			var vel = state.velocity;
			var pos = state.position;



			state.velocity = vel.add(acc.x(dt)).truncate(properties.maxSpeed); 

			if(state.velocity.lengthSq()>0.05)
			{
				state.position = pos.add(vel.x(dt));
				state.orientation = Math.atan2(state.velocity.e(2), 
											   state.velocity.e(1));
			}
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

var SIMUL = (function (interf) {
	interf.Boid = function(state, properties, tacticStack){

		var that = {};
		that.state = state;
		that.properties = properties;
		that.tacticStack = tacticStack;

		that.pushTacticOnStack = function(tactic){
			tacticStack.push(tactic);
		}

		that.distanceTo = function(boid){
			return state.position.subtract(boid.state.position).length() - properties.radius - boid.properties.radius;
		}

		that.isInFrontOf = function(boid){
			var vel = boid.state.velocity;
			var pos = boid.state.position;

			var avgVelDir = vel.add(state.velocity).x(0.5);
			var avgPos = pos.add(state.position).x(0.5);
			var avpToPos = pos.subtract(avgPos);

			return avgVelDir.dot(avpToPos)<0;
		}

		that.isObstacleCollisionImminent = function(BWI){
			var pos = state.position;
			var vel = state.velocity;


			if(vel.length()< 0.001)
				return false;

			var future = vel.scale(properties.radius*2);
			return !BWI.isPathClear($LS(pos, pos.add(future)));
		}


		that.update = function(dt, BWI){
			var force = $V([0,0]);
			var currentTactic = tacticStack.last();
			var nextStep = currentTactic.getNextStep(that, BWI);

			while( nextStep.status != TACTIC.IN_PROGRESS ){

				if(nextStep.status == TACTIC.FINISHED)
					tacticStack.pop();
				else if(nextStep.status == TACTIC.OVERRIDE){

					tacticStack.splice(tacticStack.length-2,1);
				}

				currentTactic = tacticStack.last();
				nextStep = currentTactic.getNextStep(that, BWI);
			}

			if(!nextStep.force)
				return;

			force = nextStep.force.truncate(properties.maxForce);

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

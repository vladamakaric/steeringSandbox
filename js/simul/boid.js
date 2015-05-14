var SIMUL = (function (interf) {

	interf.Boid = function(state, properties, tacticStack){
		var that = {};
		that.state = state;
		that.properties = properties;

		that.pushTacticOnStack = function(tactic){
			tacticStack.push(tactic);
		}

		that.isObstacleCollisionImminent = function(BWI){
			var pos = state.position;
			var vel = state.velocity;

			var future = vel.scale(properties.radius*2);
			return !BWI.isPathClear($LS(pos, pos.add(future)));
		}

		that.update = function(dt, BWI){
			var force = $V([0,0]);
			var currentTactic = tacticStack.last();
			var nextStep = tacticStack.last().getNextStep(that, BWI);

			while( nextStep.status != TACTIC.IN_PROGRESS ){

				if(nextStep.status == TACTIC.FINISHED)
					tacticStack.pop();

				currentTactic = tacticStack.last();
				nextStep = currentTactic.getNextStep(that, BWI);
			}

			force = nextStep.force;

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

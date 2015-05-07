var SIMUL = (function (interf) {

	interf.BoidConstructor = function(state, properties, behaviors){
		var that = {};
		that.state = state;
		that.properties = properties;
		that.behaviors = behaviors;

		that.update = function(dt, BWI){
			var force = $V([0,0]);
			
			behaviors.forEach(function(bd){
				var steeringForce = bd.behavior.getSteeringForce(that, BWI);
				force = force.add(steeringForce.x(bd.weight));
			});

			force = force.truncate(properties.maxForce);

			var acc = force.x(properties.invMass);
			var vel = state.velocity;
			var pos = state.position;

			state.velocity = vel.add(acc.x(dt)).truncate(properties.maxSpeed); 
			state.position = pos.add(vel.x(dt));
			state.orientation = Math.atan2(state.velocity.e(2), 
										   state.velocity.e(1));
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

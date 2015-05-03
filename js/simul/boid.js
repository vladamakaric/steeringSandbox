var SIMUL = (function (interf) {

	interf.BoidConstructor = function(state, properties, behaviours){
		var that = {};
		that.state = state;
		that.properties = properties;
		that.behaviours = behaviours;

		that.update = function(dt){
			var force = STEERING.seek(that, $V([400,100]), 50); 

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

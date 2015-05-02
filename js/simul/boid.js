var SIMUL = (function (interf) {

	interf.BoidConstructor = function(state, properties, behaviours){
		var that = {};
		that.state = state;
		that.properties = properties;
		that.behaviours = behaviours;

		that.update = function(dt){

			var maxSpeed = 1;
			var maxForce = 0.02;
			var invMass = 1;

			var vel = state.velocity;
			var pos = state.position;
			var dest = $V([400,100]);
			var destVel = dest.subtract(pos).truncate(maxSpeed);

			var force = destVel.subtract(vel).truncate(maxForce);
			var acc = force.x(invMass);

			state.velocity = vel.add(acc.x(dt)).truncate(maxSpeed); 
			state.position = pos.add(vel.x(dt));
			state.orientation = Math.atan2(state.velocity.e(2), 
										   state.velocity.e(1));
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

var SIMUL = (function (interf) {

	interf.BoidConstructor = function(state, properties, behaviours){
		var that = {};
		that.state = state;
		that.properties = properties;
		that.behaviours = behaviours;

		that.update = function(dt){
			state.position = state.position.add(state.velocity.x(dt));
		}

		return that;
	}

	return interf;
}(SIMUL || {}));

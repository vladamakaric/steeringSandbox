var TACTIC = (function(interf){


	interf.GoToDestinationInFlock = function(path, groupBehavior){

		var that = {};


		// var pathFollowBehav = 
		var bgrps = [

		[
			{behavior: BEHAVIOR.WallAvoid(20,40), weight:40}
		],
		[ 
//
			 {behavior: BEHAVIOR.PathFollow(path, 20, 60), weight: 1}
			// {behavior: BEHAVIOR.Wander(15, 70), weight: 0.5}
		]
		];

		// if(groupBehavior)
		{
			bgrps.splice(1, 0, [
					{behavior: BEHAVIOR.Cohesion(), weight:0.6},
					{behavior: BEHAVIOR.Align(), weight:0.2},
					{behavior: BEHAVIOR.Separation(), weight: 0.05}
					]);
		}

		var pbGroups = TACTIC.PriorityBehaviorGroups(bgrps);

		that.changePath = function(newPath){
			pbGroups.behaviorGroups[1][0].behavior = BEHAVIOR.PathFollow(newPath, 20, 60);
		}

		that.getNextStep = function(boid, BWI){

			if(groupBehavior)
			BWI.neighborBoids.forEach(function(nb){
				DRAW.circleOutline(DRAW.c, nb.state.position, 40);	
			});

			if(boid.isObstacleCollisionImminent(BWI)){
				boid.pushTacticOnStack(TACTIC.CollisionBackOff(boid, BWI));
				return {status: TACTIC.DELEGATE};
			}

			var force = pbGroups.getForce(boid, BWI);

			return {status: TACTIC.IN_PROGRESS, force: force};
		}


		return that;
	}


	return interf;
})(TACTIC || {});

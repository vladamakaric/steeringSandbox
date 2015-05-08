var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var path = [$V([200,100]), $V([300,200]),
			$V([120,500]), $V([500, 500])];

		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([0,1]),
										  orientation: 0}, 
										  {invMass: 1,
										   maxForce: 0.08,
										   maxSpeed: 1.7},
										 [ {behavior: BEHAVIOR.WallAvoidConstructor(BEHAVIOR.FrontLateralProngsGenerator(50,20)), weight: 3},
										   {behavior: BEHAVIOR.PathFollowConstructor(path, 20, 60), weight: 1}]);

		var boids = [boid];
		var trans = $V([40, -16]);
		var lss = [$LS(path[1].add(trans), path[2].add(trans)), $LS(path[2].add(trans), path[3].add(trans))];

		var simulation = SIMUL.SimulationConstructor(boids, lss);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		DRAW.c = c;

		var canvasPointerEvents = CanvPtrEventMngr(canvas);

		canvasPointerEvents.ptrDown = function(pos){
			var V = $V([pos.x, pos.y]);
			simulation.boids[0].state.position = V;
		}


		canvasPointerEvents.ptrMove = function(pos){
			MP = $V([pos.x, pos.y]);
		}

		canvasPointerEvents.attachEvents();

		that.update = function(dt){
			c.clearRect(0,0, canvas.width, canvas.height);	
			c.lineWidth = 2;
			c.strokeStyle = '#ff0000';
			DRAW.lineSegments(c,lss);
			c.lineWidth = 1;
			c.strokeStyle = '#000000';
			simulation.update(dt);
			interf.DRAW.boids(c, simulation.boids, 10);

			DRAW.openPath(c,path);

		}

		return that;
	}

	return interf;
}(UI || {}));

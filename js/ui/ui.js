var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var path = [$V([100,100]), $V([250,200]),
			$V([120,500]), $V([500, 500])];



		
		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([0,1]),
										  orientation: 0}, 
										  {invMass: 1,
										   maxForce: 0.08,
										   maxSpeed: 1.7},
										  [{behavior: BEHAVIOR.PathFollowConstructor(path, 20, 60), weight: 1}]);

		var boids = [boid];
		var lss = VECTOR_UTIL.getLineSegmentsFromVectorArray(path);
		var simulation = SIMUL.SimulationConstructor(boids, lss);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		DRAW.c = c;

		var canvasPointerEvents = CanvPtrEventMngr(canvas);

		// canvasPointerEvents.ptrDown = function(pos){
		// 	var V = $V([pos.x, pos.y]);
		// 	simulation.boids[0].state.position = V;
		// }

		//privremeno, BWI-u je mesto u simulaciji
		var BWI = SIMUL.BoidWorldInfoConstructor(simulation);

		var interPDesc = null;
		canvasPointerEvents.ptrMove = function(pos){
			var V = $V([pos.x, pos.y]);

			var ls = $LS($V([0,0]), V);

			interPDesc = BWI.getNearestLineSegmentIntersection(ls, ls.A);
		}

		canvasPointerEvents.attachEvents();

		that.update = function(dt){
			c.clearRect(0,0, canvas.width, canvas.height);	
			simulation.update(dt);
			interf.DRAW.boids(c, simulation.boids, 10);
			DRAW.openPath(c,path);
			if(interPDesc)
				DRAW.point(c,interPDesc.intersectionPoint);
		}

		return that;
	}

	return interf;
}(UI || {}));

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

		var bp = $V([100,150]);
		var MP = $V([199,199]);
		var interPDesc = null;
		canvasPointerEvents.ptrMove = function(pos){
			MP = $V([pos.x, pos.y]);

			var ls = $LS(bp, MP);

			interPDesc = BWI.getNearestLineSegmentIntersection(ls, ls.A);
		}

		canvasPointerEvents.attachEvents();

		that.update = function(dt){
			c.clearRect(0,0, canvas.width, canvas.height);	
			simulation.update(dt);
			interf.DRAW.boids(c, simulation.boids, 10);

			DRAW.line(c,bp, MP);

			DRAW.openPath(c,path);
			if(interPDesc){



				var ls = interPDesc.lineSegment;
				var pt = interPDesc.intersectionPoint;
				var proj = ls.line.pointClosestTo(MP).to2D();

				var toEndPoint = MP.subtract(proj).toUnitVector();

				var lsDir = MP.subtract(bp);	
				var CW = toEndPoint.cross2D(lsDir);

				var normalSpeedCompSize = lsDir.dot(toEndPoint);
				var steer = lsDir.getCWPerp2D().x(-CW).scale(normalSpeedCompSize);




				
				console.log(CW);
				DRAW.line(c, steer.add(proj), proj);

				DRAW.point(c,proj);
				DRAW.point(c,interPDesc.intersectionPoint);
			}

		}

		return that;
	}

	return interf;
}(UI || {}));

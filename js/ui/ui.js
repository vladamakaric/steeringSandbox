var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};

		var boid = SIMUL.BoidConstructor({position: $V([100,100]),
										  velocity: $V([0,1]),
										  orientation: 0}, 
										  {invMass: 1,
										   maxForce: 0.05,
										   maxSpeed: 1.7},
										  null);

		var boids = [boid];
		var simulation = SIMUL.SimulationConstructor(boids, null);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');


		var canvasPointerEvents = CanvPtrEventMngr(canvas);


		var path = [$V([10,10]), $V([100,100]), $V([150,100]),
			$V([100,300])];

		var pointOnPath = $V([0,0]);
		var advP = $V([10,10]);

		canvasPointerEvents.ptrMove = function(pos){

			var V = $V([pos.x, pos.y]);

			var cindx = PATH.getClosestLSIndx(V, path);

			var closestLS = $LS(path[cindx], path[cindx+1]);

			var locOnCLS = closestLS.pointClosestTo(V);

			var locOnPath = {pos: locOnCLS, lsIndx: cindx};

			var aLocOPath = PATH.advancePathLocation(path, locOnPath, 70);
			advP = aLocOPath.pos;
			
			pointOnPath = locOnPath.pos;

			console.log(PATH.getDistance(V, path));
		}

		canvasPointerEvents.attachEvents();
		////////////////////////////////////




		///////////////////////////////////

		that.update = function(dt){
			simulation.update(dt);
			c.clearRect(0,0, canvas.width, canvas.height);	
			interf.DRAW.boids(c, simulation.boids, 10);

			c.fillStyle = 'red';
			DRAW.point(c, advP);

			c.fillStyle = 'green';
			DRAW.point(c, pointOnPath);
			DRAW.openPath(c,path);
		}

		return that;
	}

	return interf;
}(UI || {}));

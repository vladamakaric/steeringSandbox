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


		var path = [$V([10,10]), $V([100,100]), $V([200,100])];

		var pointOnPath = $V([0,0]);
		var advP = $V([10,10]);

		canvasPointerEvents.ptrMove = function(pos){

			var V = $V([pos.x, pos.y]);
			var dist = PATH.getDistance(V, path, 1);

			var cindx = PATH.getClosestVectorIndx(V, path);
			var locOnPath = PATH.getLocationOnPath(V, path,cindx); 

			var aLocOPath = PATH.advancePathLocation(path, locOnPath, 30);
			advP = aLocOPath.pos;
			
			pointOnPath = locOnPath.pos;
			console.log(locOnPath.pos.e(1) + " " +  locOnPath.pos.e(2) + "ln:" + 
					locOnPath.lsNum);

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

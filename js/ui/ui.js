var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};
		var maps = {};

		var currentMap;

		$('select').on('change', function() {
			mapChanged(this.value);
		});	

		that.update = function(){};

	
		var boidPath = null;
		var endPoint = $V([700,500]);
		var clss = null;
		var lss = null;
		var simulation = null;	

		loadMaps("res/maps.json", function(mapNames, loadedMaps){ 
			maps = loadedMaps;

			populateMapDropDown(mapNames);
			mapChanged(mapNames[0]);

			that.update = update;
		});


		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		DRAW.c = c;

		var canvasPointerEvents = CanvPtrEventMngr(canvas);

		canvasPointerEvents.ptrDown = function(pos){
			var V = $V([pos.x,pos.y]);

			var boid =simulation.boids[0];
			// boid.state.velocity.setElements([0.001,0.001]);
			var newPath = currentMap.getShortestPath(V, boid.state.position );

			if(newPath){

				boidPath = newPath;
				boid.behaviors[0] = {behavior: BEHAVIOR.PathFollowConstructor(boidPath, 10, 40), weight: 1};
			}


			// console.log(V.e(1));
			// simulation.boids[0].state.position = V;
		}

		canvasPointerEvents.ptrMove = function(pos){
		}

		canvasPointerEvents.attachEvents();

		function update(dt){
			c.clearRect(0,0, canvas.width, canvas.height);	
			c.lineWidth = 2;
			c.strokeStyle = '#ff0000';
			DRAW.lineSegments(c,lss);

			c.strokeStyle = '#fff000';
			DRAW.lineSegments(c,clss);

			c.lineWidth = 1;
			c.strokeStyle = '#000000';
			simulation.update(dt);
			interf.DRAW.boids(c, simulation.boids, 10);

			c.strokeStyle = '#00ffff';
			if(boidPath)
				DRAW.openPath(c, boidPath);
		}

		function mapChanged(mapName){
			currentMap = maps[mapName];
			lss = currentMap.getPolygonLineSegments();
			clss = currentMap.getConnectedLineSegments();

			var boidPos = $V([30,30]);

			boidPath =currentMap.getShortestPath(endPoint, boidPos); 

			var boid = SIMUL.BoidConstructor({position: boidPos,
											  velocity: $V([0,1]),
											  orientation: 0}, 
											  {invMass: 1,
											   maxForce: 0.08,
											   maxSpeed: 1.7},
											 [ {behavior: BEHAVIOR.PathFollowConstructor(boidPath, 20, 60), weight: 1}
											   // {behavior: BEHAVIOR.WallAvoidConstructor(BEHAVIOR.FrontLateralProngsGenerator(30,20)), weight: 1}
											   ]);

			var boids = [boid];

			simulation = SIMUL.SimulationConstructor(boids, lss);
		}

		function populateMapDropDown(mapNames){
			var $mapSelect = $("select[name=maps]");

			mapNames.forEach(function(mname){
				$mapSelect.append($('<option>', {"value": mname }).text(mname));
			});
		}

		function loadMaps(mapsFileName, loadedCallback){
			var maps = {};

			$.getJSON(mapsFileName, function(mapnames) {
				var mapNum = mapnames.length;

				mapnames.forEach(function(mapname){


					$.getJSON( "res/" + mapname + ".json", function(mapjson){

						mapNum--;
						maps[mapname] = MAP.Map(mapjson.polygons);

						if(mapNum==0) loadedCallback(mapnames, maps);
					});
				});
			});
		}

		return that;
	}

	return interf;
}(UI || {}));

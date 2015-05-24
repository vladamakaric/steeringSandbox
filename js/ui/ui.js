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

		var moveBoid = false;
		$(document).keydown(function(e){
		if (e.keyCode==90)
			moveBoid=!moveBoid;
		});


		canvasPointerEvents.ptrDown = function(pos){
			var V = $V([pos.x,pos.y]);
			var boid =simulation.boids[0];
			
			boid.state.position = V;
			return;

			var newPath = currentMap.getShortestPath(V, boid.state.position );

			if(newPath){
				boidPath = newPath;
				boid.tacticStack[0].changePath(newPath);
			}
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
			interf.DRAW.boids(c, simulation.boids);

			simulation.update(dt);
			c.strokeStyle = '#00ffff';
			if(boidPath)
				DRAW.openPath(c, boidPath);
		}

		function mapChanged(mapName){

			function addMapBoundaries(){
				var cw = canvas.width;
				var ch = canvas.height;
				var tl = $V([0,0]);
				var tr = $V([cw,0]);
				var br = $V([cw,ch]);
				var bl = $V([0,ch]);
				
				lss.push($LS(tl, tr), $LS(tl, bl), $LS(tr, br), $LS(bl, br));
			}



			currentMap = maps[mapName];
			lss = currentMap.getPolygonLineSegments();
			clss = currentMap.getConnectedLineSegments();

			var boidPos = $V([30,30]);

			boidPath =currentMap.getShortestPath(endPoint, boidPos); 

			var boids = [createBoid( $V([50,50]), true) , createBoid($V([50,100])), createBoid($V([100,50])), 
				createBoid($V([50,200])),
				createBoid($V([50,300])),
				createBoid($V([50,400]))
				];
			addMapBoundaries();
			simulation = SIMUL.Simulation(boids, lss);
		}


		function createBoid(pos, groupBehavior){
			var boid = SIMUL.Boid({position: pos,
											  velocity: $V([Math.random(),Math.random()]),
											  orientation: 0}, 
											  {invMass: 1,
											   maxForce: 0.08,
											   maxSpeed: 1.7,
											   radius: 10,
											  FOVRadius: 100,
											  FOVAngle: Math.PI*0.7},
											 [ 
											 	TACTIC.GoToDestinationInFlock(boidPath, groupBehavior)
											   ]);
			return boid;
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

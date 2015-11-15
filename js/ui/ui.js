var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};
		var maps = {};

		var currentMap;
		var action = "add";

		$('select').on('change', function() {
			mapChanged(this.value);
		});	

		$('#clear').on('click', function() {  
			while (simulation.boids.length) { simulation.boids.pop(); }
		});

		$("input[value="+ action +  "]").prop("checked", true);

		$("input[name='oncl']").change(clickBehaviorChanged);
		that.update = function(){};

	
		var boidPath = null;
		var endPoint = $V([400,500]);
		var clss = null;
		var lss = null;
		var simulation = null;	

		function clickBehaviorChanged(){
			action= $(this).val();
		}

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

			if(action == "delete" && simulation.boids.length){

				var minbd = _.min(simulation.boids, function(bd) { return bd.state.position.distanceSqFrom(V);});

				if(minbd.state.position.distanceFrom(V)<20)
					simulation.removeBoid(minbd);
			}
			$V([30,30])
			if(action == "add"){
				var newBoid = createBoid(V);
				simulation.boids.push(newBoid);
				return;
			}
			
			if(action == "path" && simulation.boids.length){
				var boid =simulation.boids[0];
				var newPath = currentMap.getShortestPath(V, boid.state.position );

				if(newPath){
					boidPath = newPath;
					simulation.boids.forEach(function(bd){
						bd.tacticStack[0].changePath(newPath);
					});
				}
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

			// c.strokeStyle = '#fff000';
			// DRAW.lineSegments(c,clss);

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

			// var boids = [createBoid( $V([50,50]), true) , createBoid($V([50,100])), createBoid($V([100,50])), 
			// 	createBoid($V([50,200])),
			// 	createBoid($V([50,300])),
			// 	createBoid($V([50,400]))
			// 	];
			addMapBoundaries();

			simulation = SIMUL.Simulation([], lss);

			simulation.boids.push(createBoid($V([30,30])));
			simulation.boids.push(createBoid($V([10,50])));
			simulation.boids.push(createBoid($V([80,90])));
			simulation.boids.push(createBoid($V([60,70])));
			simulation.boids.push(createBoid($V([50,100])));
			simulation.boids.push(createBoid($V([60,130])));
			simulation.boids.push(createBoid($V([20,130])));
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
											  FOVAngle: Math.PI*0.9},
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

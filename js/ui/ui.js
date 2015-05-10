var UI = (function (interf) {

	interf.UIConstructor = function(){
		var that = {};
		var maps = {};

		var currentMap;

		$('select').on('change', function() {
			mapChanged(this.value);
		});	

		that.update = function(){};

		// var offsetPaths = null;
		
		var ls1 = $LS($V([100, 90]), $V([200, 90]));
		var ls2 = $LS($V([150, 90]), $V([0,0]));
		var clss = null;
		var lss = null;
		var spath = null;
		loadMaps("res/maps.json", function(mapNames, loadedMaps){ 
			maps = loadedMaps;

			populateMapDropDown(mapNames);
			mapChanged(mapNames[0]);

			that.update = update;
		});

		// var path = [$V([200,100]), $V([300,200]),
		// 	$V([120,500]), $V([500, 500])];
        //
		// var boid = SIMUL.BoidConstructor({position: $V([100,100]),
		// 								  velocity: $V([0,1]),
		// 								  orientation: 0}, 
		// 								  {invMass: 1,
		// 								   maxForce: 0.08,
		// 								   maxSpeed: 1.7},
		// 								 [ {behavior: BEHAVIOR.WallAvoidConstructor(BEHAVIOR.FrontLateralProngsGenerator(50,20)), weight: 3},
		// 								   {behavior: BEHAVIOR.PathFollowConstructor(path, 20, 60), weight: 1}]);
        //
		// var boids = [boid];
		// var trans = $V([40, -16]);
		// var lss = [$LS(path[1].add(trans), path[2].add(trans)), $LS(path[2].add(trans), path[3].add(trans))];
        //
		// var simulation = SIMUL.SimulationConstructor(boids, lss);

		var canvas = document.getElementById("sboxCanv");
		var c = canvas.getContext('2d');

		DRAW.c = c;

		var canvasPointerEvents = CanvPtrEventMngr(canvas);

		canvasPointerEvents.ptrDown = function(pos){
			var V = $V([pos.x,pos.y]);
			spath = currentMap.getShortestPath($V([0,0]),V );
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

			// DRAW.lineSegments(c, [ls1, ls2]);
			// offsetPaths.forEach( function(opath){
            //
			// 	// DRAW.closedPath(c, opath);
            //
            //
			// });


			// c.lineWidth = 1;
			// c.strokeStyle = '#000000';
			// simulation.update(dt);
			// interf.DRAW.boids(c, simulation.boids, 10);

			c.strokeStyle = '#00ffff';
			if(spath)
			DRAW.openPath(c,spath);
		}

		function mapChanged(mapName){
			currentMap = maps[mapName];
			lss = maps[mapName].getLineSegments();
			clss = maps[mapName].getConnectedLineSegments();

			console.log("smor");
			spath = maps[mapName].getShortestPath($V([0,0]), $V([800,600]));

			console.log(spath);
			// console.log(clss);
			// offsetPaths = maps[mapName].getOffsetPaths(20);
			// console.log(offsetPaths);
			// VECTOR_UTIL.getPathOffset(maps[mapName].getPolygons()[0].vertices, 20);
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

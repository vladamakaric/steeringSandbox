var MAP = (function(interf){

	interf = {};

	interf.Map = function(polygons){
		var that = {};
		var lss = getLineSegments(polygons);
		var nodes = constructGraph(polygons);

		console.log(PATH_FINDING.aStar(nodes[0], nodes[nodes.length-1]));
		console.log(nodes[nodes.length-1]);

		that.getConnectedLineSegments = function(){

			var opaths = getOffsetPaths(polygons, 20);

			var nodes = [];

			opaths.forEach(function(opath){
				opath.forEach(function(vec){
					nodes.push(vec);
				});
			});


			var clss = [];

			for(var i=0; i<nodes.length-1; i++){
				for(var j=i+1; j<nodes.length; j++){
					var ls = $LS(nodes[i] , nodes[j]);
					if(!ls.intersectsLineSegments(lss)){
						clss.push(ls);
					}
				}
			}

			return clss;
		}

		function getLineSegments(polygons){

			var lss = [];
			polygons.forEach(function(poly){

				for(var i=0; i<poly.vertices.length; i++){

					var A = poly.vertices[i];
					var B = poly.vertices[(i+1)%poly.vertices.length];
					lss.push($LS($V([A.x, A.y]), $V([B.x, B.y])));
				}
			});


			return lss;
		}
	
		function constructGraph(polygons){
			function createNode(data){
				return {data: data, edges: [], h: 0};
			}

			function createEdge(nodeA, nodeB, cost){
				return {a: nodeA, b: nodeB, cost: cost};
			}


			var opaths = getOffsetPaths(polygons, 20);
			var nodes = [];

			opaths.forEach(function(opath){
				opath.forEach(function(vec){
					nodes.push(createNode(vec));
				});
			});

			var clss = [];

			for(var i=0; i<nodes.length-1; i++){
				for(var j=i+1; j<nodes.length; j++){

					var nodeA = nodes[i]; 
					var nodeB = nodes[j]; 

					var ls = $LS(nodeA.data, nodeB.data);

					if(!ls.intersectsLineSegments(lss)){
						var edge  = createEdge(nodeA, nodeB, ls.length());
						nodeA.edges.push(edge);
						nodeB.edges.push(edge);
					}
				}
			}

			console.log(nodes);
			return nodes;
		}

		that.getPolygons = function(){ return polygons;}

		function getOffsetPaths(polygons, offset){

			var opaths = [];

			polygons.forEach(function(poly){
				opaths.push(VECTOR_UTIL.getPathOffset(poly.vertices, offset));
			});

			return opaths;
		}
		
		that.getLineSegments = function(){
			return lss;
		}


		return that;

	}


	return interf;


})(MAP || {});

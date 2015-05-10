var MAP = (function(interf){

	interf = {};

	interf.Map = function(polygons){
		var that = {};

		var polygonPaths = [];

		polygons.forEach(function(poly){
			var polyPath = [];
			poly.vertices.forEach(function(vertex){
				polyPath.push($V([vertex.x, vertex.y]));
			});
			polygonPaths.push(polyPath);
		});
		
		var polygonOffset = 20;
		var plss = VECTOR_UTIL.getLineSegmentsFromPaths(polygonPaths);
		var obstacleLss = VECTOR_UTIL.getLineSegmentsFromPaths(getOffsetPolyPaths(polygonOffset-1));
		var nodes = constructGraph();
	
		that.getPolygonLineSegments = function(){
			return plss;
		}

		that.getShortestPath = function(vecA, vecB){

			function extractPath(endNode){
				var path = [];
				var node = endNode;
				
				while(node != undefined){
					path.push(node.data);
					node = node.parent;
				}
				return path;
			}

			function removeNodeFromGraph(node){

				function getOtherNodeOnEdge(node, edge){
					return (edge.a == node) ? edge.b : edge.a;
				}

				node.edges.forEach(function(edge){
					removeEdgeFromNode(edge, getOtherNodeOnEdge(node, edge));
				});
			}

			function removeEdgeFromNode(edge, node){
				node.edges.splice(node.edges.indexOf(edge), 1);
			}
					
			function addNodeToGraph(vec){

				var newNode = Node(vec);

				nodes.forEach(function(node){
					connectNodesIfPossible(newNode,node);
				});

				return newNode;
			}

			function clearNodesForPathFinding(){
				nodes.forEach(function(node){
					node.cost = node.status = node.parent =  undefined;
				});
			}

			var startNode = addNodeToGraph(vecA);

			if(!startNode.edges.length)
				return null;

			var endNode = addNodeToGraph(vecB);


			
			connectNodesIfPossible(startNode,endNode);

			var foundPath = PATH_FINDING.aStar(startNode, endNode);

			var path = null;

			if(foundPath){
				 path = extractPath(endNode);
			}

			removeNodeFromGraph(startNode);
			removeNodeFromGraph(endNode);

			clearNodesForPathFinding();
			return path;
		}

		function createEdge(nodeA, nodeB, cost){
			return {a: nodeA, b: nodeB, cost: cost};
		}

		function Node(data){
			return {data: data, edges: [], h: 0};
		}


		function constructGraph(){
			var opaths = getOffsetPolyPaths(polygonOffset);
			var nodes = [];

			opaths.forEach(function(opath){
				opath.forEach(function(vec){
					nodes.push(Node(vec));
				});
			});

			var clss = [];

			for(var i=0; i<nodes.length-1; i++){
				for(var j=i+1; j<nodes.length; j++){
					connectNodesIfPossible(nodes[i], nodes[j]);
				}
			}

			console.log(nodes);
			return nodes;
		}

		function connectNodesIfPossible(nodeA, nodeB){
			var ls = $LS(nodeA.data, nodeB.data);

			if(!ls.intersectsLineSegments(obstacleLss)){
				var edge  = createEdge(nodeA, nodeB, ls.length());
				nodeA.edges.push(edge);
				nodeB.edges.push(edge);
			}
		}

		function getOffsetPolyPaths(offset){
			var opaths = [];

			polygonPaths.forEach(function(path){
				opaths.push(VECTOR_UTIL.getPathOffset(path, offset));
			});

			return opaths;
		}

		that.getConnectedLineSegments = function(){

			var opaths = getOffsetPolyPaths(20);
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
					if(!ls.intersectsLineSegments(obstacleLss)){
						clss.push(ls);
					}
				}
			}

			return clss;
		}

		return that;
	}


	return interf;
})(MAP || {});

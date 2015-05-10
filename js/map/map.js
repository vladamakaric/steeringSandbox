var MAP = (function(interf){

	interf = {};

	interf.Map = function(polygons){
		var that = {};
		var dlss = getLineSegments(polygons);
		var lss = getOffsetLineSegments(polygons);
		var nodes = constructGraph(polygons);
		
		that.getShortestPath = function(vecA, vecB){

			var startNode = addNodeToGraph(vecA);
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


		function extractPath(endNode){

			var path = [];

			var node = endNode;
			
			while(node != undefined){
				path.push(node.data);
				node = node.parent;
			}

			return path;
		}



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

		function getOtherNodeOnEdge(node, edge){
			return (edge.a == node) ? edge.b : edge.a;
		}

		function removeNodeFromGraph(node){
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
	
		function createEdge(nodeA, nodeB, cost){
			return {a: nodeA, b: nodeB, cost: cost};
		}

		function Node(data){
			return {data: data, edges: [], h: 0};
		}

		function getOffsetLineSegments(polygons){

			var olss = [];
			var opaths = getOffsetPaths(polygons, 10);

			opaths.forEach(function(opath){
				for(var i=0; i<opath.length; i++){

					var A = opath[i];
					var B = opath[(i+1)%opath.length];
					olss.push($LS(A, B));
				}
			});

			return olss;
		}

		function constructGraph(polygons){
			var opaths = getOffsetPaths(polygons, 20);
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

			if(!ls.intersectsLineSegments(lss)){
				var edge  = createEdge(nodeA, nodeB, ls.length());
				nodeA.edges.push(edge);
				nodeB.edges.push(edge);
			}
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

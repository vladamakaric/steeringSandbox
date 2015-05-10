var PATH_FINDING = (function(interf){

	interf.aStar= function(startNode, goalNode){

		var NODE_STATUS = {visited: 1, closed: 2};

		function addNeighborNodesToQueue(node, queue){

			function getOtherNodeOnEdge(node, edge){
				return (edge.a == node) ? edge.b : edge.a;
			}

			node.edges.forEach(function(edge){

				var neighbor = getOtherNodeOnEdge(node, edge);

				if(!neighbor.status || neighbor.status === NODE_STATUS.visited){

					if(neighbor.cost === undefined || node.cost + edge.cost < neighbor.cost){
						neighbor.cost = node.cost + edge.cost;
						neighbor.parent = node;
					}

					if(!neighbor.status){
						neighbor.status = NODE_STATUS.visited;
						queue.enqueue(neighbor);
					}
				}
			});
		}

		function getAproxCost(node){
			return node.h + node.cost;
		}

		var open = PriorityQueue(getAproxCost);
		open.enqueue(startNode);

		startNode.cost = 0;

		while(!open.isEmpty()){


			var minCostNode = open.popMin();


			if(minCostNode===goalNode)
				return true;

			minCostNode.status = NODE_STATUS.closed;
			addNeighborNodesToQueue(minCostNode, open);
		}

		return false;
	}

	function PriorityQueue(getPriorityFunc){

		var that = {};

		var array = [];

		that.enqueue = function(obj){
			array.push(obj);
		}

		that.isEmpty = function(){
			return array.length == 0;
		}

		that.popMin = function(){
			var min = Number.MAX_VALUE;
			var minObj;
			var minIndx=-1;
			array.forEach(function(obj,indx){
				var priority = getPriorityFunc(obj); 
				if(priority < min){
					minObj = obj;
					minIndx = indx;
					min = priority;
				}
			});
			array.splice(minIndx, 1);

			return minObj;
		}

		return that;
	}




	return interf;


})(PATH_FINDING || {});

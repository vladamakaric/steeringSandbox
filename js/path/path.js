var PATH = (function(interf){

	interf.getClosestLSIndx = function(V, path){

		var minDist = Number.MAX_VALUE;
		var closestIndx = -1;

		for(var i=1; i<path.length; i++){

			var ls = $LS(path[i-1], path[i]);

			var dist = ls.distanceFrom(V);

			if(dist<=minDist){
				minDist = dist;
				closestIndx = i-1;
			}

		}

		return closestIndx;
	}

	interf.getClosestVectorIndx=function(V, vectors){

		var minIndx = -1;
		var minDistSq = Number.MAX_VALUE;
		vectors.forEach(function(vec,indx){
			var distSq = V.subtract(vec).lengthSq();

			if(	minDistSq >= distSq){ 
				minIndx = indx;
				minDistSq = distSq;
			}
		});

		return minIndx;
	}

	interf.advancePathLocation = function(path, pathLoc, advanceDist){
		var prevLsPoint = path[pathLoc.lsIndx];
		var nextLsPoint = path[pathLoc.lsIndx + 1];

		var distOnLs = prevLsPoint.subtract(pathLoc.pos).length();

		var advanceDir =nextLsPoint.subtract(prevLsPoint); 
		var lsLen = advanceDir.length();

		var lsIndx = pathLoc.lsIndx;

		var advancedPos;


		if(distOnLs + advanceDist>lsLen){

			if(lsIndx==path.length-2){
				advancedPos = path[path.length-1];
			}else {
				lsIndx+=1;

				var nextLsDir = path[lsIndx+1].subtract(nextLsPoint);

				var distOnNewLs = distOnLs + advanceDist - lsLen;

				var nextLsLen = nextLsDir.length();
				var delta = nextLsDir.scale(distOnNewLs).truncate(nextLsLen);

				advancedPos = nextLsPoint.add(delta);
			}

		}else {
			advancedPos = pathLoc.pos.add(advanceDir.scale(advanceDist));
		}

		return { pos: advancedPos, lsIndx: lsIndx};
	}

	function getLineSegmentFromPath(indx, path){
		return $LS(path[indx], path[indx+1]);
	}

	function getNeighborLineSegments(path, indx){
		var indxs = [];

		if(indx>0)
			indxs.push(indx-1);
		
		indxs.push(indx);

		if(indx<path.length -1)
			indxs.push(indx+1);

		var lss = [];
		for(i=1; i<indxs.length; i++){
			lss.push($LS(path[indxs[i-1]], path[indxs[i]]));
		}

		return lss;
	}


	interf.getDistance =  function(V, path){

		var clsIndx = PATH.getClosestLSIndx(V, path);

		var ls = getLineSegmentFromPath(clsIndx, path);

		return ls.distanceFrom(V);
	}

	return interf;
})(PATH || {});

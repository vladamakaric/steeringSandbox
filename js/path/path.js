var PATH = (function(interf){



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

	interf.getLocationOnPath = function(V, path, closestPointIndex){
		
		var neighborLss = getNeighborLineSegments(path, closestPointIndex);

		var firstLsNum = ( closestPointIndex > 0 ) ? 
						 closestPointIndex-1 : closestPointIndex;

		var minDistSq = Number.MAX_VALUE;
		var bestProj = null;
		var minLsNum = -1;

		neighborLss.forEach(function(ls, i){

			var VProj = ls.projectOn(V);

			if(VProj!=null){
			
				var distToProjSq = VProj.subtract(V).lengthSq();

				if(minDistSq > distToProjSq){
					minDist = distToProjSq;
					minLsNum = firstLsNum+i;
					bestProj = VProj;

				}
			}
		});

		if(bestProj){
			return { pos: bestProj, lsNum: minLsNum };
		}

		return { pos: path[closestPointIndex], lsNum: firstLsNum + neighborLss.length-1};
	}

	interf.advancePathLocation = function(path, pathLoc, advanceDist){
		var prevLsPoint = path[pathLoc.lsNum];
		var nextLsPoint = path[pathLoc.lsNum + 1];

		var distOnLs = prevLsPoint.subtract(pathLoc.pos).length();

		var advanceDir =nextLsPoint.subtract(prevLsPoint); 
		var lsLen = advanceDir.length();

		var lsNum = pathLoc.lsNum;

		var advancedPos;


		if(distOnLs + advanceDist>lsLen){

			if(lsNum==path.length-2){
				advancedPos = path[path.length-1];
			}else {
				lsNum+=1;

				var nextLsDir = path[lsNum+1].subtract(nextLsPoint);

				var distOnNewLs = distOnLs + advanceDist - lsLen;

				advancedPos = nextLsPoint.add(nextLsDir.scale(distOnNewLs));
			}

		}else {
			advancedPos = pathLoc.pos.add(advanceDir.scale(advanceDist));
		}

		return { pos: advancedPos, lsNum: lsNum};
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


	interf.getDistance = function(V, path, closestPointIndex){
		var lss = getNeighborLineSegments(path, closestPointIndex);
		var minDist = lss.map(function(ls){ return ls.distanceFrom(V); }).min();   
		return minDist;
	}


	interf.getClosestLineSegment = function(position, path) {
//TODO!!!

		var minIndx = -1;
		var minDist = Number.MAX_VALUE;
		for(i=1; i<path.length; i++){
			var ls = $LS(path[i-1], path[i]);

			var dist = ls.distanceFrom(position);

			if(dist<=minDist){

				// minDist = dist;
				
			}

		}
	}


	return interf;
})(PATH || {});

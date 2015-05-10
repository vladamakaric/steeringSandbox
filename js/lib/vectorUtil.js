var VECTOR_UTIL = (function(interf){

	interf.getPathOffset = function(path, offset){
		var miterLimit = 2;
		var arcTolerance = 0.25;
		var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
		var clPath = [];

		path.forEach(function(vertex){
			clPath.push({X: vertex.e(1), Y:vertex.e(2)});
		});

		co.AddPath(clPath, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
		co.MiterLimit = 3;
		
		var offsetted_paths = new ClipperLib.Paths();
		co.Execute(offsetted_paths, offset);

		return getSylvesterVecsFormBigXYVecs(offsetted_paths[0]);
	}

	interf.getLineSegmentsFromPaths = function(paths){

		var lss = [];
		paths.forEach(function(path){

			for(var i=0; i<path.length; i++){
				var A = path[i];
				var B = path[(i+1)%path.length];
				lss.push($LS(A, B));
			}
		});

		return lss;
	}

	function getSylvesterVecsFormBigXYVecs(bigXYVecs){
		var sylVecs = [];

		bigXYVecs.forEach(function(V){
			sylVecs.push( $V([V.X, V.Y]));
		});

		return sylVecs;
	}
	
	function getSylvesterVecsFormSmallxyVecs(bigXYVecs){
		var sylVecs = [];

		bigXYVecs.forEach(function(V){
			sylVecs.push( $V([V.x, V.y]));
		});

		return sylVecs;
	}

	interf.getLineSegmentsFromVectorArray = function(vecArr){

		lss = [];

		for(var i=1; i<vecArr.length; i++){
			lss.push($LS(vecArr[i-1], vecArr[i]));
		}

		return lss;
	}

	return interf;

})(VECTOR_UTIL || {});

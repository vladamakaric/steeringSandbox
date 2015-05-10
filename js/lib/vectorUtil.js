var VECTOR_UTIL = (function(interf){

	interf.getPathOffset = function(path, offset){
		var miterLimit = 2;
		var arcTolerance = 0.25;
		var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
		var clPath = [];

		path.forEach(function(vertex){
			clPath.push({X: vertex.x, Y:vertex.y});
		});

		co.AddPath(clPath, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
		co.MiterLimit = 3;
		
		var offsetted_paths = new ClipperLib.Paths();
		co.Execute(offsetted_paths, offset);

		return getSylvesterVecsFormBigXYVecs(offsetted_paths[0]);
	}

	function getSylvesterVecsFormBigXYVecs(bigXYVecs){
		var sylVecs = [];

		bigXYVecs.forEach(function(V){
			sylVecs.push( $V([V.X, V.Y]));
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

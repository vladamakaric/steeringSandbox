var VECTOR_UTIL = (function(interf){

	interf.getTimeUntilConstantVelocityMovingBallsCollision = function(params){
		var velAx = params.velA.x;
		var velAy = params.velA.y;
		var velBx = params.velB.x;
		var velBy = params.velB.y;
		var posAx = params.posA.x;
		var posAy = params.posA.y;
		var posBx = params.posB.x;
		var posBy = params.posB.y;

		var rpx = posBx - posAx;
		var rpy = posBy - posAy;

		//velocity of ball B realitve to A
		var rvx = velBx - velAx;
		var rvy = velBy - velAy;

		//radiuses of balls
		var ra = params.rA;
		var rb = params.rB;


		//balls moving apart
		if( rvx*rpx + rvy*rpy >= 0 )
			return -1;

		// ball b trajectory is described by the parametric line:
		// y = rp + t*rv, where rp and rv are relative position and velocity vectors
		// 
		// ball A is fixed at the origin, and t0 is the time until impact,
		// 
		// ||rp + t0*rv|| = ra + rb
		//
		// Whixh yields a quadeatic equation when both sides are squared:
		//
		// a*t0^2 + b*t0 + c = 0

		var a = rvx*rvx + rvy*rvy;
		var b = 2*(rvx*rpx + rvy*rpy);
		var c = rpx*rpx + rpy*rpy - ra*ra - rb*rb - 2*ra*rb;

		var D = b*b - 4*a*c;

		if(D < 0)
			return -1;
		
		var t1 = (-b + Math.sqrt(D))/(2*a);
		var t2 = (-b - Math.sqrt(D))/(2*a);

		return Math.min(t1,t2);
	}

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

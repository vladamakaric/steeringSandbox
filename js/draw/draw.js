var DRAW = (function(interf){

	interf.point = function(c, V){

      c.beginPath();
      c.arc(V.e(1), V.e(2), 3, 0, 2 * Math.PI, false);
      // c.fillStyle = 'green';
      c.fill();
	}

	interf.line = function(c, V1, V2){

		c.beginPath();

		c.moveTo(V1.e(1), V1.e(2));
		c.lineTo(V2.e(1), V2.e(2));
		c.stroke();

	}

	interf.lineSegments = function(c, lss){

      c.beginPath();
	  lss.forEach( function(ls){
		  c.moveTo(ls.A.e(1),ls.A.e(2));
		  c.lineTo(ls.B.e(1),ls.B.e(2));
	  });

      c.stroke();

	}

	interf.closedPath = function(c,path){
		openPath(c,path);
		c.lineTo(path[0].e(1), path[0].e(2));
		c.stroke();
	}

	function openPath(c, path){

      c.beginPath();

	  var func = c.moveTo;
	  path.forEach( function(V, i){
		  func.call(c, V.e(1), V.e(2));
		  func = c.lineTo;
	  });
	}

	interf.openPath = function(c,path){
		openPath(c,path);
      c.stroke();
	}

	return interf;
})(DRAW || {});

var DRAW = (function(interf){

	interf.point = function(c, V){

      c.beginPath();
      c.arc(V.e(1), V.e(2), 3, 0, 2 * Math.PI, false);
      // c.fillStyle = 'green';
      c.fill();
	}

	interf.openPath = function(c,path){
      c.beginPath();

	  var func = c.moveTo;
	  path.forEach( function(V, i){
		  func.call(c, V.e(1), V.e(2));
		  func = c.lineTo;
	  });

      c.stroke();
	}

	return interf;
})(DRAW || {});

var DRAW = (function(interf){


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

var VECTOR_UTIL = (function(interf){


	interf.getLineSegmentsFromVectorArray = function(vecArr){

		lss = [];

		for(var i=1; i<vecArr.length; i++){
			lss.push($LS(vecArr[i-1], vecArr[i]));
		}


		return lss;
	}


	return interf;

})(VECTOR_UTIL || {});

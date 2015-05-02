var UI = (function (interf) {



	interf.DRAW = {
	boids: function(c, boids, r){
		function drawBoid(boid){
		  c.beginPath();
		  var x = boid.state.position.e(1);
		  var y = boid.state.position.e(2);
		  c.arc(x, y, r, 0, 2 * Math.PI, false);
		  c.fillStyle = 'green';
		  c.fill();
		}

		boids.forEach(drawBoid);
	}};

	return interf;
}(UI || {}));

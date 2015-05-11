var UI = (function (interf) {



	interf.DRAW = {
	boids: function(c, boids){
		function drawBoid(boid){
		  c.beginPath();
		  var x = boid.state.position.e(1);
		  var y = boid.state.position.e(2);
		  var r = boid.properties.radius;
		  c.arc(x, y, r, 0, 2 * Math.PI, false);
		  c.fillStyle = 'green';
		  c.fill();

		  c.save();
			  c.translate(x,y); 
			  c.rotate(boid.state.orientation); 
			  c.fillStyle = 'yellow';
			  var angDiff = 2*Math.PI/3;
			  c.beginPath();
			  c.moveTo(r, 0);
			  c.lineTo(r*Math.cos(angDiff),r*Math.sin(angDiff));
			  c.lineTo(r*Math.cos(2*angDiff),r*Math.sin(2*angDiff));
			  c.fill();
		  c.restore();
		}

		boids.forEach(drawBoid);
	}};

	return interf;
}(UI || {}));

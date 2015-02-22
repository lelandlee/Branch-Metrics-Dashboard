var dataSet2 = [];
var i = 0
while( i < 25){
	dataSet2.push(Math.floor(Math.random() * 20) + 5)
	i++
}

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var divH = parseInt( d3.select("#chart2").style("height") );
var divW = parseInt( d3.select("#chart2").style("width") );
var w = divW - margin.left - margin.right;
	h = divH - margin.top - margin.bottom;
	barPadding = 1;

var svg = d3.select("#chart2").append("svg")
	.attr({
		width: w + margin.left + margin.right,
		height: h + margin.top + margin.bottom
	})
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.ordinal()
	.domain(d3.range(dataSet2.length))
	.rangeRoundBands([0, w], 0.05);

var yScale = d3.scale.linear()
	.domain([0, d3.max(dataSet2)])
	.range([0, h]);

function colorChart2(d){ return "rgb(150," + (d * 5+100) + "," + (200-d * 5) + ")"; };

svg.selectAll("rect")
	.data(dataSet2)
	.enter()
	.append("rect")
	.attr({
		x: function(d, i) { return xScale(i); },
		y: function(d) { return h - yScale(d); },
		width: xScale.rangeBand(),
		height: function(d){ return yScale(d); },
		fill: function(d){ return colorChart2(d); }
	})
	.on("mouseover", function(d){
		d3.select(this)
			.style("fill", "orange")
	})
	.on("mouseout", function(d){
		d3.select(this)
			.transition()
			.duration(250)
			.style("fill", function(d){ return colorChart2(d); })
	});

svg.selectAll("text.valueTop") // top
	.data(dataSet2)
	.enter()
	.append("text")
	.text(function(d) { return d; })
	.attr({
		"class": "valueTop",
		x: function(d,i) { return xScale(i) + xScale.rangeBand() / 2 },
		y: function(d) { return h - yScale(d) + 14; },
	});


//animation
var animateTime = 1000;
var pauseTime = 1000;
	setInterval(function() { 
		animateGraph();
	 }, animateTime + pauseTime);

d3.select("#button").on("click", function() {	animateGraph(); });

function animateGraph(){
	//New values for dataset
	var numValues = dataSet2.length;
  dataSet2 = [];
  var maxValue = 25;

  for (var i = 0; i < numValues; i++) {
  	var newNumber1= Math.ceil(Math.random() * maxValue);
  	dataSet2.push(newNumber1);
  }

  //update scale domain
  yScale.domain([0, d3.max(dataSet2)]);

	svg.selectAll("text.valueTop") // top
		.data(dataSet2)
		.transition()
		//.delay(function(d, i) { return i / dataSet2.length * 1000; })
		.duration(animateTime)
		.ease("linear")
		.text(function(d) { return d; })
		.attr({
			"class": "valueTop",
			x: function(d,i) { return xScale(i) + xScale.rangeBand() / 2 },
			y: function(d) { return h - yScale(d) + 14; },
		});
	svg.selectAll("rect")
		.data(dataSet2)
		.transition()
		.duration(animateTime)
		.ease("linear")
		.attr({
			x: function(d, i) { return xScale(i); },
			y: function(d) { return h - yScale(d); },//set pos at top right of bar
			width: xScale.rangeBand(),
			height: function(d){ return yScale(d); },
			fill: function(d){ return colorChart2(d); }
		})
}
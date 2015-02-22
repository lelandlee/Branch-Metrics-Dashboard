var divH = parseInt( d3.select("#pie1").style("height") );
var divW = parseInt( d3.select("#pie1").style("width") );

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var w = divW - margin.left - margin.right;
	h = divH - margin.top - margin.bottom;
  x = d3.scale.ordinal().domain(d3.range(3)).rangePoints([0, w], 2);

var fields = [//left
  {name: "secondsL", value: 35, size: 60, order: 0},
  {name: "minutesL", value: 45, size: 60, order: 1},
  {name: "hoursL", value: 20, size: 24, order: 2},
  //right
  {name: "secondsR", value: -35, size: 60, order: 0},
  {name: "minutesR", value: -45, size: 60, order: 1},
  {name: "hoursR", value: -20, size: 24, order: 2}
];
var outerRadiusInit = w / 2.2;
var arcWidth = w / 12;
var innerRadiusInit = outerRadiusInit - arcWidth;

var arc = d3.svg.arc()
    .innerRadius(function(d) { return innerRadiusInit - d.order * arcWidth ; })
    .outerRadius(function(d) { return outerRadiusInit - d.order * arcWidth ; })
    .startAngle(Math.PI)
    .endAngle(function(d) { return (d.value / d.size) * Math.PI + Math.PI; });//starts chart at 6 O'Clock position

var svg = d3.select("#pie1").append("svg:svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," +(margin.top + h/2)+ ")");

for(var i = 0; i < fields.length; i++)
  fields[i].previous = fields[i].value;

var path = svg.selectAll("path.pie1")
    .data(fields.filter(function(d) { return d.value; }), function(d){return d.name; })
  .enter().append("svg:path")
    .attr("class", "pie1")
    .attr("transform", function(d, i) { return "translate(" + h/2 + ",0)"; })
    //how to make mouseover work?
    .on("mouseover", function(d){
			d3.select(this)
				.style("fill", "lightblue")

			//tooltip
			var x_pos = event.clientX;
			var y_pos = event.clientY;
			d3.select("#tooltip")
			  .style("left", x_pos + "px")
			  .style("top", y_pos + "px")
			  .select("#value")
			  .text(Math.abs(d.value/d.size*100));
			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function(d){
			d3.select(this)
				.transition()
				.duration(250)
				.style("fill", "gold")
			//hide tooltip
			d3.select("#tooltip").classed("hidden", true);
		})
  .transition()
    .attrTween("d", arcTween);

function arcTween(b) {
  var i = d3.interpolate({value: b.previous}, b);
  return function(t) {
    return arc(i(t));
  };
}


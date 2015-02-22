d3.csv("1424546120973-links.csv", function(data) {
	var pie_arr = []
	for(var x in data)
		pie_arr.push(data[x]['channel'].toLowerCase());

	//this array is used to aggregate data later
	var pie_extra_data = []
	for(var x in data){
		pie_extra_data.push({
			id: data[x]['id'],
			channel: data[x]['channel'],
			clicks: data[x]['clicks'],
			installs: data[x]['installs']
		})
	}

	var obj_Pie2 = { };
	for (var i = 0, j = pie_arr.length; i < j; i++) {
	  obj_Pie2[pie_arr[i]] = (obj_Pie2[pie_arr[i]] || 0) + 1;
	}
	new_Pie2 = [];
	for(key in obj_Pie2){
		new_Pie2.push({
			channel: key,
			value: obj_Pie2[key]
		})
	}

	console.log(new_Pie2);
	draw_pie2(new_Pie2, pie_extra_data);
});

function draw_pie2(dataPie2, pie_extra_data){
	var divH = parseInt( d3.select("#pie2").style("height") );
	var divW = parseInt( d3.select("#pie2").style("width") );

	var margin = {top: 10, right: 10, bottom: 10, left: 10};
	var minDim = Math.min(divW, divH)
	var w = minDim - margin.left - margin.right;
		h = minDim - margin.top - margin.bottom;
	  x = d3.scale.ordinal().domain(d3.range(3)).rangePoints([0, w], 2);

	//interesting to note although pieces of pie are autonamtically organised by size, it does not change the position within the array
	var sum = 0;
	for (var property in dataPie2) {
	  sum += dataPie2[property].value;
	}
	//generate color scheme
	var colors = d3.scale.linear()
			.domain([d3.min(dataPie2, function(d){return d.value}), .5 * (d3.min(dataPie2, function(d){return d.value}) + d3.mean(dataPie2, function(d){return d.value})), d3.mean(dataPie2, function(d){return d.value}), .5 * (d3.max(dataPie2, function(d){return d.value}) + d3.mean(dataPie2, function(d){return d.value})), d3.max(dataPie2, function(d){return d.value})])
			.range(["#EA6045", "#F8CA4D", "#F5E5C0", "#3F5666", "#2F3440"]);
	var outerRadius = w / 2.2;
			arcWidth = w / 12;
	    innerRadius = outerRadius/1.5 - arcWidth;
	    cornerRadius = 20;

	var pie = d3.layout.pie()
			.value(function(d) { return d.value; })//to access contents of obj
	    .padAngle(.015);

	var arc = d3.svg.arc()
	    .padRadius(outerRadius)
	    .innerRadius(innerRadius);

	var svg = d3.select("#pie2").append("svg")
	    .attr("width", w)
	    .attr("height", h + 50)//to prevent cut off when gets larger
	  .append("g")
	    .attr("transform", "translate(" + w / 2 + "," + (h) / 2 + ")");

	svg.append("text")
		.attr("id", "title_pie2")
		.attr("text-anchor", "middle")
		.attr("transform","translate(" + innerRadius/6 + "," + (-innerRadius/6) + ")");
	d3.select('#title_pie2').html("Sources of Links");
	svg.append("text")
		.attr("id", "valueOutput")
		.attr("text-anchor", "middle")
		.attr("transform","translate(" + innerRadius/8 + "," + innerRadius/6 + ")");
	d3.select('#valueOutput').html("Property: Value");

	svg.selectAll("path.pie2")
	    .data(pie(dataPie2))
	  .enter().append("path")
	    .each(function(d) { d.outerRadius = outerRadius - 10; })
	    .attr("d", arc)
	    .attr("class", "pie2")
	    .attr("fill", function(d){return colors(d.value)})
	    .on("mouseover.value", function(d) {
	      d3.select("#valueOutput").html(d.data.channel + " : " + parseInt(d.value/sum*100) + "%");
	      //how to get this to run??? [it's a function], same problem as above
	      arcTween(outerRadius + 25, 0);
	    })
	    .on("mouseover.lol", arcTween(outerRadius + 25, 0))
	//make chart, that equal sizes, but distance sticking out determines value
	    .on("click", function(d){
	    	clearTable()
	    	for(x in pie_extra_data){
	    		if(pie_extra_data[x].channel.toLowerCase() == d.data.channel){
	    			//console.log(pie_extra_data[x].clicks + " : " + pie_extra_data[x].installs)
	    			// console.log(pie_extra_data[x].id);

	    			updateTable([
	    				pie_extra_data[x].id,
	    				pie_extra_data[x].clicks,
	    				pie_extra_data[x].installs
	    			]);
	    		}
	    	}
	    })
	    .on("mouseout", arcTween(outerRadius - 10, 150));

	//returns a function
	function arcTween(outerRadius, delay) {
	  return function() {
	    d3.select(this).transition().delay(delay).attrTween("d", function(d) {
	      var i = d3.interpolate(d.outerRadius, outerRadius);
	      return function(t) { d.outerRadius = i(t); return arc(d); };
	    });
	  };
	}

	function clearTable(){
		$("#data-table td").remove();
	}
	function updateTable(data) {
    var table = document.getElementById("data-table");
    var num_rows = table.rows.length
    var row = table.insertRow(num_rows);
    for(var i = 0; i < data.length; i++){
    	var cell = row.insertCell(i);
	    cell.innerHTML = data[i];
    }
    var cell = row.insertCell(3);
	   cell.innerHTML = (data[1]) == 0 ? "0.0%" : (data[2]/data[1]*100).toFixed(1) + "%";
	}
}
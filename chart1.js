var dataSet1 = [];

d3.csv("1424546120973-links.csv", function(error, data) {
	if(error)
		console.log(error);

	for(var i in data){
		//console.log(data[i]['clicks'] + " : " + data[i]['installs']);
		dataSet1.push({
			clicks: data[i]['clicks'], 
			installs: data[i]['installs']
		})
	}
	visualize(data);
});

function visualize(data){
	$(function () {
		var formatted = [];
		data.forEach(function(d){ 
			formatted.push({
				installs: parseInt(d.installs) + .01,
				clicks: parseInt(d.clicks) + .01
			}); 
		})
		//sorting though the array
		formatted.sort(function(a,b) {
		   return a.clicks - b.clicks;
		});

		var clicks = [];
		var installs = [];
		formatted.forEach(function(d){ clicks.push(d.clicks); });
		formatted.forEach(function(d){ installs.push(d.installs); });


    $('#chart1').highcharts({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Comparison of Clicks vs Installs'
      },
      subtitle: {
        text: 'Branch Metrics, notes all values are boosted by .01'
      },
      yAxis: {
        title: {
          text: 'Actions, logarithmic axis'
        },
        type: 'logarithmic',
        minorTickInterval: 0.1
      },
      tooltip: {
      	pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: [{
        name: 'clicks',
        data: clicks
    	}, {
        name: 'installs',
        data: installs
      }]
    });
	});
}
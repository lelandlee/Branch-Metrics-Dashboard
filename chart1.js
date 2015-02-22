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
      colors:
        ["#3F5666", "#EA6045"],
      chart: {
        type: 'line',
        style: {
          font: 'normal 16px "Source Sans Pro", "Helvetica Neue", Verdana, sans-serif'
        }
      },
      title: {
        text: 'Comparison of Clicks vs Installs',
        style: {
          font: 'bold 1.5rem "Source Sans Pro", "Helvetica Neue", Verdana, sans-serif'
        }
      },
      subtitle: {
        text: 'Branch Metrics, notes all values are boosted by .01',
        style: {
          font: 'normal 16px "Source Sans Pro", "Helvetica Neue", Verdana, sans-serif'
        }
      },
      yAxis: {
        title: {
          text: 'Actions, logarithmic axis',
          style: {
            font: 'normal 16px "Source Sans Pro", "Helvetica Neue", Verdana, sans-serif'
          }
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
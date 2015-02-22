var myLatlng = new google.maps.LatLng(30.6586, -50.3568);
// map options
var myOptions = {
    zoom: 2,
    center: myLatlng
};
//map style
var myStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];
// standard map
map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
map.setOptions({
    styles: myStyle
});
var gradient = function() {
    var args = arguments;
    g = []
    for (var a = 0; a < args.length - 1; a++) {
        for (var x = args[a][1]; x <= args[a + 1][1]; x += .005) {
            fm = Math.abs(args[a + 1][1] - x + args[a][1]) / args[a + 1][1];
            sm = Math.abs(args[a][1] - x) / args[a + 1][1];
            var gradient_string = "rgba(" + parseInt(fm * args[a][0][0] + sm * args[a + 1][0][0]) + ", " + parseInt(fm * args[a][0][1] + sm * args[a + 1][0][1]) + ", " + parseInt(fm * args[a][0][2] + sm * args[a + 1][0][2]) + ", " + (fm * args[a][0][3] + sm * args[a + 1][0][3]) + ")";
            g.push(gradient_string);
        }
    }
    var last = "rgba(" + args[args.length - 1][0][0] + ", " + args[args.length - 1][0][1] + ", " + args[args.length - 1][0][2] + ", " + args[args.length - 1][0][3] + ")";
    g.push(last);
    return g
}
$.getJSON("locations_norobots.json", function(data) {
    heatmapData = [];
    for (var d = 0; d < data.ip.length; d++) {
        var x = new google.maps.LatLng(data.long[d], data.lat[d]);
        heatmapData.push(x);
    }
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        opacity: 1,
        dissipate: false,
        gradient: gradient(
          [[47, 52, 64, 0.0], 0.0],
          [[63, 86, 102, 0.4], 0.005],
          [[234, 96, 69, 0.6], 0.015],
          [[248, 202, 77, 0.9], 0.6],
          [[245, 229, 192, 1], 1]
        ),
        radius: 15
    });
    heatmap.setMap(map);
    var markers = [];
    for (var d = 0; d < heatmapData.length; d++) {
        //initialize infowindow
        var infowindow = new google.maps.InfoWindow({
            content: data.city[d] + ", " + data.country[d] + "<br />IP: " + data.ip[d] + "<br />OS: " + data.os[d]
        });
        var options = {
            position: heatmapData[d],
            map: map,
            icon: "./img/transparent.png",
            infowindow: infowindow
        };
        var marker = new google.maps.Marker(options);
        google.maps.event.addListener(marker, "mouseover", function() {
            this.infowindow.open(map, this);
        });
        google.maps.event.addListener(marker, "mouseout", function() {
            this.infowindow.close();
        });
        markers.push(marker);
    }
});
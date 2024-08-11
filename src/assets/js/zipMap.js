 google.load('visualization', '1', {'packages':['corechart', 'table', 'geomap']});
var map;
var labels = [];
var layer;
var tableid =  1499916;
var style = [];
/*var styles: [{
      polygonOptions: {
        fillColor: '#ffffff',
        fillOpacity: 0.1,
      }
    }, {
      where: 'ZIP = 11211',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.806,
      }
    }, {
      where: 'ZIP = 10456',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.706,
      }
    }, {
      where: 'ZIP = 10451',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.606,
      }
    }, {
      where: 'ZIP = 11207',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.506,
      }
    }, {
      where: 'ZIP = 10455',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.406,
      }
    }, {
      where: 'ZIP = 10468',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.306,
      }
    }, {
      where: 'ZIP = 11236',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.206,
      }
    }, {
      where: 'ZIP = 11221',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.106,
      }
    }, {
      where: 'ZIP = 10458',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 1,
      }
    }, {
      where: 'ZIP = 10024',
      polygonOptions: {
        fillColor: '#0056b3',
		fillOpacity: 0.806,
      }
    }, ]*/
	//console.log(styles);
function initialize() {
	//console.log(JSON.parse(localStorage.getItem('zipValues')));
	 style = JSON.parse(localStorage.getItem('zipValues'));
	 if(!style){
		return;
	 }
    geocoder = new google.maps.Geocoder();
  	map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(40.778259, -73.958092),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  var layer = new google.maps.FusionTablesLayer({
    query: {
      select: 'geometry',
      from: tableid
    },
    styles: style
  });
 // layer = new google.maps.FusionTablesLayer(tableid);
  //layer.setQuery("SELECT 'geometry' FROM " + tableid);
  //layer.set('styles', styles);
  layer.setMap(map);
  
  
  //console.log.log(layer);
  //codeAddress();
  
  google.maps.event.addListener(map, "bounds_changed", function() {
    displayZips();
  });
  google.maps.event.addListener(map, "zoom_changed", function() {
    if (map.getZoom() < 11) {
      for (var i=0; i<labels.length; i++) {
        labels[i].setMap(null);
      }
    }
  });
}

function codeAddress() {
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map, 
            position: results[0].geometry.location
        });
        if (results[0].geometry.viewport) 
          map.fitBounds(results[0].geometry.viewport);
      } else {
        alert("Zip Code Not Found");
      }
    });
  }
  		
function displayZips() {
  //set the query using the current bounds
  var queryStr = "SELECT geometry, ZIP, latitude, longitude FROM "+ tableid + " WHERE ST_INTERSECTS(geometry, RECTANGLE(LATLNG"+map.getBounds().getSouthWest()+",LATLNG"+map.getBounds().getNorthEast()+"))";   
  var queryText = encodeURIComponent(queryStr);
  //console.log(queryText);
  var query = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq='  + queryText);
  // alert(queryStr);

  //set the callback function
  query.send(displayZipText);

}
 

  var infowindow = new google.maps.InfoWindow();
		
function displayZipText(response) {
if (!response) {
  //console.log.log('no response');
  return;
}
if (response.isError()) {
  //console.log.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  return;
} 
  if (map.getZoom() < 11) return;
  FTresponse = response;
  //for more information on the response object, see the documentation
  //http://code.google.com/apis/visualization/documentation/reference.html#QueryResponse
  numRows = response.getDataTable().getNumberOfRows();
  numCols = response.getDataTable().getNumberOfColumns();
/*  var queryStr = "SELECT geometry, ZIP, latitude, longitude FROM "+ tableid + " WHERE ST_INTERSECTS(geometry, RECTANGLE(LATLNG"+map.getBounds().getSouthWest()+",LATLNG"+map.getBounds().getNorthEast()+"))";   
*/
  /*
     var kml =  FTresponse.getDataTable().getValue(0,0);
     // create a geoXml3 parser for the click handlers
     var geoXml = new geoXML3.parser({
                    map: map,
		    zoom: false
                });

     geoXml.parseKmlString("<Placemark>"+kml+"</Placemark>");
     geoXml.docs[0].gpolygons[0].setMap(null);
     map.fitBounds(geoXml.docs[0].gpolygons[0].bounds);
  */
  // alert(numRows);
  // var bounds = new google.maps.LatLngBounds();
  for(i = 0; i < numRows; i++) {
      var zip = response.getDataTable().getValue(i, 1);
      var zipStr = zip.toString()
      while (zipStr.length < 5) { zipStr = '0' + zipStr; }
      var point = new google.maps.LatLng(
          parseFloat(response.getDataTable().getValue(i, 2)),
          parseFloat(response.getDataTable().getValue(i, 3)));
      // bounds.extend(point);
      labels.push(new InfoBox({
	 content: zipStr
	,boxStyle: {
	   border: "1px solid black"
	  ,textAlign: "center"
	  ,fontSize: "8pt"
	  ,width: "50px"
	 }
	,disableAutoPan: true
	,pixelOffset: new google.maps.Size(-25, 0)
	,position: point
	,closeBoxURL: ""
	,isHidden: false
	,enableEventPropagation: true
      }));
      labels[labels.length-1].open(map);
  }
  // zoom to the bounds
  // map.fitBounds(bounds);
}
google.maps.event.addDomListener(window,'load',initialize);

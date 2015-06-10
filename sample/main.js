// Copyright 2015 - VIMOC Technologies - All Rights Reserved

function getRandom() {
  return Math.random()*0.0008  ;
}

var signLat = 1 ;
var signLong = 1 ;
if (Math.random()<0.5) signLat = -1 ;
if (Math.random()<0.5) signLong = -1 ;

// near downtown palo alto
var lat = 37.4471+(getRandom()*signLat) ; 
var long = -122.161+(getRandom()*signLong) ;

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};


function closestZone(lat,long) {
    var zoneLocations = [
            { guid: "pa_1",   lat:  37.444767, long: -122.159884 },
            { guid: "pa_2",   lat:  37.444936, long: -122.161510 },
            //{ guid: "pa_3",   lat:  37.444766, long: -122.160685 },
            { guid: "lg_1",   lat:  37.221624, long: -121.984504 },
            { guid: "lg_2",   lat:  37.220523, long: -121.985090 },
            { guid: "lg_3",   lat:  37.221019, long: -121.984095 },
            { guid: "lg_4",   lat:  37.221856, long: -121.983472 },
            { guid: "newc_1", lat: -32.931516, long:  151.770900 },
            { guid: "newc_2", lat: -32.931193, long:  151.771928 }
        ] ;
    
    //How close you need to be to use the ParkMe! function
    
    var range = 0.005 ; 
     
    var minDistance = 1 ;
    var cz = null ;
    for (var i = 0 ; i < zoneLocations.length ; i++) {
        var zone = zoneLocations[i] ;
        if (Math.abs(zone.lat - lat)<range) {
            if (Math.abs(zone.long - long)<range) {
                //zone is range
                var distanceToZone = Math.pow(zone.lat - lat,2) + Math.pow(zone.long - long,2) ;
                
                if (distanceToZone <= minDistance) {
                    minDistance = distanceToZone ;
                    cz = zone ;
                    console.log('[TRACE] Found closest zone')
                    //console.log(cz) ;
                }
            }
        }
        }

    return cz ;
}

function success(pos) {
  var crd = pos.coords;

//   console.log('Your current position is:');
//   console.log('Latitude : ' + crd.latitude);
//   console.log('Longitude: ' + crd.longitude);
//   console.log('More or less ' + crd.accuracy + ' meters.');
  console.log('[TRACE] found user location')
  
// lat= crd.latitude ;
// long= crd.longitude ;
  
  var cz = closestZone(lat,long) ;
  
  if (cz === null) {
      //You are not close enough
      $('#map-canvas').prepend('<img id="center" src="oops.png" />') ;
      console.log('[TRACE] user is not close enought ('+lat+','+long+')') ;

  } else {
      var latCenter = (lat+cz.lat)/2.0 ; 
      var longCenter = (long+cz.long)/2.0 ;

      React.render(
        <ZoneView
            zone={cz.guid}
            lat={lat}
            long={long}
            latCenter={latCenter}
            longCenter={longCenter}
        />,
        document.getElementById('map-canvas')
      );   
  }
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

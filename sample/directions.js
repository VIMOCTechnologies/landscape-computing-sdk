
// Copyright 2015 - VIMOC Technologies - All Rights Reserved



var Directions = React.createClass({

    propTypes: {
        //Request
        latitude: React.PropTypes.number.isRequired,
        longitude: React.PropTypes.number.isRequired,
        zoom: React.PropTypes.number
        
    },
    
    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  



    getDefaultProps: function() {
        return {
            latitude: 37.444878,
            longitude:-122.159993,
            zoom: 10,
            mapType: 'sat',
            width: '100%',
            height: '100%',
            markers: [],
            polygons: [],
            apiKey: 'AIzaSyA1e4W1FUqy-WxLka-CE6mbYObz5c4BT7U',
            useSensor: true,
            
            //const
            mapTypeValues: {
                'road': google.maps.MapTypeId.ROADMAP,
                'satellite': google.maps.MapTypeId.SATELLITE,
                'sat': google.maps.MapTypeId.SATELLITE,
                'terrain': google.maps.MapTypeId.TERRAIN,
                'hybrid': google.maps.MapTypeId.HYBRID
            }
        }
    },

    getInitialState: function() {
      return {
        zone: null,
        map : null,
        markers : [],
        polygons: [],
        initialized: false
      };
    },

    updateOptions: function(props) {
        this.trace('updatingOptions') ;
        
        var map = this.state.map;

        if(map === null) { return false; }
        map.setOptions( {
             center: new google.maps.LatLng( props.latitude , props.longitude )
        }) ;
        
        this.setState( { map : map });
    },

    updatePolygons: function(newMap, plgs) {
      
        var polygons = this.state.googlePolygons || [] ;
        var map = this.state.map || newMap;
        
        this.trace('rendering polygons...') ;
        
        if(map === null) { 
            return false; 
        }

        if (polygons !== undefined) { 
            if (polygons !== null) {
                polygons.forEach( function(polygon) {
                       polygon.setMap(null);
                } );
            }
        } 

        if (plgs === undefined){ return false ; } 
        if (plgs === null ) { return false ; } 

        polygons = [] ;
        var paths = [
            // These values could be used to test
            // new google.maps.LatLng(37.444878, -122.159993), 
            // new google.maps.LatLng(37.444767, -122.160107),
            // new google.maps.LatLng(37.444548, -122.159767),
            // new google.maps.LatLng(37.444659, -122.159660),
            // new google.maps.LatLng(37.444878, -122.159993) 
            
            ] ; 

        for(var i = 0 ; i< plgs.length ; i++) {
            paths[paths.length] = new google.maps.LatLng(plgs[i][0],plgs[i][1]) ;
        }
        
        if (paths.length>0) {
            paths.push(paths[0]) ;
            
            var polygon = new google.maps.Polygon({
                paths: paths,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            
            polygon.setMap(map) ;
            polygons[0] = polygon ;
        }
        
        this.setState( { googlePolygons : polygons });
    },
  
    updateMarkers : function(newMap,points) {

        var markers = this.state.markers || [] ;
        var map = this.state.map || newMap;
    
        if(map === null) { 
            return false; 
        }
        
        this.trace('rendering markers...') ;
        
        if (markers !== undefined) { 
            if (markers !== null) {
               markers.forEach( function(marker) {
                  marker.setMap(null);
                } );
            }
        }
        
        this.state.markers = [];
    
        if (points !== undefined) { 
            if (points !== null) {
                points.forEach( (function( point ) {
                    
                    var coord = new google.maps.LatLng( point.latitude , point.longitude );
                    var marker = new google.maps.Marker({
                        position: coord,
                        map: map,
                        title: point.title
                    });
            
                    markers.push( marker );
            
                }) );
            }
        }
    
        this.setState( { markers : markers });
        
    },

    showSteps: function (directionResult) {
          // For each step, place a marker, and add the text to the marker's
          // info window. Also attach the marker to an array so we
          // can keep track of it and remove it when calculating new
          // routes.
          var myRoute = directionResult.routes[0].legs[0];
          
          var markerArray = [] ;
          var last = myRoute.steps.length-1 ; 
        
          for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = null ;
            if (i === last) {
                marker = new google.maps.Marker({
                           position: myRoute.steps[i].start_location,
                           map: this.state.map,
                });
            } else {
                marker = new google.maps.Marker({
                  position: myRoute.steps[i].start_location,
                  map: this.state.map
                });
            }
            this.attachInstructionText(marker, myRoute.steps[i].instructions);
            markerArray[i] = marker;
          }
    },
    
    
    calcRoute: function () {
        if (this.state.initialized) {
 
          this.trace('calculating route...') ;
          var markerArray = this.state.markers || [] ;
          // First, remove any existing markers from the map.
          for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
          }
        
          // Now, clear the array itself.
          markerArray = [];
        
          // Retrieve the start and end locations and create
          // a DirectionsRequest using WALKING directions.
          var start = new google.maps.LatLng( this.props.latitude, this.props.longitude ) ;
    
          var end = new google.maps.LatLng( this.props.spot.latitude, this.props.spot.longitude ) ;

          var request = {
              origin: start,
              destination: end,
              travelMode: google.maps.TravelMode.DRIVING
          };
        
          // Route the directions and pass the response to a
          // function to create markers for each step.
          var directionsDisplay = this.state.directionsDisplay ;
          if (!directionsDisplay) {
              directionsDisplay = new google.maps.DirectionsRenderer({map: this.state.map}) ;
          }
          this.state.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              var warnings = document.getElementById('warnings_panel');
              warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
              directionsDisplay.setDirections(response);
              this.showSteps(response);
            
            //  You may also add a marker that points to  
            //  the parking spot itself
            
            //   var marker = new google.maps.Marker({
            //          position: end,
            //          map: this.state.map,
            //          icon: 'pin.png'
            //     });
            //   markerArray.push(marker) ;
            
            }
          }.bind(this));
        } else {
            this.trace('not yet initialized... cannot calculate route') ;
        }
    },
    
     attachInstructionText:function (marker, text) {
          google.maps.event.addListener(marker, 'click', function() {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            this.state.stepDisplay.setContent(text);
            this.state.stepDisplay.open(this.state.map, marker);
          }.bind(this));
    },
    

    render : function() {
        this.trace('rendering directions...') ;
        
        var style = {
            width: this.props.width,
            height: this.props.height 
        }
        var pos = {lat: this.props.latitude, long: this.props.longitude} ;
        
        this.calcRoute() ;
        return (
            React.DOM.div({style:style})
        );
    },

    // shouldComponentUpdate: function(nextProps, nextState) {
    //     return this.state.zoneRequested;
    // },
    
    componentDidMount : function() {

        var createMap = (function() {
            
           var bounds = new google.maps.LatLngBounds();

            //lat / long are not set at this pint, maybe a bug
            //they are set in componentWillReceiveProps:
            //was this.props.zoom
            var mapOptions = 
                {
                    zoom: this.props.zoom,  
                    center: new google.maps.LatLng( this.props.latCenter, this.props.longCenter ),
                    mapTypeId: this.props.mapTypeValues[this.props.mapTypeId] 
                };
            
            var directionsService = new google.maps.DirectionsService();
    
            // Instantiate an info window to hold step text.
            var stepDisplay = new google.maps.InfoWindow();    
            var domNode = React.findDOMNode(this) ;
            var newDiv = document.createElement("div"); 
            newDiv.setAttribute("id", "map");
            domNode.appendChild(newDiv)
            var map = new google.maps.Map( newDiv, mapOptions);
            var area = 0.0010 ;
            bounds.extend(new google.maps.LatLng( this.props.latCenter - area, this.props.longCenter - area ));
            bounds.extend(new google.maps.LatLng( this.props.latCenter - area, this.props.longCenter + area ));
            bounds.extend(new google.maps.LatLng( this.props.latCenter + area, this.props.longCenter + area ));
            bounds.extend(new google.maps.LatLng( this.props.latCenter + area, this.props.longCenter - area ));
            //map.fitBounds(bounds); 
            map.panToBounds(bounds);    
   
            
            var rendererOptions = {
                map: map, 
                preserveViewport: true
              } ;
            var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions) ;
            this.setState( { 
                map : map, 
                directionsService : directionsService, 
                directionsDisplay: directionsDisplay,
                stepDisplay: stepDisplay,
                initialized: true
            } );
                
            if (this.props.markers !== null)  this.updatePolygons(map, this.props.polygons) ;
            if (this.props.polygons !== null) this.updateMarkers(map, this.props.markers) ;
            
        }).bind(this);

        if (typeof google !== 'undefined') {
          createMap() ;
        } else {
            this.warning('google maps script it not available') ;
        }
    },

    componentWillReceiveProps : function(props) {

        this.updateOptions(props) ;
    
        if( props.markers !== undefined ) { 
            this.updateMarkers(null,props.markers); 
        }
    
        if( props.polygons !== undefined ) {
            this.updatePolygons(null,props.polygons) ;
        }
                
        // if (this.isMounted()) {
        //   console.log('calculating route') ;
        //   this.calcRoute() ;
        // }
    }

});

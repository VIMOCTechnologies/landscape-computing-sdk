
/* The MIT License (MIT)
 *  
 * Copyright (c) 2015 VIMOC Technologies
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */////////////////////////////////////////////////////////////////////////////////


/* Description 
 * ------------------------------------------------------
 * View components are meant to be customized to meet 
 * the needs of your application. 
 *
 * They are provided as-is with no garantee 
 * ------------------------------------------------------
 *
 * Input parameters
 * ----------------------------------------------------- 
 * Required:
 * latitude: number | latitude of the center of the map
 * longitude:number | longitude of the center of the map
 * zoom: number | zoom factor
 * mapType: string | type of maps (e.g. 'sat')
 * width: string | witdh of the map (e.g '500px')
 * height: string | height of the map (e.g '100%')
 * markers: array of markers | markers to be displayed 
 *                             on the map
 *     markers = [
 *       {
 *            latitude: {lat},
 *            longitude: {long},
 *            title:{title}
 *        }, ...
 *      ] 
 * polygons: array of points | polygons to be displayed 
 *                             on the map
 *      polygons = [ 
 *              [lat1, lat2],
 *              ... 
 *          ]
 * apiKey: '{your-google-maps-apikey}',
 * useSensor: false,
 *
 * Other: 
 * info: boolean (false) | whether or not the component
 *                         API doc should be rendered
 *                         In that case, no API call is 
 *                         made
 * Sample
 * ------------------------------------------------------
 *    var a_zone_guid = "pa_1" ;
 *    
 *    <Zones 
 *        site={a_zone_guid}
 *        map={false}
 *    />
 *
 *
 *
 *
 *//////////////////////////////////////////////////////



var Map = React.createClass({displayName: "Map",

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
            zoom: 18,
            mapType: 'sat',
            width: '100%',
            height: '100%',
            markers: [],
            polygons: [],
            apiKey: 'AIzaSyA1e4W1FUqy-WxLka-CE6mbYObz5c4BT7U',
            useSensor: false,
            
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
        map : null,
        markers : [],
        polygons: []
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

    render : function() {

        var style = {
          width: this.props.width,
          height: this.props.height
        }

        return (
            React.DOM.div({style:style})
        );
    },

    componentDidMount : function() {

        var createMap = (function() {
            //lat / long are not set at this pint, maybe a bug
            //they are set in componentWillReceiveProps:
            var mapOptions = 
                {
                    zoom: this.props.zoom,
                    center: new google.maps.LatLng( this.props.latitude, this.props.longitude ),
                    mapTypeId: this.props.mapTypeValues[this.props.mapTypeId] 
                };

            var map = new google.maps.Map( this.getDOMNode(), mapOptions);
            this.setState( { map : map } );
            if (this.props.markers !== null)  this.updatePolygons(map, this.props.polygons) ;
            if (this.props.polygons !== null) this.updateMarkers(map, this.props.markers) ;
        }).bind(this);

        if (typeof google !== 'undefined') {
          this.trace('create map:') ;
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
    }

});

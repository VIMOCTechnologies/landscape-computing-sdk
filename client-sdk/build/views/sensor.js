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
 * View components are meant to be fully customized.  
 * The current code is only provided as a sample to
 * illustrate the contract between the API Component
 * and the corresponding View component
 * ------------------------------------------------------
 *
 * The zone component can be used in two modes:
 * - passing an array of Sensor elements
 * - passing an individual Sensor element
 * 
 * When passing an array of Sensor elements, the view is 
 * rendered as a SensorList with each row rendering 
 * individual Sensor element. 
 *
 * Expected Sensor properties
 * ----------------------------------------------------- 
 * description: string | description of the zone 
 * id: string | local id of the zone (unique within the zone)
 * guid: string | guid of the zone 
 * gpsCoord: array of gps coordinates [ "lat,long",...]
 * aggregationScheme: string | 
 * queries: array of Sensor elements (see views/sensor.js)
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 *       aggregationScheme: "none",
 *       description: "Parking Sensor",
 *       gpsCoord: [
 *           "37.444918, -122.16046",
 *          "37.4449295, -122.16048",
 *           "37.44496, -122.16045",
 *           "37.444949, -122.160431"
 *       ],
 *       guid: "pa_1_P1",
 *       id: "P1",
 *       queries: [
 *           {
 *               description: "Occupied Status",
 *               param: [
 *                   ""
 *               ],
 *               queryId: "occupied",
 *               resultType: "int"
 *           }, ...
 *       ]
 *
 *
 *
 *
 *
 *//////////////////////////////////////////////////////


var SensorList = React.createClass({displayName: "SensorList",

    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    getDefaultProps: function() {
        return {
            sensors: [] 
        }
    },
     
    render: function() {
        var i = 0 ;
        sensors = this.props.sensors.map(function(sensor) {
            var s = React.createElement(SensorView, {
                        key: sensor.guid+'-sensor'+'-'+i++, 
                        type: sensor.type, 
                        gpsCoord: sensor.gpsCoord, 
                        id: sensor.id, 
                        guid: sensor.guid, 
                        description: sensor.description, 
                        location: sensor.location, 
                        displayMap: false})
            return (
                React.createElement(RowItemWrapper, {key: 'sensor-'+sensor.guid, value: ['Sensor:',s]})
            ) ;
        }, this) ;
        return (
            React.createElement("div", null, 
            sensors
            )
        ) ;
         
     } 
}) ;

var QueryList = React.createClass({displayName: "QueryList",
      getDefaultProps: function() {
          return {
              queries: [] 
          }
      },
      
      render: function() {
        var i = 0 ;
        var queries = null ;
        
        if(this.props.queries.length>0) {
            queries = this.props.queries.map(function(query) {
                var q = React.createElement(Query, {
                             key: query.queryId+'-query'+'-'+i++, 
                             type: query.resultType, 
                             queryId: query.queryId, 
                             description: query.description, 
                             params: query.param}) ;
                key = this.props.guid+'-'+query.queryId ;
                return (
                    React.createElement(RowItemWrapper, {key: key, value: ['Query:',q]})
                    ) ;
            }, this) ;
        }
      
        return (
              React.createElement("div", null, 
              queries
              )
        ) ;
      }

}) ; 

var SensorView = React.createClass({displayName: "SensorView",

    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    getDefaultProps: function() {
        return {
            sensors: [],
            queries: [],
            sensorMapping: []
        }
    },
    
    render: function() {
        this.log('rendering sensor...',this.props.guid) ;

        
        if (this.props.sensors.length>0) {
            return (React.createElement(SensorList, {sensors: this.props.sensors})) ;
        } else {

            var sensorMapping = '' ;
            if (this.props.sensorMapping.length>0) {
                sensorMapping = this.props.sensorMapping.join(', ') ; 
            }

            var divid = this.props.guid ;
            
            var points = [] ;
            var coords = this.props.gpsCoord ;
            if (coords !== undefined) {
                 for (var i = 0 ; i<coords.length ; i++) {
                    var coord = coords[i] ;
                    var point = coord.split(',') ;
                    points.push(point) ;
                } 
            }
            
            var center = [0,0] ;
            var markers = null ;
            if (points !== undefined) {
                if (points.length>0) {
                    center = this.center(points) ;
                    markers = [
                      {latitude:center[0],longitude:center[1],title:this.props.location}
                    ] ;

                }
            }

            if (this.props.map) {
                return (
                    React.createElement(Map, {key: 'google-map-sensor-'+this.props.guid, 
                        latitude: center[0], longitude: center[1], 
                        zoom: 22, 
                        mapTypeId: "sat", 
                        width: 500, 
                        height: 250, 
                        markers: markers, 
                        polygons: points}
                    ) ) ; 
            }

            
            
            return ( 
                  React.createElement(DivWrapper, {key: divid+'-sensor'}, 
                     React.createElement("table", {className: "table table-hover"}, React.createElement("tbody", null, 
                     React.createElement(RowItemWrapper, {key: divid+'des', value: ['Description:',this.props.description]}), 
                     React.createElement(RowItemWrapper, {key: divid+'id', value: ['Id:',this.props.id]}), 
                     React.createElement(RowItemWrapper, {key: divid+'guid', value: ['GUID:',this.props.guid]}), 
                     React.createElement(RowItemWrapper, {key: divid+'coo', value: ['GPSCoord:',this.props.gpsCoord.join(' | ')]}), 
                     React.createElement(RowItemWrapper, {key: divid+'typ', value: ['Type:',this.props.type]}), 
                     React.createElement(RowItemWrapper, {key: divid+'sch', value: ['Aggregation:',this.props.aggregationScheme]}), 
                     React.createElement(RowItemWrapper, {key: divid+'sen', value: ['Mapping:',sensorMapping]}), 
                     React.createElement("tr", {key: this.props.guid+'-queries-root'}, 
                        React.createElement("td", null, "Queries:"), 
                        React.createElement("td", null, React.createElement(QueryList, {queries: this.props.queries}))
                     )
                     )
                     )
                  )
        
            ) ;
        }
    }
}) ;
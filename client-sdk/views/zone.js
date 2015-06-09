
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



/*
 * copyright statement
 *
 *//////////////////////

/* Description 
 * ------------------------------------------------------
 * View components are meant to be fully customized.  
 * The current code is only provided as a sample to
 * illustrate the contract between the API Component
 * and the corresponding View component
 * ------------------------------------------------------
 *
 * The zone component can be used in two modes:
 * - passing an array of Zone elements
 * - passing an individual Zone element
 * 
 * When passing an array of Zone elements, the view is 
 * rendered as a ZoneTable with each row rendering 
 * individual Zone element. 
 *
 * Expected Zone properties
 * ----------------------------------------------------- 
 * description: string | description of the zone 
 * id: string | local id of the zone (unique within the zone)
 * guid: string | guid of the zone 
 * gpsCoord: array of gps coordinates [ "lat,long",...]
 * location: string | 
 * sensors: array of Sensor elements (see views/sensor.js)
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 *      description: "Los Gatos Zone E",
 *      gpsCoord: [
 *          "37.2206992743, -121.9846208062",
 *          "37.2201222654, -121.9850708517",
 *          "37.2203511095, -121.9855621915",
 *          "37.2209174424, -121.9851104639"
 *      ],
 *      guid: "lg_2",
 *      id: "2",
 *      location: "Zone E",
 *      sensors: [ ... see view/sensor.js ...]
 *
 *
 *
 *
 *
 *//////////////////////////////////////////////////////
 
 
var ZoneTable = React.createClass({

    render: function() {
        
          return (
              <table className="table table-hover">
                  <tbody>
                    {this.props.children}
                  </tbody>
              </table> 
        ) ;
      
    }
}) ;

var ZoneMapRow = React.createClass({
                 
     render: function() {
         
           return (
                <tr>
                    <td colSpan="2">
                        {this.props.children}
                    </td>
                </tr> 
                     ) ;
                   
    }
}) ;
 
var ZoneItems = React.createClass({
     getDefaultProps: function() {
         return {
             zones: [] 
         }
     },
     
     render: function() {
        var i = 0 ;
        zones = this.props.zones.map(function(zone) {
            var z = <ZoneView
                        key={zone.guid+'-zone'+'-'+i++}
                        location={zone.location} 
                        guid={zone.guid} 
                        id={zone.id} 
                        description={zone.description} 
                        gpsCoord={zone.gpsCoord}
                        sensors={zone.sensors}
                        displayMap={false}
                    /> ;
            return (
                <RowItemWrapper key={'row-'+zone.guid+'-'+(i-1)} value={['Zone:',z]}/>
                ) ;
        }, this) ;
        return (
                <ZoneTable>
                    {zones}
                </ZoneTable>
        ) ;
         
     } 
}) ;

var ZoneView = React.createClass({
    
    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    
    getDefaultProps: function() {
        return {
            zones: [],
            sensors: [],
            displayMap: true
        }
    },

    render: function() {
        this.trace('rendering zone...'+this.props.guid) ;
        var zones = null ;
        if (this.props.zones.length>0) {
            return (<ZoneItems zones={this.props.zones} />) ;
        } else {
            var sens = <tr key={this.props.guid+'-sensors-root'}><td></td><td></td></tr> ;
            if (this.props.sensors !== undefined) {
                if (this.props.sensors.length>0) {
                    sens =<tr key={this.props.guid+'-sensors-root'}>
                          <td>Sensors:</td>
                          <td><SensorView key={this.props.guid+'-sensors'} sensors={this.props.sensors} /></td></tr> ;
                }
            }
            
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
                var props = {   
                    key: 'google-map-zone-'+this.props.guid,
                    latitude: center[0], longitude: center[1],
                    zoom: 19, mapTypeId: 'sat',
                    width:500, height: 250, 
                    markers: markers,
                    polygons: points,
                    mapTypeValues: {
                       'road': google.maps.MapTypeId.ROADMAP,
                       'satellite': google.maps.MapTypeId.SATELLITE,
                       'sat': google.maps.MapTypeId.SATELLITE,
                       'terrain': google.maps.MapTypeId.TERRAIN,
                       'hybrid': google.maps.MapTypeId.HYBRID
                    }
                } ;
                return React.cloneElement( Map, props, null ) ;
                      
            }

            return (
                <ZoneTable key={this.props.guid+'-table'}>
                     <RowItemWrapper key={this.props.guid+'-des'} value={['Description:',this.props.description]}/>
                     <RowItemWrapper key={this.props.guid+'-id'} value={['Id:',this.props.id]}/>
                     <RowItemWrapper key={this.props.guid+'-guid'} value={['GUID:',this.props.guid]}/>
                     <RowItemWrapper key={this.props.guid+'-gps'} value={['GPS Coordinates:',this.props.gpsCoord.join(' | ')]}/>
                     <RowItemWrapper key={this.props.guid+'-loc'} value={['Location:',this.props.location]}/>
                     {sens}
                </ZoneTable>
                 ) ;
               
        }
    }
}) ;
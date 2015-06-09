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
 * API components are not meant to be customized.  
 * The architecture of the SDK (based on React.js) 
 * supports compatible updates to your existing application
 * by simply replacing these components in place and 
 * updating the API configuration in the common.js file
 * ------------------------------------------------------
 *
 * Input parameters
 * ----------------------------------------------------- 
 * Required:
 * zone: string | guid of the zone to query 
 * 
 *
 * Modal parameters:
 * map: boolean (false) | passed to the view, indicate
 *                        whether or not the component
 *                        should be rendered as a map
 *
 * short: boolean (false) | whether or not ShortSiteView
 *                          of SiteView should be rendered
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

 
var Zones = React.createClass({displayName: "Zones",

    propTypes: {
        //Request
        zone: React.PropTypes.string.isRequired,
        
        //Response
        description: React.PropTypes.string,
        gpsCoord: React.PropTypes.array,
        guid: React.PropTypes.string,
        id: React.PropTypes.string,
        location: React.PropTypes.string,
        sensors: React.PropTypes.array,
        
        //Component
        short: React.PropTypes.bool,
        display: React.PropTypes.bool,
        map: React.PropTypes.bool,
        info: React.PropTypes.bool,
        scheme: React.PropTypes.number
    },
    
    mixins: [
        configMixIn,
        traceMixIn     //uses log()
    ],  

    
    getDefaultProps: function() {
        return {
            zone: "pa_3",
            map: false,
            short: false,
            info: false,
            invisible: false,
            pass: {},
            callback: null,
            scheme: 0
        } ;
    },

    //based on Swagger 2.0
    apiInfo: function() { 
        
        return this.config.info ;
          
    },

    schemes: this.config.schemes,
    
    host: function() {
        return this.schemes[this.props.scheme]+'://'+this.config.host ;
    },
    
    basePath: function() {
        return this.config.basePath ;
    },
    
    resourcePath: function(zone) {
        if (zone === undefined) zone = this.props.zone ;
        return  '/zone/'+zone.trim() ; 
    },
    
    operations: [{
        get: {
             tags: [
                 "parking","traffic"
             ],
             summary: "Find zone by ID",
             description: "Returns the information relative to a single zone, from the zone identifier",
             operationId: "getZoneById",
             produces: [
                 "application/xml",
                 "application/json"
             ],
             parameters: [
                 {
                     "name": "zoneId",
                     "in": "path",
                     "description": "ID of zone to return",
                     "required": true,
                     "type": "string",
                     default: "pa_1"
                 }
             ],
             responses: {
                 200: {
                     description: "successful operation",
                     schema: {
                         ref: "#/definitions/Zone"
                     }
                 },
                 400: {
                     description: "Invalid ID supplied"
                 },
                 404: {
                     description: "Site not found"
                 }
             },
             security: [
                 {
                     api_key: []
                 }
             ]
        }
    }],
    
    loadData: function() {
      $.ajax({
        url: this.host()+this.basePath()+this.resourcePath(this.props.site),
        crossDomain: true,
        dataType: 'json',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function(zone) {
            
            var zoneData = {
                description: zone.description, 
                gpsCoord: zone.gpsCoord, 
                guid: zone.guid, 
                id: zone.id, 
                location: zone.location,
                sensors: zone.sensorId
            }
            if (this.isMounted()) { 
                this.setState(zoneData); 
            }
            if (this.props.callback) {
                this.props.callback(zoneData) ;
            }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.zone, status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
        if (this.props.display) {
            return {
              id: this.props.id.trim(),
              guid: this.props.zone.trim(),
              location: this.props.location,
              gpsCoord: this.props.gpsCoord,
              description: this.props.description
            } ;
        }
      return {
        guid: this.props.zone.trim(),
        sensors: [],
        gpsCoord: []
      };
    },
  
    componentDidMount: function() {
        if ((!this.props.info) && (!this.props.display)) {
            this.loadData() ;
        }
    },
    
    componentWillReceiveProps: function(nextProps) {
        if ((!this.props.info) && (!this.props.display)) {
            this.loadData() ;
        }
    },  
  
    render: function() {
        this.trace('rendering zones....') ;

        var zone = this.props.zone;

        if (this.props.invisible) {
            return (
                    React.createElement(DivWrapper, {key: zone}
                    )
                ) ;
        }

        if (this.props.info) {
           return (
                React.createElement(ApiInfo, {name: "zone", 
                    info: this.apiInfo(), 
                    host: this.host(), 
                    basePath: this.basePath(), 
                    resourcePath: this.resourcePath('{zone}'), 
                    schemes: this.schemes, 
                    operations: this.operations, 
                    tags: this.config.tags, 
                    externalDocs: this.config.externalDocs}

                    )
                ) ; 
        } 


        var results = '' ;

        var divid = zone+'-results';
        if (this.props.short) {
            results = React.createElement(ShortZoneView, {key: divid+'-short-zone', 
                            description: this.state.description, 
                            id: this.state.id, 
                            guid: this.state.guid, 
                            gpsCoord: this.state.gpsCoord, 
                            location: this.state.location, 
                            sensors: this.state.sensors, 
                            params: this.props.params, 
                            pass: this.props.pass}
                        )

        } else {
            
            results = React.createElement(ZoneView, {key: divid+'-zone', 
                            description: this.state.description, 
                            id: this.state.id, 
                            guid: this.state.guid, 
                            gpsCoord: this.state.gpsCoord, 
                            location: this.state.location, 
                            sensors: this.state.sensors, 
                            map: this.props.map, 
                            pass: this.props.pass}
                        )
        }

        return (
            React.createElement("div", {id: "map"}, 
                results
            ) 
        );
    } 
});
  



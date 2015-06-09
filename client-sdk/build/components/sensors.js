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
 * sensor: string | guid of the sensor to query 
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
 *    var a_sensor_guid = "pa_1_P1" ;
 *    
 *    <Sensors 
 *        sensor={a_sensor_guid}
 *        map={false}
 *    />
 *
 *
 *
 *
 *////////////////////////////////////////////////////// 
 
var Sensors = React.createClass({displayName: "Sensors",

    propTypes: {
        //Request
        sensor: React.PropTypes.string.isRequired,
        
        //Response
        description: React.PropTypes.string,
        gpsCoord: React.PropTypes.array,
        guid: React.PropTypes.string,
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        aggregationScheme: React.PropTypes.string,
        queries: React.PropTypes.array,
        sensorMapping: React.PropTypes.array,
        
        //Component
        short: React.PropTypes.bool,
        display: React.PropTypes.bool,
        map: React.PropTypes.bool,
        info: React.PropTypes.bool,
        scheme: React.PropTypes.number
    },
    
    mixins : [
        
        configMixIn,
        traceMixIn     //uses log()

        ],
    
    getDefaultProps: function() {
        return {
            sensor: "pa_1_P1",
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
    
    resourcePath: function(sensor) {
        if (sensor === undefined) sensor = this.props.sensor ;
        return  '/sensor/'+sensor.trim() ; 
    },
    
    operations: [{
        get: {
             tags: [
                 "parking","traffic"
             ],
             summary: "Find sensor by ID",
             description: "Returns the information relative to a single sensor, from the sensor identifier",
             operationId: "getSensorById",
             produces: [
                 "application/xml",
                 "application/json"
             ],
             parameters: [
                 {
                     "name": "sensorId",
                     "in": "path",
                     "description": "ID of sensor to return",
                     "required": true,
                     "type": "string",
                     default: "pa_1_P1"
                 }
             ],
             responses: {
                 200: {
                     description: "successful operation",
                     schema: {
                         ref: "#/definitions/Sensor"
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
        url: this.host()+this.basePath()+this.resourcePath(this.props.sensor),
        crossDomain: true,
        dataType: 'json',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function(sensor) {
            var sensorData = {
                   description: sensor.description, 
                   gpsCoord: sensor.gpsCoord, 
                   guid: sensor.guid, 
                   id: sensor.id, 
                   sensorMapping: sensor.sensorMapping, 
                   type: sensor.type,
                   aggregationScheme: sensor.aggregationScheme,
                   queries: sensor.query
            } ;
            if (this.isMounted()) { 
                this.setState(
                    sensorData
                );
            }
            if (this.props.callback) {
                this.props.callback(sensorData) ;
            }
          
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.sensor, status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
        if (this.props.display) {
            return {
              sensor: this.props.sensor.trim(),
              id: this.props.id.trim(),
              guid: this.props.sensor.trim(),
              type: this.props.type,
              aggregationScheme: this.props.aggregationScheme,
              gpsCoord: this.props.gpsCoord,
              description: this.props.description
            } ;
        }
      return {
        guid: this.props.sensor.trim(),
        queries: [],
        sensorMapping: [],
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
        this.trace('rendering sensors....') ;

        var sensor = this.props.sensor;

        if (this.props.invisible) {
            return (
                    React.createElement(DivWrapper, {key: sensor}
                    )
                ) ;
        }

        if (this.props.info) {
           return (
                React.createElement(ApiInfo, {name: "sensor", 
                    info: this.apiInfo(), 
                    host: this.host(), 
                    basePath: this.basePath(), 
                    resourcePath: this.resourcePath('{sensor}'), 
                    schemes: this.schemes, 
                    operations: this.operations, 
                    tags: this.config.tags, 
                    externalDocs: this.config.externalDocs}

                    )
                ) ; 
        } 
    

        var results = null ;

        var divid = sensor+'-results';
        if (this.props.short) {
            results = 
                React.createElement(ShortSensorView, {key: 'short-'+divid, 
                    description: this.state.description, 
                    id: this.state.id, 
                    guid: this.state.guid, 
                    gpsCoord: this.state.gpsCoord, 
                    type: this.state.type, 
                    aggregationScheme: this.state.aggregationScheme, 
                    sensorMapping: this.state.sensorMapping, 
                    queries: this.state.queries, 
                    pass: this.props.pass}
                )
                
        } else {
            
            results = 
                React.createElement(SensorView, {key: divid, 
                    description: this.state.description, 
                    id: this.state.id, 
                    guid: this.state.guid, 
                    gpsCoord: this.state.gpsCoord, 
                    type: this.state.type, 
                    aggregationScheme: this.state.aggregationScheme, 
                    sensorMapping: this.state.sensorMapping, 
                    queries: this.state.queries, 
                    map: this.props.map, 
                    pass: this.props.pass}
                )
                        
        }
        
        return (
            React.createElement(DivWrapper, {key: "sensor-data-"+sensor}, 
                  results
            ) 
        );
    }
});
  



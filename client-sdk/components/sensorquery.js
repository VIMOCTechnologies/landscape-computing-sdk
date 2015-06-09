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
 * query: enum | type of statistics requested
 *               ['occupied', 
 *               'duration', 
 *               'summary', 
 *               'avgduration', 
 *               'avgduration-daily', 
 *               'parks', 
 *               'turnover', 
 *               'vacancy', 
 *               'latestvalue', 
 *               'peoplecount'] 
 * 
 * params: array of query parameters | each query value may be further 
 *                                     refined with parameters
 *     occupied, duration: 
 *          { date: "2015-05-22T00:00:00"}
 *     summary, avgduration, avgduration-daily, turnover, vacancy: 
 *          {   startdate: "2015-05-17T00:00:00", 
 *              enddate: "2015-05-22T00:00:00", 
 *              ongoingparks: false,
 *              minduration: 60 }     
 *      parks: 
 *          {   startdate: "2015-05-17T00:00:00", 
 *              enddate: "2015-05-22T00:00:00" }
 *      latestvalue: none
 *      peoplecount: 
 *          {   startdate: "2015-05-17T00:00:00",
 *              enddate: "2015-05-22T00:00:00",
 *              granularity: "hour"
 *          }
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
 *
 *
 * Sample
 * ------------------------------------------------------
 * 
 *  <SensorQueries 
 *      sensor="pa_1_P1" 
 *      query="duration"
 *  />
 *
 *
 *//////////////////////////////////////////////////////

 

var SensorQueries = React.createClass({

    propTypes: {
        //Request
        sensor: React.PropTypes.string.isRequired,
        query: React.PropTypes.oneOf(
            ['occupied', 
             'duration', 
             'summary', 
             'avgduration', 
             'avgduration-daily', 
             'parks', 
             'turnover', 
             'vacancy', 
             'latestvalue', 
             'peoplecount']
            ).isRequired,
        date: React.PropTypes.string,
        
        //Response
        readingData: React.PropTypes.string,
        readingId: React.PropTypes.array,
        readingTime: React.PropTypes.string,
        sensorId: React.PropTypes.string,

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
            sensor: "pa_1_P1",
            query: "occupied",
            map: false,
            short: false,
            info: false,
            display: false,
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

    schemes: [
        "http"
    ],
    
    host: function() {
        return this.schemes[this.props.scheme]+'://'+this.config.host ;
    },
    
    basePath: function() {
        return this.config.basePath ;
    },
    
    resourcePath: function(sensor,query,params) {
        if (sensor === undefined) sensor = this.props.sensor ;
        var qp = '' ;
        if (params !== undefined) {
            qp = '?'+queryParameters(params) ;
        }
        return  '/sensor/'+sensor.trim()+'/query/'+query+qp ; 
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
                     "name": "query",
                     "in": "path",
                     "description": "type of query",
                     "required": true,
                     "type": "string",
                     "enum": [
                         "occupied",
                         "summary",
                         "avgduration",
                         "avgduration-daily",
                         "duration",
                         "turnover",
                         "parks",
                         "vacancy",
                         "latestvalue"
                         
                     ],
                     default: "pa_1_P1"
                    },
                    {
                        "name": "date",
                        "in": "query",
                        "description": "timestamp of the measurement",
                        "required": false,
                        "type": "date-time",
                        default: "{now}"
                    },
                    {
                         "name": "startdate",
                         "in": "query",
                         "description": "start of the measurement",
                         "required": false,
                         "type": "date-time",
                         default: "{7 days ago}"
                    },
                    {
                           "name": "enddate",
                           "in": "query",
                           "description": "end date of the measurement",
                           "required": false,
                           "type": "date-time",
                           default: "{now}"
                    },
                    {
                            "name": "ongoingparks",
                            "in": "query",
                            "description": "Include Incomplete Stays (true)",
                            "required": false,
                            "type": "date-time",
                            default: "{now}"
                    },
                    {
                            "name": "minduration",
                            "in": "query",
                            "description": "Include Incomplete Stays (true)",
                            "required": false,
                            "type": "number",
                            "enum": [
                                "0",
                                "30",
                                "60",
                                "120"
                                
                            ],
                            default: "{now}"
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
        url: this.host()+this.basePath()+this.resourcePath(this.props.sensor,this.props.query,this.props.params),
        crossDomain: true,
        dataType: 'json',
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function(data) {
            if (this.isMounted()) { 
                this.setState({
                    data: data
                });
            }
            if (this.props.callback) {
                this.props.callback(data) ;
            }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.sensor, status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
      return {
        sensor: this.props.sensor.trim(),
        query: this.props.query.trim(),
        data: []
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
        this.trace('rendering SensorQuery....') ;

        var sensor = this.props.sensor;

        if (this.props.invisible) {
            return (
                    <DivWrapper key={sensor+'-query-'+this.props.query}>
                    </DivWrapper>
                ) ;
        }

        if (this.props.info) {
           return (
                <ApiInfo name="sensorquery" 
                    info={this.apiInfo()}
                    host={this.host()}
                    basePath={this.basePath()}
                    resourcePath={this.resourcePath('{sensor}','{query}')}
                    schemes={this.schemes}
                    operations={this.operations}
                    />
                ) ; 
        } 
        
        return (
                <SensorQueryView 
                    sensor={sensor}
                    stats={this.state.data} 
                    map={this.props.map}
                    short={this.props.short} 
                    pass={this.props.pass}
                />
        ) ;

    }
});
  




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
 * site: string | guid of the site to query 
 * query: enum | type of statistics requested
 *               ['summary',
                  'parkingsummary'] 
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
 * 
 *  <SiteQueries 
 *      site="pa" 
 *      query="summary"
 *  />
 *
 *  Returns an array of objects to the corresponding view:
 *  [ 
 *      { 
 *           duration: "14", 
 *           occupied: "0", 
 *           sensor: "pa_2_P28"
 *       }, ...
 *  ]
 *
 *//////////////////////////////////////////////////////
 

var SiteQueries = React.createClass({displayName: "SiteQueries",

    propTypes: {
        //Request
        site: React.PropTypes.string.isRequired,
        query: React.PropTypes.oneOf(
            ['summary']
            ).isRequired,

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
    
    mixins : [
        configMixIn,
        traceMixIn     //uses log()
        ],
    
    getDefaultProps: function() {
        return {
            site: "pa",
            query: "summary",
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

    schemes: [
        "http"
    ],
    
    host: function() {
        return this.schemes[this.props.scheme]+'://'+this.config.host ;
    },
    
    basePath: function() {
        return this.config.basePath ;
    },
    
    resourcePath: function(site,query,params) {
        if (site === undefined) site = this.props.site ;
        var qp = '' ;
        if (params !== undefined) {
            qp = '?'+queryParameters(params) ;
        }
        return  '/site/'+site.trim()+'/query/'+query+qp ; 
    },
    
    operations: [{
        get: {
             tags: [
                 "parking","traffic"
             ],
             summary: "Query sensor stats by site",
             description: "Returns the information relative to a site, from the site identifier",
             operationId: "getStatsBySiteId",
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
                     "enum": ['summary',
                              'parkingsummary'
                     ],
                     default: "summary"
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
                         ref: "#/definitions/SiteQuery"
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
        url: this.host()+this.basePath()+this.resourcePath(this.props.zone,this.props.query,this.props.params),
        crossDomain: true,
        dataType: 'text',
        success: function(data) {
            var results = [] ;
            //Parsing the non json format
            var rows = data.split('|').forEach(function(row) {
                var rowValues = row.split(':') ;
                if (rowValues[1] !== undefined) { 
                    var sensorValues = rowValues[1].split('%') ;
                    var result = {sensor: rowValues[0] , occupied: sensorValues[0].trim(), duration: sensorValues[1].trim()}
                    results.push(result) ;
                }
            }) ;
 
            if (this.isMounted()) { 
                this.setState({
                    data: results
                });
            }
            if (this.props.callback) {
                this.props.callback(results) ;
            }

        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.zone, status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
      return {
        site: this.props.site,
        query: this.props.query,
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
        this.trace('rendering sitequery....') ;

        var site = this.props.site ;
        var query = this.props.query ;

        if (this.props.invisible) {
            return (
                    <DivWrapper key={site}>
                    </DivWrapper>
                ) ;
        }

        if (this.props.info) {
           return (
                <ApiInfo name="sitequery" 
                    info={this.apiInfo()}
                    host={this.host()}
                    basePath={this.basePath()}
                    resourcePath={this.resourcePath('{site}','{query}')}
                    schemes={this.schemes}
                    operations={this.operations}

                    />
                ) ; 
        } 
    
        return (
            <SiteListQueryView
                site={site}
                stats={this.state.data}
                short={this.props.short}
                pass={this.props.pass}
            />
        ) ;

    }
});
  




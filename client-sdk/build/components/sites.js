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
 *    var a_site_guid = "pa" ;
 *    
 *    <Sites 
 *        site={a_site_guid}
 *        map={false}
 *    />
 *
 *
 *
 *
 *//////////////////////////////////////////////////////

 
var Sites = React.createClass({displayName: "Sites",

    propTypes: {
        //Request
        site: React.PropTypes.string.isRequired,
        
        //Response
        description: React.PropTypes.string,
        gpsCoord: React.PropTypes.array,
        id: React.PropTypes.string,
        timeZone: React.PropTypes.string,
        zones: React.PropTypes.array,
        
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
            site: 'pa',
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
    
    resourcePath: function(site) {
        if (site === undefined) site ='' ;
        return  '/site/'+site.trim() ; 
    },
    
    operations: [{
        get: {
             tags: [
                 "parking","traffic"
             ],
             summary: "Find site by ID",
             description: "Returns the information relative to a single site, from the site identifier",
             operationId: "getSiteById",
             produces: [
                 "application/xml",
                 "application/json"
             ],
             parameters: [
                 {
                     "name": "siteId",
                     "in": "path",
                     "description": "ID of site to return",
                     "required": true,
                     "type": "string",
                     default: "pa"
                 }
             ],
             responses: {
                 200: {
                     description: "successful operation",
                     schema: {
                         ref: "#/definitions/Site"
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
        success: function(site) {
            
            var siteData = {
                description: site.description, 
                gpsCoord: site.gpsCoord, 
                id: site.id, 
                timeZone: site.timeZone,
                zones: site.zone
            } ;
            
            if (this.isMounted()) { 
                this.setState(
                    siteData
                );
            }
            if (this.props.callback) {
                this.props.callback(siteData) ;
            }

          
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.site, status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
      return {
        id: this.props.site.trim(),
        zones: [],
        gpsCoord: []
      };
    },
  
    componentDidMount: function() {
        if (!this.props.info) {
            this.loadData() ;
        }
    },
  
    componentWillReceiveProps: function(nextProps) {
      if (!this.props.info) {
          this.loadData() ;
      }
    },  
  
    render: function() {
        this.trace('rendering sites....') ;
        var site = this.props.site;

        var results = '' ;
        var divid = site+'-results';

        if (this.props.invisible) {
            return (
                    React.createElement(DivWrapper, {key: site}
                    )
                ) ;
        }

        if (this.props.info) {
           return (
                React.createElement(ApiInfo, {name: "site", 
                    info: this.apiInfo(), 
                    host: this.host(), 
                    basePath: this.basePath(), 
                    resourcePath: this.resourcePath('{site}'), 
                    schemes: this.schemes, 
                    operations: this.operations, 
                    tags: this.config.tags, 
                    externalDocs: this.config.externalDocs}
                    )
                ) ; 
        } 

        if (this.props.short) {
            results =
                React.createElement(ShortSiteView, {key: divid+'-short-site', 
                    description: this.state.description, 
                    id: this.state.id, 
                    gpsCoord: this.state.gpsCoord, 
                    timeZone: this.state.timeZone, 
                    zones: this.state.zones, 
                    map: this.props.map, 
                    pass: this.props.pass}
                )
    
        } else {
            results = 
                React.createElement(SiteView, {key: divid+'-site', 
                    description: this.state.description, 
                    id: this.state.id, 
                    gpsCoord: this.state.gpsCoord, 
                    timeZone: this.state.timeZone, 
                    zones: this.state.zones, 
                    map: this.props.map, 
                    pass: this.props.pass}
                )
        }
    
        return (
            React.createElement(DivWrapper, {key: "site-data-"+site}, 
                results
            ) 
        );
    }
});
  




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
* N/A
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
*    
*    <Sitelist />
*
*
*
*
*//////////////////////////////////////////////////////
 
 
var SiteList = React.createClass({displayName: "SiteList",

    propTypes: {
        //Request

        //Response
        sitelist: React.PropTypes.array,
        
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
        return  '/sites' ; 
    },
    
    operations: [{
        get: {
             tags: [
                 "parking","traffic"
             ],
             summary: "List sites",
             description: "Returns the list of sites available",
             operationId: "getSiteList",
             produces: [
                 "application/xml",
                 "application/json"
             ],
             parameters: [
             ],
             responses: {
                 200: {
                     description: "successful operation",
                     schema: {
                         ref: "#/definitions/Site"
                     }
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
        success: function(list) {
            
            if (this.isMounted()) { 
                this.setState({
                    sitelist: list
                });
            }
            if (this.props.callback) {
                this.props.callback(list) ;
            }

        }.bind(this),
        error: function(xhr, status, err) {
          console.error('', status, err.toString());
        }.bind(this)
      }) ;

    },
    
    getInitialState: function() {
      return {
        sitelist: []
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
        this.trace('rendering sitelist...') ;

        var results = '' ;
        var divid = this.props.site+'-results';

        if (this.props.invisible) {
            return (
                    <DivWrapper key={divid}>
                    </DivWrapper>
                ) ;
        }    

        if (this.props.info) {
           return (
                <ApiInfo name="sitelist" 
                    info={this.apiInfo()}
                    host={this.host()}
                    basePath={this.basePath()}
                    resourcePath={this.resourcePath('')}
                    schemes={this.schemes}
                    operations={this.operations}
                    tags={this.config.tags}
                    externalDocs={this.config.externalDocs} 
                    />
                ) ; 
        } 
    
        if (this.props.short) {
            results = 
                        <ShortSiteListView key={divid+'-short-sitelist'} 
                            sitelist={this.state.sitelist}
                            map={false}
                            pass={this.props.pass}
                        /> ;
                   
    
        } else {
                results = 
                        <SiteView key={divid+'-sitelist'}
                            sites={this.state.sitelist}
                            map={false}
                            pass={this.props.pass}
                        /> ;
                
        }
    
        return (
            <DivWrapper key={"sitelist-data-"+site}>
                {results}
            </DivWrapper> 
        );
    }
    
});
  




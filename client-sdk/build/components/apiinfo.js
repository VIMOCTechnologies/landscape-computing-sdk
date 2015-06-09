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
* Note: API components are not meant to be customized.  
* The architecture of the SDK (based on React.js) 
* supports compatible updates to your existing application
* by simply replacing these components in place and 
* updating the API configuration in the common.js file
* ------------------------------------------------------
*
* Component Properties
* ----------------------------------------------------- 
* Required:
* info: object | generally this is passed as config.info
* host: host name 
* basePath: base path of the API
* resourcePath: resource path of this component
* schemes: schemes supported by the 
* operations: operations associated to the resource path
* tags: tags associated to the resource path
*
* Sample
* ------------------------------------------------------
*    // This code sample is using the standard methods 
*    // of API components
*    
*   <ApiInfo name="site" 
*        info={this.apiInfo()}
*        host={this.host()}
*        basePath={this.basePath()}
*        resourcePath={this.resourcePath('{site}')}
*        schemes={this.schemes}
*        operations={this.operations}
*        tags={this.config.tags}
*        />
*
*
*//////////////////////////////////////////////////////



var ApiInfo = React.createClass({displayName: "ApiInfo",

    mixins: [
        traceMixIn     //uses log()
    ],  


    getDefaultProps: function() {
        return {
            header: false 
        } ;
    },
  
    operation: function(operation, verb, color,divid) {
      var l = 0 ;
      var pheaders = ["Parameter","Value","Description","Parameter Type","Data Type"];
      var ph = pheaders.map(function(v) {
          return (
              React.createElement(HeaderItemWrapper, {key: v, value: v})
              ) ;
      } ) ;
      var prows = operation.parameters ;
      var pr = prows.map(function(v) {
        var key = v.name ;
        var required = (v.required) ? '(optional)' : '(required)' ;
        return (React.createElement(RowItemWrapper, {key: key, value: [v.description,v.default,'',v.type]}));
      });
      
      var rheaders = ["HTTP Status Code","Reason","Response Model","Headers"] ;
      var rh = rheaders.map(function(v) {
          return (React.createElement(HeaderItemWrapper, {key: v, value: v})) ;
      } ) ;
      var rrows = [] ;
      for(var rrow in operation.responses) {
          var key = rrow ;
          var value = operation.responses[key] ;
          rrows[rrows.length] = React.createElement(RowItemWrapper, {key: divid+'-'+verb+'-'+key, value: [key,value.descriptio,'','']}) ;
      }
      var rr = rrows ;
      
      var sr = operation.security.map(function(r) { return ('api key')}) ;
      
      if (operation.consumes === undefined) operation.consumes = [] ;
      l = 0 ;
      var requestContentType = operation.consumes.map(function(ct) { 
          return (
              React.createElement(LiItemWrapper, {key: l, className: "list-group-item", value: l++, label: ct})
              ) ;
      }) ;
      
      if (operation.produces === undefined) operation.produces = [] ;
      l = 0 ;
      var responseContentType = operation.produces.map(function(ct) { 
          return (
                React.createElement(LiItemWrapper, {key: l, className: "list-group-item", value: l++, label: ct})
                ) ;
      }) ;
      
    var st = "table table-hover";
    return (
        React.createElement("div", {className: 'panel panel-'+color}, 
            React.createElement("div", {className: "panel-heading"}, 
             React.createElement("div", {className: "row"}, 
               React.createElement("div", {className: "col-md-6"}, 
                   React.createElement("h4", {className: "panel-title"}, 
                   React.createElement("span", {className: 'label label-'+color}, "GET"), "  ", this.props.resourcePath)
               ), 
               React.createElement("div", {className: "col-md-6"}, 
                   React.createElement("div", {className: "text-right"}, this.props.operations[0]['get'].summary)
               )
             )
            ), 
            React.createElement("div", {className: "panel-body"}, 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Request URL: ")), React.createElement("code", null, this.props.host+this.props.basePath+this.props.resourcePath), React.createElement("br", null), React.createElement("br", null), 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Implementation Notes")), 
              operation.description, React.createElement("br", null), React.createElement("br", null), 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Request Content Type")), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-2"}, 
                    React.createElement("ul", {className: "list-group", width: '150px'}, 
                        requestContentType
                    )
                )
              ), 
              
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Response Content Type")), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-2"}, 
                    React.createElement("ul", {className: "list-group", width: '150px'}, 
                        responseContentType
                    )
                )
              ), 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Parameters")), 
              React.createElement(TableWrapper, {className: st, headers: ph, rows: pr}), 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Response Messages")), 
              React.createElement(TableWrapper, {className: st, headers: rh, rows: rr}), 
              React.createElement("p", {className: 'text-'+color}, React.createElement("b", null, "Security")), 
              React.createElement("div", {key: "sr"}, sr)
            )
        )
      ) ;
  },
  
  
  render: function(){
    this.trace('rendering apiinfo....') ;
    
    var divid = this.props.name+'-info' ;
    var mailto = 'mailto:'+this.props.info.contact.email ;
    var panelClass = 'panel panel-success' ;
    var displayHeader = this.props.header ;
    
    var methods = ['get','put','post','delete'] ;

    var operations = methods.map( function(verb) {
        var operation = this.props.operations[0][verb] ;
        var color = { get: 'info', post: 'warning', put : 'success', delete: 'danger' } ;
        if (operation) {
            return (
                React.createElement(DivWrapper, {key: "verb"}, 
                    this.operation(operation,verb, color[verb], this.props.name+'-info')
                )
                ) ;
        }
    } , this) ;


    return (
        React.createElement(DivWrapper, {key: divid}, 
            operations
        )
    ) ;
  }
});


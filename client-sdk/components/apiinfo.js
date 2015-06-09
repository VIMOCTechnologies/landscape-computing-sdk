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



var ApiInfo = React.createClass({

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
              <HeaderItemWrapper key={v} value={v}/>
              ) ;
      } ) ;
      var prows = operation.parameters ;
      var pr = prows.map(function(v) {
        var key = v.name ;
        var required = (v.required) ? '(optional)' : '(required)' ;
        return (<RowItemWrapper key={key} value={[v.description,v.default,'',v.type]}/>);
      });
      
      var rheaders = ["HTTP Status Code","Reason","Response Model","Headers"] ;
      var rh = rheaders.map(function(v) {
          return (<HeaderItemWrapper key={v} value={v}/>) ;
      } ) ;
      var rrows = [] ;
      for(var rrow in operation.responses) {
          var key = rrow ;
          var value = operation.responses[key] ;
          rrows[rrows.length] = <RowItemWrapper key={divid+'-'+verb+'-'+key} value={[key,value.descriptio,'','']}/> ;
      }
      var rr = rrows ;
      
      var sr = operation.security.map(function(r) { return ('api key')}) ;
      
      if (operation.consumes === undefined) operation.consumes = [] ;
      l = 0 ;
      var requestContentType = operation.consumes.map(function(ct) { 
          return (
              <LiItemWrapper key={l} className="list-group-item" value={l++} label={ct}/>
              ) ;
      }) ;
      
      if (operation.produces === undefined) operation.produces = [] ;
      l = 0 ;
      var responseContentType = operation.produces.map(function(ct) { 
          return (
                <LiItemWrapper key={l} className="list-group-item" value={l++} label={ct}/>
                ) ;
      }) ;
      
    var st = "table table-hover";
    return (
        <div className={'panel panel-'+color} >
            <div className="panel-heading">
             <div className="row">
               <div className="col-md-6">
                   <h4 className="panel-title">
                   <span className={'label label-'+color}>GET</span>  {this.props.resourcePath}</h4>
               </div>
               <div className="col-md-6">
                   <div className="text-right">{this.props.operations[0]['get'].summary}</div>
               </div>
             </div>
            </div>
            <div className="panel-body">
              <p className={'text-'+color}><b>Request URL: </b></p><code>{this.props.host+this.props.basePath+this.props.resourcePath}</code><br/><br/>
              <p className={'text-'+color}><b>Implementation Notes</b></p>
              {operation.description}<br/><br/>
              <p className={'text-'+color}><b>Request Content Type</b></p> 
              <div className="row">
                <div className="col-md-2">
                    <ul className="list-group" width={'150px'} >
                        {requestContentType}
                    </ul>
                </div>
              </div>
              
              <p className={'text-'+color}><b>Response Content Type</b></p> 
              <div className="row">
                <div className="col-md-2">
                    <ul className="list-group" width={'150px'} >
                        {responseContentType}
                    </ul>
                </div>
              </div>
              <p className={'text-'+color}><b>Parameters</b></p> 
              <TableWrapper className={st} headers={ph} rows={pr}/>
              <p className={'text-'+color}><b>Response Messages</b></p>
              <TableWrapper className={st} headers={rh} rows={rr}/>
              <p className={'text-'+color}><b>Security</b></p>
              <div key="sr">{sr}</div>
            </div>
        </div>
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
                <DivWrapper key='verb'>
                    {this.operation(operation,verb, color[verb], this.props.name+'-info' )}
                </DivWrapper>
                ) ;
        }
    } , this) ;


    return (
        <DivWrapper key={divid}>
            {operations}
        </DivWrapper>
    ) ;
  }
});


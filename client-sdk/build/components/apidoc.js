
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
* config: object | Api Configuration from common.js 
* 
*
* Sample
* ------------------------------------------------------
*    //var config is defined in common.js
*    
*    <ApiDoc config={config}>
*         <ApiComponent1 info={true}/>
*         <ApiComponent2 info={true}/>
*         ...
*     </ApiDoc>
*
*
*//////////////////////////////////////////////////////



var ApiDoc = React.createClass({displayName: "ApiDoc",
    
    mixins: [
        traceMixIn     //uses log()
    ],  
    
    
    getDefaultProps: function() {
        return {
            children: [] 
        } ;
    },
    
    render: function() {
        this.log('rendering apidoc...',this.props.config) ;

        var config = this.props.config ;
    
        var tags = null ;
        if (config.tags) {
            tags = config.tags.map(function(tag) {
        
                if (tag.description) {
                var description = tag.description ;
                var docs = tag.externalDocs ;
                var documentation = '' ;
                try {
                    description = ': '+description ;
                    if (docs.description) { documentation = docs.description ; }
                    if (docs.url) documentation = React.createElement("a", {href: docs.url}, documentation)
                } catch(e) {} ;
                return (React.createElement(DivWrapper, {key: 'tag-'+tag.name}, 
                    React.createElement("p", null, React.createElement("b", null, "•", ' '+tag.name), description, React.createElement("br", null), 
                    documentation
                    )
                )) ;
                } else { 
                    return 
                        (React.createElement(DivWrapper, {key: "tag"})) ; 
                }
            }) ;
            tags = React.createElement(DivWrapper, {key: "tags"}, 
                        React.createElement("hr", null), 
                        React.createElement("h5", null, "API Tags"), 
                         tags, React.createElement("br", null)
                    ) ;
        }
        var header = null ;
        var documentation = null ;
        var mailto = 'mailto:'+config.info.contact.email ;
        if (config.externalDocs) {
            if (config.externalDocs.description) {
                if (config.externalDocs.url) { config.externalDocs.url = '#' ; }
                documentation = React.createElement("p", null, React.createElement("h5", null, "Documentation:"), " ", config.externalDocs.description, " (", React.createElement("a", {href: config.externalDocs.url}, "link"), ")")  ;
                             
            }
        }

        header = React.createElement(DivWrapper, {key: 'api-info-header'}, 
                     React.createElement("h3", null, config.info.title, " | ", config.info.version), 
                     React.createElement("p", null, config.info.description), 
                     documentation, 
                     React.createElement("a", {href: mailto}, "Contact the developer"), React.createElement("br", null), 
                     React.createElement("hr", null), 
                     React.createElement("h5", null, "License"), React.createElement("a", {href: config.info.license.url}, config.info.license.name), React.createElement("br", null), React.createElement("br", null), 
                     React.createElement("hr", null), 
                     React.createElement("p", null, React.createElement("h5", null, "Schemes"), ' '+config.schemes.join(', ')), React.createElement("br", null), 
                     tags
                 ) ;

        var operations = null ;
 
        return (
            React.createElement(DivWrapper, {key: "api-doc"}, 
                header, 
                this.props.children
            )
        )
            
    }
}) ;
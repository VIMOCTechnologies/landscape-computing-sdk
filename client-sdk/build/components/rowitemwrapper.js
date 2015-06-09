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


var DivWrapper = React.createClass({displayName: "DivWrapper",
    render: function() {
           
       return (
           React.createElement("div", null, 
                this.props.children
            )
       )
    }
                   
}) ; 

var FormFieldGenerator = React.createClass({displayName: "FormFieldGenerator",
    render: function() {
        
    return (
        React.createElement("tr", {height: this.props.height}, 
            React.createElement("td", {width: this.props.width}, this.props.label), 
            React.createElement("td", null, React.createElement("input", {className: "form-control", 
                        type: this.props.type, 
                        value: this.props.value, 
                        onChange: this.props.handler, ref: this.props.variable})
            )
        )

    )
    }
    
}) ;

var FormGenerator = React.createClass({displayName: "FormGenerator",
    render: function() {
        
        return (
        React.createElement("form", {className: "inputForm", onSubmit: this.props.submit}, 
          React.createElement("table", null, React.createElement("tbody", null, 
            
                this.props.fields.map( function(f) {
                    return (
                        React.createElement(FormFieldGenerator, {key: f.label.trim(), height: f.height, width: f.width, 
                                            label: f.label, value: f.value, type: f.type, variable: f.variable, 
                                            handler: f.handler})
                    ) ;
                })
            
          )), 
          React.createElement("br", null), 
          React.createElement("input", {className: "btn btn-primary", type: "submit", value: "submit"})
        )
    ) ;
    }
    
}) ;

var RowItemWrapper = React.createClass({displayName: "RowItemWrapper",
    render: function() {
        var i = 0 ; 
        return (React.createElement("tr", null, this.props.value.map(function(row) {
            return (React.createElement(ColumnItemWrapper, {key: i++, value: row})) ;
        }))) ;
    }
});


var ColumnItemWrapper = React.createClass({displayName: "ColumnItemWrapper",
    render: function() {
        return (React.createElement("td", null, this.props.value)) ;
    }
});

var HeaderItemWrapper = React.createClass({displayName: "HeaderItemWrapper",
    render: function() {
        return (React.createElement("th", null, this.props.value)) ;
    }
});

var LiItemWrapper = React.createClass({displayName: "LiItemWrapper",
    render: function() {
        if (this.props.className) return (React.createElement("li", {className: this.props.className, value: this.props.value}, this.props.label)) ;
        return (React.createElement("li", {value: this.props.value}, this.props.value)) ;
    }
});

var TableWrapper = React.createClass({displayName: "TableWrapper",
    
    render: function() {
        var st = null ;
        var rows = this.props.rows ;
        if (rows === undefined) rows = this.props.children ;
        return (
            React.createElement("table", {className: this.props.className}, 
               React.createElement("thead", null, 
                  React.createElement("tr", null, this.props.headers)
               ), 
               React.createElement("tbody", null, 
                rows
               )
            ) 
        ) ;
    }
}) ;


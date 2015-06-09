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


var DivWrapper = React.createClass({
    render: function() {
           
       return (
           <div>
                {this.props.children}
            </div>
       )
    }
                   
}) ; 

var FormFieldGenerator = React.createClass({
    render: function() {
        
    return (
        <tr height={this.props.height}>
            <td width={this.props.width}>{this.props.label}</td>
            <td><input  className="form-control" 
                        type={this.props.type} 
                        value={this.props.value} 
                        onChange={this.props.handler} ref={this.props.variable} />
            </td>
        </tr>

    )
    }
    
}) ;

var FormGenerator = React.createClass({
    render: function() {
        
        return (
        <form className="inputForm" onSubmit={this.props.submit}>
          <table><tbody>
            {
                this.props.fields.map( function(f) {
                    return (
                        <FormFieldGenerator key={f.label.trim()} height={f.height} width={f.width} 
                                            label={f.label} value={f.value} type={f.type} variable={f.variable}
                                            handler={f.handler}/>
                    ) ;
                })
            }
          </tbody></table>
          <br/>
          <input className="btn btn-primary" type="submit" value="submit" />
        </form>
    ) ;
    }
    
}) ;

var RowItemWrapper = React.createClass({
    render: function() {
        var i = 0 ; 
        return (<tr>{this.props.value.map(function(row) {
            return (<ColumnItemWrapper key={i++} value={row}/>) ;
        })}</tr>) ;
    }
});


var ColumnItemWrapper = React.createClass({
    render: function() {
        return (<td>{this.props.value}</td>) ;
    }
});

var HeaderItemWrapper = React.createClass({
    render: function() {
        return (<th>{this.props.value}</th>) ;
    }
});

var LiItemWrapper = React.createClass({
    render: function() {
        if (this.props.className) return (<li className={this.props.className} value={this.props.value}>{this.props.label}</li>) ;
        return (<li value={this.props.value}>{this.props.value}</li>) ;
    }
});

var TableWrapper = React.createClass({
    
    render: function() {
        var st = null ;
        var rows = this.props.rows ;
        if (rows === undefined) rows = this.props.children ;
        return (
            <table className={this.props.className}>
               <thead>
                  <tr>{this.props.headers}</tr>
               </thead>
               <tbody>
                {rows} 
               </tbody> 
            </table> 
        ) ;
    }
}) ;


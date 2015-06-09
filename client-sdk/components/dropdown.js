
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


var DropDown = React.createClass({

    getInitialState: function(){
        return { 
            selected: 0 
        };
    },

    clicked: function(index){
        this.setState({
            selected: index
        });
        this.props.notify(this.props.values[index]) ;
    },
    
    selected: function() {
        return this.props.values[this.state.selected] ;
    },

    render: function() {

        var self = this ;
        var i = 0 ;
        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true" >
                  {this.props.title}
                </button>
                <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">{ this.props.items.map(function(m, index){
                    return <li key={i++} role="presentation" onClick={self.clicked.bind(self, index)}>{m}</li>;
                }) }
                </ul>
            </div>
        );
    }
});



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




/* ------------------------------------------------------
 * Form components are provided as a place holder
 * for your application.
 * It is not expected that you will be using them
 * or customizing them
 * ------------------------------------------------------
 *//////////////////////////////////////

var ZoneForm = React.createClass({

    propTypes: {},
    mixins : [
        traceMixIn
        ],
    
    getDefaultProps: function() {
        return { 
            zone: "pa_1",
            map: false,
        } ;
    },

    getInitialState: function() {
        var zone = this.props.zone ;
     return {
        zone: zone,
        map: false,
        submit: true
      };
    },

    handleInputChange: function(key, event) {
        var partialState = {};
        this.setState({submit: false}) ;
        if (key === 'map' ) {
            partialState = { map: !this.state.map} ;
        } else {
            partialState[key] = event.target.value; 
        }
        this.setState(partialState);
    },
    
    handleSubmit: function(e) {
      e.preventDefault();
      var zone = React.findDOMNode(this.refs.zone).value.trim();
      this.setState({zone: zone, submit: true}) ;
      return ;
    },

    render: function() {
        this.trace('rendering zoneform....') ;

        var results = null ;
               
        if (this.state.submit) {
            results = <Zones 
                         zone={this.state.zone} 
                         map={this.state.map}
                      />
            
        }
        
        return (
            <div className="zone-form">
                <div className="jumbotron">
                    <div className="container">
                        <form onSubmit={this.handleSubmit}>
                          <div className="form-group">
                            <label>Zone</label>
                            <input type="text" className="form-control" id="zone" value={this.state.zone} onChange={this.handleInputChange.bind(null, 'zone')} ref="zone" />
                          </div>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" id = "map" value={this.state.map} onChange={this.handleInputChange.bind(null, 'map')} ref="map" />
                           Map</label>
                          </div>
                          <button type="submit" className="btn btn-primary" value="submit">Submit</button>
                       </form>
                    </div>
                </div>
                {results}
            </div>
        ) ;
    }
}) ;




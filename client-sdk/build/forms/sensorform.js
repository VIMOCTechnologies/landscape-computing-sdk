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


var SensorForm = React.createClass({displayName: "SensorForm",

    propTypes: {},
    mixins : [
        configMixIn,
        traceMixIn
        ],
    
    getDefaultProps: function() {
        return { 
            sensor: "pa_1_P1",
            map: false
        } ;
    },

    getInitialState: function() {
        var sensor = this.props.sensor ;
     return {
        sensor: sensor,
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
      var sensor = React.findDOMNode(this.refs.sensor).value.trim();
      this.setState({sensor: sensor, submit: true}) ;
      return ;
    },

    render: function() {
        console.log('rendering sensorform....') ;

        var results = 
                React.createElement("div", null) 
            ;
        if (this.state.submit) {
            results = React.createElement(Sensors, {
                         sensor: this.state.sensor, 
                         map: this.state.map}
                      ) ;
            
        }
        
        return (
            React.createElement("div", {className: "sensor-form"}, 
                React.createElement("div", {className: "jumbotron"}, 
                    React.createElement("div", {className: "container"}, 
                        React.createElement("form", {onSubmit: this.handleSubmit, role: "form"}, 
                          React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", null, "Sensor"), 
                            React.createElement("input", {type: "text", className: "form-control", id: "sensor", value: this.state.sensor, onChange: this.handleInputChange.bind(null, 'sensor'), ref: "sensor"})
                          ), 
                          React.createElement("div", {className: "checkbox"}, 
                            React.createElement("label", null, 
                              React.createElement("input", {type: "checkbox", id: "map", value: this.state.map, onChange: this.handleInputChange.bind(null, 'map'), ref: "map"}), 
                           "Map")
                          ), 
                          React.createElement("button", {type: "submit", className: "btn btn-primary", value: "submit"}, "Submit")
                       )
                    )
                ), 
                results
            )
        ) ;
    }
}) ;




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


var ZoneQueryForm = React.createClass({displayName: "ZoneQueryForm",

    propTypes: {},
    mixins : [
        traceMixIn
        ],
    
    getDefaultProps: function() {
        return { 
            zone: "pa_1",
            query: "occupied",
            map: false,
            //private props
            queries : ['summary-daily', 
                        'occupiedcount', 
                        'occupiedpercent', 
                        'avgduration', 
                        'turnover', 
                        'vacancy',
                        'parkingsummary'
                      ] 

        } ;
    },

    getInitialState: function() {
        var zone = this.props.zone ;
        var query = this.props.query ;

     return {
        zone: zone,
        query: query,
        map: false,
        submit: false,
        queried: false
      };
    },
    
    selectedQuery: function(query) {
        this.setState({query: query, submit: false}) ;
    },

    handleInputChange: function(key, event) {
      var partialState = {};
      this.setState({submit: false}) ;
      partialState[key] = event.target.value; 
      this.setState(partialState);
    },
    
    handleSubmit: function(e) {
        e.preventDefault();
        var zone = React.findDOMNode(this.refs.zone).value.trim();
        this.setState({zone: zone, queried: true, submit: true}) ;
        return ;
    },

    render: function() {
        this.trace('rendering zonequeryform....') ;

        var results = null ;
    
        if (this.state.submit) {
            results = 
                React.createElement(ZoneQueries, {
                     zone: this.state.zone, 
                     query: this.state.query}
                )   ;
        }
                              
        return (
            React.createElement("div", {className: "zonequery-form"}, 
                React.createElement("div", {className: "jumbotron"}, 
                    React.createElement("div", {className: "container"}, 
                        React.createElement("form", {onSubmit: this.handleSubmit, role: "form"}, 
                            React.createElement("div", {className: "container"}, 
                               React.createElement("div", {className: "form-group"}, 
                                React.createElement("label", null, "Sensor"), 
                                React.createElement("input", {type: "text", className: "form-control", id: "zone", value: this.state.zone, onChange: this.handleInputChange.bind(null, 'zone'), ref: "zone"})
                              ), 
                              React.createElement("div", {className: "form-group"}, 
                              React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {width: "150px"}, 
                                React.createElement(DropDown, {
                                items: this.props.queries, 
                                values: this.props.queries, 
                                title: "Select a query...", 
                                notify: this.selectedQuery})), React.createElement("td", null, 
                              React.createElement("label", null, this.state.query)))))
                              ), 
                              React.createElement("div", {className: "form-group"}, 
                              React.createElement("button", {type: "submit", className: "btn btn-primary", value: "submit"}, "Submit")
                              )
                            )
                       )
                    )
                ), 
                React.createElement("div", {id: "zonequeryresult-container"}, 
                results
                )
            )
        ) ;
    }
}) ;




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
 * View components are meant to be fully customized.  
 * The current code is only provided as a sample to
 * illustrate the contract between the API Component
 * and the corresponding View component
 * ------------------------------------------------------
 *
 *
 * ZoneQueryView properties
 * ----------------------------------------------------- 
 * zone: string | guid of the zone 
 * stats: array of gps coordinates [ "lat,long",...]
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 *      zone: "pa_1",
 *      stats: [
 *           { 
 *               readingData: "0.62", 
 *               readingId: "calculated",
 *               readingTime: "2015-05-22T19:42:53-0400",
 *               zoneId: "1"*}     
 *      ],
 *      maps: false,
 *      short: short,
 *
 *
 *//////////////////////////////////////////////////////
 
 


var ZoneQueryView = React.createClass({displayName: "ZoneQueryView",
    
    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    
    getDefaultProps: function() {
        return {
            zone: '',
            stats: [],
            map: true,
            short: false
        }
    },

    render: function() {
        this.trace('rendering zonequeryview...') ;
        
        var results = null ;
        
        var rows = null ;
        var i = 0 ;
        var sensorState = this.props.stats.sensorState ;
        
        if (sensorState) {
            rows = sensorState.map(function(row) {
                var key = this.props.zone+'-'+this.props.query+'-'+i ;
                i++ ;
                return (
                    React.createElement(QueryDataListItemWrapper, {
                        key: key, 
                        data: row.readingData, 
                        time: row.stateChangeTime, 
                        id: i-1, 
                        sensor: row.sensorId})
                    ) ;
            }, this) ;
        } else {
            rows = this.props.stats.map(function(row) {
                var key = this.props.zone+'-'+this.props.query+'-'+i ;
                i++ ;
                return (
                    React.createElement(QueryDataListItemWrapper, {
                        key: key, 
                        data: row.readingData, 
                        time: row.readingTime, 
                        id: row.readingId, 
                        sensor: row.sensorId})
                    ) ;
            }, this) ;
        }
        
        var divid = zone+'-stats';
        if (this.props.short) {
            var querySet1 = ['occupiedcount', 
                             'occupiedpercent'] ;
            if (querySet1.indexOf(this.props.query) != -1 ) {
                results =
                    React.createElement(DivWrapper, {key: divid+'-'+this.props.query}, 
                      this.props.stats[0].readingData + ' ('+this.props.stats[0].readingTime+')'
                    ) ;
            } 
            if (this.props.query === 'summary') {
                results =
                    React.createElement(DivWrapper, {key: divid+'-'+this.props.query}, 
                      "Average Duration:", this.props.stats[0].readingData + 'min ('+this.props.stats[0].readingTime+')', React.createElement("br", null), 
                      "Turnover: ", this.props.stats[1].readingData + ' ('+this.props.stats[1].readingTime+')', React.createElement("br", null), 
                      "Vacancy Percentage: ", this.props.stats[2].readingData + '% ('+this.props.stats[2].readingTime+')', React.createElement("br", null)
                    ) ;
            } 
            var querySet2 = ['summary-daily', 
                             'avgduration', 
                             'turnover', 
                             'vacancy'] ;
            if (querySet2.indexOf(this.props.query) != -1 ) {
                //TODO
                //this is an array, what do we do? 
                results =
                    React.createElement(DivWrapper, {key: divid+'-'+this.props.query}, 
                      this.props.stats[0].readingData + ' ('+this.props.stats[0].readingTime+')'
                    ) ;
            } 
        
        } else {
             results = 
                React.createElement(DivWrapper, {key: divid}, 
                     React.createElement("table", {className: "table table-hover"}, 
                     React.createElement("thead", null, 
                      React.createElement("tr", null, 
                         React.createElement("th", null, "Reading"), 
                         React.createElement("th", null, "Type"), 
                         React.createElement("th", null, "Timestamp"), 
                         React.createElement("th", null, "Sendor ID")
                      )
                     ), 
                     React.createElement("tbody", null, 
                     rows
                     )
                     )
                );
        }
        
        return (
            React.createElement(DivWrapper, {key: "zone-query-data"}, 
                  results
            ) 
        );
    
    }
}) ;
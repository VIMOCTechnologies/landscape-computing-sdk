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



/*
 * copyright statement
 *
 *//////////////////////

/* Description 
 * ------------------------------------------------------
 * View components are meant to be fully customized.  
 * The current code is only provided as a sample to
 * illustrate the contract between the API Component
 * and the corresponding View component
 * ------------------------------------------------------
 *
 *
 * SensorQueryView properties
 * ----------------------------------------------------- 
 * sensor: string | description of the zone 
 * stats: array of objects | statistics for a given query 
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 * short: boolean | whether the short view should be rendered
 *
 * Sample Data
 * ------------------------------------------------------
 *      sensor: "pa_1_P1",
 *      stats: [
 *          { 
 *              readingData: "15.54",
 *              readingId: "calculated",
 *               readingTime: "2015-05-22T19:48:51-0400",
 *               sensorId: "pa_1_P1" 
 *          } 
 *      ],
 *      map: false,
 *      short: false,
 *
 *
 *
 *//////////////////////////////////////////////////////
 
 


var SensorQueryView = React.createClass({
    
    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    
    getDefaultProps: function() {
        return {
            sensor: '',
            stats: [],
            map: true,
            short: false
        }
    },

    render: function() {
        this.trace('rendering sensorqueryview...') ;
        var results = null ;
        var sensor = this.props.sensor ;
        
        var rows = null ;
        var i = 0 ;
        rows = this.props.stats.map(function(row) {
            var key = this.props.sensor+'-'+this.props.query+'-'+i ;
            i++ ;
            return (
                <QueryDataListItemWrapper   key={key} data={row.readingData} time={row.readingTime}
                                            id={row.readingId} sensor={row.sensorId} />
                ) ;
         }, this) ;
        
        var divid = sensor+'-stats';
        if (this.props.short) {
            var querySet1 = ['occupied','duration','avgduration','turnover','vacancy','latestvalue'] ;
            if (querySet1.indexOf(this.props.query) != -1 ) {
                results =
                    <DivWrapper key={divid+'-'+this.props.query}>
                      {this.props.stats[0].readingData + ' ('+this.props.stats[0].readingTime+')'}
                    </DivWrapper> ;
            } 
            if (this.props.query === 'summary') {
                results =
                    <DivWrapper key={divid+'-'+this.props.query}>
                      Average Duration:{this.props.stats[0].readingData + 'min ('+this.props.stats[0].readingTime+')'}<br/>
                      Turnover: {this.props.stats[1].readingData + ' ('+this.props.stats[1].readingTime+')'}<br/>
                      Vacancy Percentage: {this.props.stats[2].readingData + '% ('+this.props.stats[2].readingTime+')'}<br/>
                    </DivWrapper> ;
            } 
            var querySet2 = ['parks','avgduration-daily','peoplecount'] ;
            if (querySet2.indexOf(this.props.query) != -1 ) {
                //TODO
                //this is an array, what do we do? 
                results =
                    <DivWrapper key={divid+'-'+this.props.query}>
                      {this.props.stats[0].readingData + ' ('+this.props.stats[0].readingTime+')'}
                    </DivWrapper> ;
            } 
        
        } else {
             results = 
                <DivWrapper key={divid}>
                     <table className="table table-hover">
                     <thead>
                      <tr>
                         <th>Reading</th>
                         <th>Type</th>
                         <th>Timestamp</th>
                         <th>Sendor ID</th>
                      </tr>
                     </thead>
                     <tbody>
                     {rows}
                     </tbody>
                     </table>
                </DivWrapper>;
        }
        
        return (
            <DivWrapper key="sensor-query-data">
                  {results}
            </DivWrapper> 
        );
    }
}) ;

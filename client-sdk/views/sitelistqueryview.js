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
 * Properties
 * ----------------------------------------------------- 
 * stats: array of summary data (see structure below) 
 * short: boolean | whether or not the view should render
 *                  in short mode
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 * [ 
 *      { 
 *           duration: "14", 
 *           occupied: "0", 
 *           sensor: "pa_2_P28"
 *       }, ...
 *  ]
 *
 *
 *
 *
 *//////////////////////////////////////////////////////

var SiteListQueryView = React.createClass({

    mixins: [
        
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],    
    
    getDefaultProps: function() {
        return {
            stats: [],
            short: false,
            map: false 
        }
    },
    
    render: function() {
        this.trace('rendering sitelist....') ;
    
        var results = null ;
        
        var rows = null ;
        var i = 0 ;
        rows =  this.props.stats.map(function(row) {
                        var key = this.props.site+'-'+this.props.query+'-'+i ;
                        i++ ;
                        return (
                            // Not optimal to reuse the DataRender for a different
                            // data structure
                            <QueryDataListItemWrapper   key={key} 
                                                        data={row.occupied} 
                                                        time={row.duration}
                                                        id="" 
                                                        sensor={row.sensor} />
                        ) ;
                    }, this) ;
        
        
        var divid = site+'-stats';
        if (this.props.short) {
            return (<p>There is no short view for this dataset </p>) ;
        } else {
             var i = 0 ;
             var headers = ['Occupied (0|1)','','Duration','Sensor'] ;
             headers = headers.map(function(h) {
                 return ( <HeaderItemWrapper key={divid+'-'+i++} value={h} />)
             }) ;
             return ( 
                    <TableWrapper key={divid} className="table table-hover"
                        headers={headers}
                        rows={rows} /> ) ;
                    
        }
    }
}) ;
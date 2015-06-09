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
 * Expected Site properties
 * ----------------------------------------------------- 
 * sites: array of site object (see views/site.js )
 *
 * Sample Data
 * ------------------------------------------------------
 *      [ 
 *        { 
 *           description: "Palo Alto",
 *           guid: "pa",
 *           id: "pa",
 *           timeZone: "America/Los_Angeles",
 *           gpsCoord: ["37.444506, -122.160745" , "37.445271, -122.16207"],
 *           zones: [ ... see view/zone.js ...]
 *         }, ...
 *       ]
 *
 *//////////////////////////////////////////////////////


var SiteListView = React.createClass({
    
    mixins: [
        
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],    

    getDefaultProps: function() {
        return {
            sites: [],
            map: false 
        }
    },
    
    render: function() {
        this.trace('rendering sitelist....') ;

        var rows = this.props.sites.map( function(site) {
                return (
                    <DivWrapper key={site.id+'sitelist-row'}>
                            <b>{site.description}</b><br/>
                            Id: {site.id}<br/>
                            Location: {site.gpsCoord.join(' | ')}<br/>
                            Time zone: {site.timeZone}
                        <br/><br/><br/>
                    </DivWrapper>
                    )
            }) ;
        
        return (
                <DivWrapper key={'sitelist'}>
                    {rows}
                </DivWrapper>
         ) ;
    }
}) ;

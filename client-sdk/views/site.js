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
 * description: string | description of the zone 
 * id: string | local id of the zone (unique within the zone)
 * guid: string | guid of the zone 
 * gpsCoord: array of gps coordinates [ "lat,long",...]
 * timeZone: string | time zone of the site
 * zones: array of Zone elements (see views/zone.js)
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 *      description: "Palo Alto",
 *      guid: "pa",
 *      id: "pa",
 *      timeZone: "America/Los_Angeles",
 *      gpsCoord: ["37.444506, -122.160745" , "37.445271, -122.16207"],
 *      zones: [ ... see view/zone.js ...]
 *
 *
 *//////////////////////////////////////////////////////

var SiteView = React.createClass({
    
    mixins: [
        
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],    

    getDefaultProps: function() {
        return {
            sites:[],
            zones: [],
            gpsCoord: [],
            map: false 
        }
    },
    
    render: function() {
        this.trace('rendering site....') ;

        if (this.props.sites.length>0) {
            return (<SiteListView sites={this.props.sites} />) ;
        } else 
        
        var points = null ; 
        var coord = this.props.gpsCoord ;

        var center = [0,0] ;

        var mapView = null ;
        
        if (coord !== undefined) {
            if (coord.length>0) {
                center = this.center([coord[0].split(','),coord[1].split(',')]) ;
                points = [
                           {latitude:center[0],longitude:center[1],title:this.props.description}
                         ] ;

                // Zones could be rendered here as well to give an overview of the site
                // var polygon = [
                //         [37.444506, -122.160745],
                //         [37.445026, -122.160255],
                //         [37.445126, -122.160435],
                //         [37.444626, -122.160935]
                //     ] ;
                if (this.props.map) {
                    
                    mapView = 
                        <Map key={'google-map-site'+this.props.id} 
                              latitude={center[0]} longitude={center[1]} 
                              zoom={18} 
                              mapTypeId='sat'
                              width={500} 
                              height={250} 
                              markers={points}
                              //polygons={polygon}
                              /> ;
        
                
                    return (
                        <DivWrapper key={this.props.id+'-site-map'}>
                            {mapView}
                        </DivWrapper>
                        )            
                }
            }
        }
        
        var zoneItems = <ZoneItems key={this.props.id+'-zones'} 
                                zones={this.props.zones} /> ;
                                
        return (
            <TableWrapper key={this.props.id+'-site'} className={'table table-hover'}>      
               <RowItemWrapper key={this.props.id+'-des'} value={['Description:',this.props.description]}/>
               <RowItemWrapper key={this.props.id+'-id'} value={['Id:',this.props.id]}/>
               <RowItemWrapper key={this.props.id+'-gps'} value={['Location:',this.props.gpsCoord.join(' | ')]}/>
               <RowItemWrapper key={this.props.id+'-time'} value={['Time zone:',this.props.timeZone]}/>
               <RowItemWrapper key={this.props.id+'-zones-root'} value={['Zones:',zoneItems]}/>
            </TableWrapper>
         ) ;
    }
}) ;

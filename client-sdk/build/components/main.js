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


//Forms
        React.render(
            React.createElement(SiteForm, {
                site: "pa"}
             ),
            document.getElementById('sites-form-container')
        ) ;
        React.render(
            React.createElement(ZoneForm, {
                zone: "pa_1"}
             ),
            document.getElementById('zones-form-container')
        ) ;

        React.render(
            React.createElement(SensorForm, {
                sensor: "pa_1_P1"}
             ),
            document.getElementById('sensors-form-container')
        ) ;

        React.render(
            React.createElement(SensorQueryForm, {
                sensor: "pa_1_P1", 
                query: "occupied"}
             ),
            document.getElementById('sensorqueries-form-container')
        ) ;

        React.render(
            React.createElement(ZoneQueryForm, {
                sensor: "pa_1", 
                query: "occupiedcount"}
             ),
            document.getElementById('zonequeries-form-container')
        ) ;

 
//API Documentation
        React.render(
            React.createElement(ApiDoc, {config: config}, 
                React.createElement(SiteList, {info: true}), 
                React.createElement(Sites, {info: true}), 
                React.createElement(SiteQueries, {info: true}), 
                React.createElement(Zones, {info: true}), 
                React.createElement(ZoneQueries, {info: true}), 
                React.createElement(Sensors, {info: true}), 
                React.createElement(SensorQueries, {info: true})
            )
            ,
            document.getElementById('api-descriptor-container')
        ) ;

        
//Raw components 
        React.render(
          React.createElement(SiteList, null),
          document.getElementById('sitelist-container')
        );   
         
 
        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "occupied"}
             ),
            
          document.getElementById('sensorqueries-container1')
        );        

        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "summary"}
             ),
            
          document.getElementById('sensorqueries-container2')
        );        

        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "avgduration"}
             ),
            
          document.getElementById('sensorqueries-container3')
        );        

        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "avgduration-daily"}
             ),
            
          document.getElementById('sensorqueries-container4')
        );        

        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "duration"}
             ),
            
          document.getElementById('sensorqueries-container5')
        );        

        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "turnover"}
             ),
            
          document.getElementById('sensorqueries-container6')
        );        
        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "parks"}
             ),
            
          document.getElementById('sensorqueries-container7')
        );        
        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_1_P1", 
                query: "vacancy"}
             ),
            
          document.getElementById('sensorqueries-container8')
        );        
        React.render(
          React.createElement(SensorQueries, {
                sensor: "pa_3_PC1BI", 
                query: "peoplecount"}
             ),
            
          document.getElementById('sensorqueries-container9')
        );        

    
        React.render(
          React.createElement(ZoneQueries, {
            zone: "pa_1", 
            query: "summary-daily"}
             ),
            
          document.getElementById('zonequeries-container1')
        );        
    
        React.render(
        React.createElement(ZoneQueries, {
                zone: "pa_1", 
                query: "occupiedcount", 
                params: {date: "2015-05-05T00:00:00"}}
            ),
            
          document.getElementById('zonequeries-container2')
        );        
    
        React.render(
          React.createElement(ZoneQueries, {
                zone: "pa_1", 
                query: "occupiedpercent"}
             ),
            
          document.getElementById('zonequeries-container3')
        );        
    
        React.render(
          React.createElement(ZoneQueries, {
                zone: "pa_1", 
                query: "avgduration"}
             ),
            
          document.getElementById('zonequeries-container4')
        );        
    
        React.render(
          React.createElement(ZoneQueries, {
                zone: "pa_1", 
                query: "turnover"}
             ),
            
          document.getElementById('zonequeries-container5')
        );        
    
        React.render(
          React.createElement(ZoneQueries, {
                zone: "pa_1", 
                query: "vacancy"}
             ),
            
          document.getElementById('zonequeries-container6')
        );        
    
        React.render(
          React.createElement(SiteQueries, {
                site: "pa", 
                query: "summary"}
             ),
            
          document.getElementById('sitequeries-container1')
        );        
    

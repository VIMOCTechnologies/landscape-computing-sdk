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




// queryParameter function:
// Credit StackOverflow - user187291
// http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
var queryParameters = function(obj) {
    var str = [];
    for(var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])) ;
        }
    }
    return str.join("&");
} ;

// The SDK's config is mounted via a MixIn 
// rather than being passed as props
var configMixIn = { config: config} ;

// This is a simple login framework
var traceMixIn = {
    
    debug: true,
    
    trace: function(message) {
        if (this.debug) { 
            if (message !== null) { 
                console.log('[TRACE] '+message) ;
            }
        }
    },
    
    log: function(message, object) {
        if (this.debug) { 
            this.trace(message) ;
            console.log(object) ; 
        }
        return ;
    },
    
    error: function(message, object) {
        if (message === null) { message = '' ; }
        console.log('[ERROR] '+message) ;
        this.log(null,object) ;
        return ;
    },
    
    warning: function(message, object) {
         if (message === null) { message = '' ; }
         console.log('[WARNING] '+message) ;
         this.log(null,object) ;
         return ;
    }
}

var geoMixIn = { 
    
    // Calculates the average center of a series of points (lat,long)
    center: function (gpsCoord) {
        var centerLat = 0 ;
        var centerLong = 0 ;
        var k = 0 ;
        
        if (gpsCoord === undefined) { 
            console.log('[WARNING] gpsCoord is undefined'+gpsCoord) ;
            return [37.429167,-122.138056] ; 
        }
        for (var i = 0 ; i < gpsCoord.length ; i++ ) {
                var pt = gpsCoord[i] ;
                if ((pt[0] === undefined) || (pt[1] === undefined)) { 
                    console.log('[WARNING]  pt is undefined:'+gpsCoord) ;
                    return [37.429167,-122.138056] ;
                }
                centerLat += Number(pt[0]) ;
                centerLong += Number(pt[1]) ;
                k++ ;
        }
        if (k>0) {
            centerLat /= k ;
            centerLong /= k ;
        } else {
            centerLat = 37.429167 ;
            centerLong = -122.138056 ;
        }
        return [centerLat,centerLong] ;
    }
} ;

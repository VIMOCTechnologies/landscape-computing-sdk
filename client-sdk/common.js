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



var config = {
	host: "54.79.0.180:9080", 
	basePath: "/api/rest/v1",
    info: {
      description: "This API provides access to all sensor information and statistics",
      version: "1.0.0",
      title: "VIMOC Smart City API",
      
      termsOfService: "VIMOC Terms of service",
      contact: {
          email: "dev@landscape-computing.com"
      },
      license: {
          name: "Apache 2.0",
          url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    tags: [
    {
        "name": "parking",
        "description": "The API to our parking zones",
        "externalDocs": {
            "description": "VIMOC's API Documentation",
            "url": "http://www.vimoctechnologies.com/documentation.html"
        }
    },
    {
        "name": "Traffic",
        "description": "Our new API to access pedestrian and bicycle traffic"
    }],
    schemes: [
        "http"
    ],
    externalDocs: {
        "description": "Find out more about the VIMOC API here",
        "url": "http://www.vimoctechnologies.com/documentation.html"
    }
} ; 

# VIMOC API SDK

This repository contains the code of the VIMOC API sdk.

## client-sdk

The client SDK comes as a set of React.js components that query the VIMOC API:

* **Entity Information**
 	- Sites
 	- Zones
 	- Sensors

* **Entity Statistics**
 	- SiteQueries
 	- ZoneQueries
 	- SensorQueries

The console.html provides an example of how these components can be used. In a nutshell, a react.js component "mounts" on a DOM node. This means that the VIMOC client SDK can be used with pretty much any Web App architecture. 

First we need to identify a DOM node where the component will display its output:
```
<div id="zonequeries-container">
    component/zonequeries.js  //This is just a place holder that will be displayed if react.js 
                              //is not installed prolerly 
</div>
```

Then we simply need to render the component with a simple JSX statement:

```
<script type="text/jsx"> 

    React.render(

    <ZoneQueries 
        zone="pa_1" 
        query="occupiedcount"
        params={{date: "2015-05-05T00:00:00"}}
        config={config}
         />,
        
      document.getElementById('zonequeries-container2')

    );        

</script>
```

The file common.js contains all the information to reach the VIMOC API (via a reverse proxy):

```
var config = {
	host: "YOUR-HOST:8080", 
	basePath: "/api/rest/v1",
    info: {
      description: "This API provides access to all sensor information and statistics",
      version: "1.0.0",
      title: "VIMOC Smart City API",
      
      termsOfService: "VIMOC Terms of service",
      contact: {
          email: "apiteam@vimoctechnologies.com"
      },
      license: {
          name: "Apache 2.0",
          url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      }
    }
} ; 
```

That's it!

## reverse-proxy

It is advised to use a reverse-proxy to access the VIMOC API to avoid having to expose the api key to potential attackers. Developers should secure access to the proxy with a user-based mechanism. Once a user is logged in, the client-sdk will be able to access the VIMOC API via the proxy. 

Any reverse proxy can be used. VIMOC provides a sample reverse proxy that runs on node.js.

To install the revere proxy simply type:

```
npm install
```

This command will install all the dependencies using npm (node package manager). 

The proxy configuation need to be updated with your parameters:
```
{
  "development" : {
      "vimoc_api_gateway": "http://api.landscape-computing.com",
      "api_key": "57c2f1f6ba4d8d6be602b51d9bd853f2",
      "proxy_port":9080,
      "dev":true 
  },
  
  "production" : { 
      "dev":false   
  }
}
```

You can specify several environments. Logs are available to all {dev: true} enviroments. Make sure you get your API key from VIMOC technologies.

You can then start the proxy with:

``` 
npm start
``` 

It is recommended to use [pm2](https://github.com/Unitech/pm2) to deploy the proxy in a production environment. 

## Sample App

The sample app is a single page application which delivers a "park me!" feature. When you are close to a zone, the app provides driving directions to a free parking spot. 

* index.html works without a GPS sensor and emulates a request in the Palo Alto site
* gps.html uses the device position to locate a partking spot nearby (Palo Alto, Los Gatos, Newcastle)

The main page collects the device position and instantiates a ZoneView component (zone.js). The ZoneView component gather data from the closest zone, and attemps to find a free spot using the parkingsummary query (ZoneQueries).

```
        <ZoneView
            zone={zone.guid}
            lat={userLatitude}
            long={userLongitude}
            latCenter={zoneLatitudeCenter}
            longCenter={zoneLongitudeCenter}
        />
```

ZoneView uses the Zones and ZoneQueries components of the SDK to fetch the data:

```
         <Zones key={this.props.zone}
             zone={this.props.zone}
             invisible={true}
             callback={this.handleZones}
         /> ;

         <ZoneQueries
             zone={this.props.zone}
             query="parkingsummary"
             callback={this.handleZoneSensors}
             invisible={true}
         /> ;
```


Once the ZoneView has found a spot, it instantiates a Directions component (directions.js) which display the driving directions between the current position of the driver and the parking spot. 

```
         if (parkingSpot.sensorId) {
                res = <Directions
                          key='map'
                          zoom={17}
                          latitude={this.props.lat}
                          longitude={this.props.long}
                          latCenter={this.props.latCenter}
                          longCenter={this.props.longCenter}
                          width={width}
                          height={height}
                          spot={parkingSpot}
                      /> ;
 	 }
```

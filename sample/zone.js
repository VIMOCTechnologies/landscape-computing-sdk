

/*
 * copyright statement
 * Copyright 2015 - VIMOC Technologies - All Rights Reserved
 *//////////////////////

/* Description 
 * ------------------------------------------------------
 * View components are meant to be fully customized.  
 * The current code is only provided as a sample to
 * illustrate the contract between the API Component
 * and the corresponding View component
 * ------------------------------------------------------
 *
 * The zone component can be used in two modes:
 * - passing an array of Zone elements
 * - passing an individual Zone element
 * 
 * When passing an array of Zone elements, the view is 
 * rendered as a ZoneTable with each row rendering 
 * individual Zone element. 
 *
 * Expected Zone properties
 * ----------------------------------------------------- 
 * description: string | description of the zone 
 * id: string | local id of the zone (unique within the zone)
 * guid: string | guid of the zone 
 * gpsCoord: array of gps coordinates [ "lat,long",...]
 * location: string | 
 * sensors: array of Sensor elements (see views/sensor.js)
 * map: boolean | whether the rendering should happen on a 
 *       map or not
 *
 * Sample Data
 * ------------------------------------------------------
 *      description: "Los Gatos Zone E",
 *      gpsCoord: [
 *          "37.2206992743, -121.9846208062",
 *          "37.2201222654, -121.9850708517",
 *          "37.2203511095, -121.9855621915",
 *          "37.2209174424, -121.9851104639"
 *      ],
 *      guid: "lg_2",
 *      id: "2",
 *      location: "Zone E",
 *      sensors: [ ... see view/sensor.js ...]
 *
 *
 *
 *
 *
 *//////////////////////////////////////////////////////
 
 

var ZoneView = React.createClass({
    
    mixins: [
        geoMixIn,      //uses center()
        traceMixIn     //uses log()
    ],  

    getInitialState: function() {
      return {
        spot: '',
        zoneRequested: false,
        sensorDataRequested: false,
        gotZone: false,
        gotSensor: false
      };
    },

    getDefaultProps: function() {
        return {
            spot: {},
            zones: [],
            sensors: [],
            displayMap: true
        }
    },


    handleZones: function(zone) {
        this.setState( {zone: zone, spot: '', zoneRequested: true, gotZone: true}) ;
    }, 
    
    handleSensor: function(sensor) {
        var occupied = (sensor[0].readingData === "true") ;
        if (!occupied) {
            this.trace(sensor[0].sensorId+' is not occupied') ;
            this.setState( {spot: sensor[0].sensorId, sensorDataRequested: true, gotSensor: true}) ;
         }
    },

    handleZoneSensors: function(sensorsummary) {
        var results = sensorsummary.sensorState ;
        var newState = {gotSensor: true} ;
        if (results) {
            for(var i = 0 ; i < results.length ; i++ ) {
                var sensor = results[i] ;
                var free = (sensor.readingData === "0") ;
                if (free) {
                    if (this.state.spot.length<1) {
                        this.trace(sensor.sensorId+' is free') ;
                        newState.spot = sensor.sensorId ;
                    }
                 }
            }
        }
        this.setState( newState ) ;
    },

    render: function() {
        this.trace('rendering zone...'+this.props.zone) ;
        var zones = null ;
        var res = '' ;
        var screenWidth = Math.min(480,$(document).width()) ;
        var searching = 
            <img className="center" src="searching.png" alt="searching" width={screenWidth}/> ; 

        if (!this.state.zoneRequested) {
            this.trace('fetching zone data') ;
            res = 
                <Zones key={this.props.zone}
                    zone={this.props.zone}  
                    invisible={true}
                    callback={this.handleZones}
                /> ;
        } else {
            if (this.state.zone) {
                if (!this.state.sensorDataRequested) {
                    this.trace('fetching sensor data') ;
                    res = <ZoneQueries 
                            zone={this.props.zone} 
                            query="parkingsummary"
                            callback={this.handleZoneSensors}
                            invisible={true}
                          /> ;

                    // Here we are interrogating every sensor
                    // However, it is not recommended to do it that way
                    // 
                    // if (this.state.zone.sensors.length>0) {
                    //       res = this.state.zone.sensors.map(function(sensor) {
                    //           //if (this.state.spot.gpsCoord) return (<p>{this.state.spot.gpsCoord}</p>) ;
                    //           return (<SensorQueries key={sensor.guid} 
                    //                       short={false} 
                    //                       callback={this.handleSensor}
                    //                       query="occupied" 
                    //                       invisible={true}
                    //                       sensor={sensor.guid}/>) ;
                    //       }, this) ;
                    // }
                }
            }
        }
        
        if (this.state.gotZone && this.state.gotSensor) {
            searching = '' ;
            var zoneFull = this.state.spot.length < 1 ;
            
            if (zoneFull) {
                // we could not find a spot
                res = 
                    <img className="center" src="notfound.png" alt="every spot is occupied" width={screenWidth}/> ;
            } else {
                var sensors = this.state.zone.sensors ;
                var parkingSpot = {} ;
                for (i = 0 ; i < sensors.length ; i++) {
                    if (sensors[i].guid === this.state.spot) {
                        var gpsCoord = sensors[i].gpsCoord[0].split(',') ;
                        parkingSpot = { 
                            location: this.state.zone.location,
                            sensorId: this.state.spot,
                            latitude: gpsCoord[0],
                            longitude: gpsCoord[1]
                        } ;
                        break ;
                    }
                }
                
                this.log('found parking spot here:',parkingSpot) ;
                var width = $(document).width() ;
                var height = $(document).height() ;
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
            }
        } 

        return (
            <DivWrapper key={'zones-'+this.props.guid}>
            {searching}
            {res}
            </DivWrapper>
        ) ;
               
    }
}) ;
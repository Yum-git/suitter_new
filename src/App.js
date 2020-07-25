import React from 'react';
import DeckGL from '@deck.gl/react';

import {IconLayer, GeoJsonLayer} from '@deck.gl/layers'
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';

import * as d3 from 'd3-request';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieXVtbmlrb25pa28iLCJhIjoiY2s2MzdhczF6MDdlODNtbjB3NzkydzJ6NSJ9.xdMakcrqSAWMmZMYnQiEYw';

const Hinan_Data_URL = "Hinan_data.geojson";

const ICON_MAPPING = {
    marker: {
        x: 0, 
        y: 0,
        width: 64,
        height: 64,
        mask: true
    }
};

function DataFunction(){
    return new Promise((resolve, reject) => {
        d3.csv("Sample_Center.csv", (data_in) => {
            const data_array = data_in.map(d => [Number(d.lng), Number(d.lat)]);
            resolve(data_array);
        })
    });
};


const INITIAL_VIEW_STATE = {
    longitude: 136.897874,
    latitude: 35.1620737,
    zoom: 10,
    pitch: 45,
    bearing: 0
};

const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];

const data = DataFunction().then();

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            location: null,
            statein: false
        }
    }
    async GPSFunction(){
        const location = await this.GPSGet();

        await this.GPSSet(location);
    };

    GPSGet(timeout = 5000){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve([position.coords.longitude,position.coords.latitude]);
            }, 
            reject, 
            {
                timeout,
                enableHighAccuracy: true,
            });
        });
    }

    GPSSet(location){
        this.setState({
            location:location,
            statein:true
        })
    }

    render(){
        if(this.state.statein === false){
            this.GPSFunction();
        }
        //console.log(Hinan_Data_URL);
        const layers = [
            new IconLayer({
                id: 'icon-layer',
                data: this.state.location,
                pickable: true,
                iconAtlas: 'icon.png',
                iconMapping: ICON_MAPPING,
                getIcon: d => 'marker',
                sizeScale: 15,
                getPosition: this.state.location,
                getSize: d => 5,
                getColor: d => [Math.sqrt(d.exits), 140, 0]
            }),
            new HexagonLayer({
                id: 'hexagon-layer',
                data: data,
                colorRange: colorRange,
                extruded: true,
                elevationScale: 15,
                radius: 200,
                getPosition: d => d,
            }),
            new GeoJsonLayer({
                id: 'geo-layer',
                data: Hinan_Data_URL,
                pickable: true,
                stroled: true,
                extruded: true,
                visible: true,
                pointRadiusScale: 1
            })
        ];
        return(
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
            >
            <StaticMap 
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                mapStyle='mapbox://styles/mapbox/dark-v10'
            />
            </DeckGL>
        );
    }
}

export default App;

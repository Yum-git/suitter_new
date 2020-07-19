import React from 'react';
import DeckGL from '@deck.gl/react';

import {IconLayer} from '@deck.gl/layers'
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';

import * as d3 from 'd3-request';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieXVtbmlrb25pa28iLCJhIjoiY2s2MzdhczF6MDdlODNtbjB3NzkydzJ6NSJ9.xdMakcrqSAWMmZMYnQiEYw';

const ICON_MAPPING = {
    marker: {
        x: 0, 
        y: 0,
        width: 256,
        height: 256,
        mask: true
    }
};

function GPSFunction(){

    navigator.geolocation.getCurrentPosition(
        function(position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            GPSData['coordinates'] = [lat, lon];
        }
    );
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
const GPSData = [
    {name: 'Present_location', coordinates: [137.335724850895,34.8222045598071]},
];

class App extends React.Component{
    render(){
        console.log(GPSData);
        const layers = [
            new IconLayer({
                id: 'icon-layer',
                iconAtlas: 'icon.png',
                data: GPSData,
                iconMapping: ICON_MAPPING,
                getIcon: d => 'marker',
                sizeScale: 15,

                getPosition: d => d.coordinates,
            }),
            new HexagonLayer({
                id: 'hexagon-layer',
                data: data,
                colorRange: colorRange,
                extruded: true,
                elevationScale: 15,
                radius: 200,
                getPosition: d => d,
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

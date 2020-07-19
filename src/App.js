import React from 'react';
import DeckGL from '@deck.gl/react';

import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';

import * as d3 from 'd3-request';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieXVtbmlrb25pa28iLCJhIjoiY2s2MzdhczF6MDdlODNtbjB3NzkydzJ6NSJ9.xdMakcrqSAWMmZMYnQiEYw';

function DataFunction(){
    return new Promise((resolve, reject) => {
        d3.csv("Sample_Center.csv", (data_in) => {
            const data_array = data_in.map(d => [Number(d.lng), Number(d.lat)]);
            resolve(data_array);
        })
    });
};
const INITIAL_VIEW_STATE = {
    longitude: 137.335724850895,
    latitude: 34.8222045598071,
    zoom: 13,
    pitch: 45,
    bearing: 0
};

const data = DataFunction().then();

class App extends React.Component{
    render(){
        const layers = [
            new HexagonLayer({
                id: 'hexagon-layer',
                data: data,
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

import React, {Component} from 'react';
import { feature } from 'topojson-client';
import axios from 'axios';
import { geoPatterson } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

import { WORLD_MAP_URL, WIDTH, HEIGHT  } from "../constant";

import { Spin } from 'antd';

class WorldMap extends Component {
    constructor(){
        super();
        this.state = {
            map: null
        }
        this.refMap = React.createRef();
    }

    componentDidMount() {
        axios.get(WORLD_MAP_URL)
            .then(res => {
                const { data } = res;
                const land = feature(data, data.objects.countries).features;
                this.generateMap(land);
            })
            .catch(e => console.log('err in fecth world map data ', e))
    }

    generateMap(land){
        const projection = geoPatterson()
        //const projection = geoMercator() 
            .scale(244)
            .translate([WIDTH/2, HEIGHT/2])
            .precision(.01);
        
        //console.log(projection);
        //const graticule = geoGraticule();

        const canvas = d3Select(this.refMap.current) // select current canvas
            .attr("width", WIDTH)
            .attr("height", HEIGHT)

        let context = canvas.node().getContext("2d");

        let path = geoPath()
            .projection(projection)
            .context(context);
        
        context.fillStyle = "#1a2048";
        //context.fillStyle = "#cbd4c9";
        context.fillRect(0, 0, WIDTH, HEIGHT);
  
        // draw the graticule
        // ontext.strokeStyle = 'rgba(220, 220, 220, 1)';
        // context.beginPath();
        // path(graticule());
        // context.lineWidth = 1;
        // context.stroke();

        // draw the graticule outline
        //context.beginPath();
        //context.lineWidth = 0.5;
        //path(graticule.outline());
        //context.stroke();

        land.forEach(ele => {
            // draw the countries (border and map itself)
            context.fillStyle = '#a9c2c1'; // map itself
            context.strokeStyle = '#dae2ed';
            context.globalAlpha = 0.4;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();
        })
  
    }

    render() {
        return (
            <div className="map-box">
                <canvas className="map" ref={this.refMap} />
                <canvas className="track" ref={this.props.refTrack}/>
                <div className="hint"></div>
                {
                    (this.props.loading) ?
                    <Spin tip="Loading..." /> : <></>
                }

            </div>
        );
    }
}

export default WorldMap;
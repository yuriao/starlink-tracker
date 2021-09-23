import React, {Component} from 'react';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';
import { NEARBY_SATELLITE, STARLINK_CATEGORY, SAT_API_KEY, SATELLITE_POSITION_URL,WIDTH, HEIGHT} from '../constant';
import Axios from 'axios';
import Footer from './Footer';
import * as d3Scale from 'd3-scale';
import { schemeCategory10  } from 'd3-scale-chromatic';
import { timeFormat as d3TimeFormat } from 'd3-time-format';
import { select as d3Select } from 'd3-selection';
import { geoPatterson } from 'd3-geo-projection';

class Main extends Component {
    constructor(){
        super();
        this.state = { // maintain the data sent by satsetting button
            loadingSatellites: false,
            loadingSatPositions: false,
            setting: undefined,
            selected: []
        }
        this.refTrack = React.createRef();
    }

    showNearbySatellite = (setting) => {
        this.setState({
            setting: setting,
          })    
        this.fetchSatellite(setting);
    }

    fetchSatellite = (setting) => {
        const {observerLat, observerLong, observerAlt, observerRadius} = setting; // destruction, ES6 feature
        const url = `${NEARBY_SATELLITE}/${observerLat}/${observerLong}/${observerAlt}/${observerRadius}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        this.setState({
            loadingSatellites: true,
        })
        Axios.get(url) // Axios is a library that handles Ajax response. it use promise object (ES6 feature) (then, catch)
            .then(response => {//Ajax: step stacks. as JS is single thread, the steps are put into a stack and Ajax call is put into deeper levels of stack, calls until conditions meet
                this.header("Access-Control-Allow-Origin", "true");
                this.setState({
                    satInfo: response.data,
                    loadingSatellites: false,
                    selected:[] // makesure after re-find the perviously selected is cleared 
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
                this.setState({
                    loadingSatellites: false,
                })
            })
    }
  
    trackOnClick = (duration) => {
        const { observerLat, observerLong, observerAlt } = this.state.setting;
        const endTime = duration * 60; // convert min to sec
        this.setState({ 
            loadingSatPositions: true, 
            duration:duration
        });
        const urls = this.state.selected.map( sat => {
            const { satid } = sat;
            const url = `${SATELLITE_POSITION_URL}/${satid}/${observerLat}/${observerLong}/${observerAlt}/${endTime}/&apiKey=${SAT_API_KEY}`;
            return Axios.get(url);
        });
  
        Axios.all(urls) // use all to call multiple apis, one fail, to catch
          .then(
            Axios.spread((...args) => {
                return args.map(item => item.data);
            })
          )
          .then(res => {
              this.header("Access-Control-Allow-Origin", "true");
              this.setState({
                  satPositions: res,
                  loadingSatPositions: false,
              });
              this.track();
          })
          .catch( e => {
              console.log('err in fetch satellite position -> ', e.message);
          })
          //.finally(
          //    () =>{
          //      loadingSatPositions: false,
          //})
  
      }
  
    addOrRemove = (item, status) => {
        let { selected: list } = this.state;//equal to: let list = this.state.selected;
        const found = list.some( entry => entry.satid === item.satid); // entry.satid and item.satid is passed by Satellite list

        if(status && !found){ //add
            list.push(item)
        }

        if(!status && found){ //remove
            list = list.filter( entry => {
                return entry.satid !== item.satid;//item.satid is the unchecked ones
            });
        }
        
        console.log(list);
        this.setState({
            selected: list
        }) 
    }

    track = () => {
        const data = this.state.satPositions;
        
        const len = data[0].positions.length;
        const startTime = this.state.duration;
  
        const canvas2 = d3Select(this.refTrack.current)
              .attr("width", WIDTH)
              .attr("height", HEIGHT);
        const context2 = canvas2.node().getContext("2d");
  
        let now = new Date();
        let i = startTime;
  
        let timer = setInterval( () => {
            let timePassed = Date.now() - now;
            if(i === startTime) {
                now.setTime(now.getTime() + startTime * 60)
            }
  
            let time = new Date(now.getTime() + 60 * timePassed);
            context2.clearRect(0, 0, WIDTH, HEIGHT);
            context2.font = "14px sans-serif";
            context2.fillStyle = "#ffffff";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), WIDTH / 2, 10);
  
            if(i >= len) {
                clearInterval(timer);
                this.setState({isDrawing: false});
                const oHint = document.getElementsByClassName('hint')[0];
                oHint.innerHTML = ''
                return;
            }
            data.forEach( sat => {
                const { info, positions } = sat;
                console.log(i);
                this.drawSat(info, positions[i], context2);
            });
  
            i += 60;
        }, 1000)
    }
  
    drawSat = (sat, pos, context2) => {
        const { satlongitude, satlatitude } = pos;
        if(!satlongitude || !satlatitude ) return;
        const { satname } = sat;
        const nameWithNumber = satname.match(/\d+/g).join('');
  
        const projection = geoPatterson()
        //const projection = geoMercator() 
            .scale(244)
            .translate([WIDTH /2, HEIGHT /2])
            .precision(.01);
  
        const xy = projection([satlongitude, satlatitude]);
        context2.fillStyle = d3Scale.scaleOrdinal(schemeCategory10)(nameWithNumber);
        context2.beginPath();
        context2.arc(xy[0], xy[1], 4, 0, 2*Math.PI);
        context2.fillStyle = "#ffffff";
        context2.fill();
        context2.font = "15px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1]+22);
    }
  

    render() {
        return (
            <div className='main'>
                <div className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList 
                        satInfo={this.state.satInfo}
                        loading={this.state.loadingSatellites} 
                        onSelectionChange={this.addOrRemove}
                        disableTrack={this.state.selected.length === 0}
                        trackOnclick={this.trackOnClick}/>
                    <Footer />
                </div>
                <div className="right-side">
                    <WorldMap
                        refTrack={this.refTrack}
                        loading={this.state.loadingSatPositions}/>
                </div>
            </div>
        );
    }
}

export default Main;

import React, {Component} from 'react';
import {InputNumber} from 'antd';
import {Button} from 'antd';

class SatSetting extends Component {
    constructor(){
        super();
        this.state = {
            observerLat: 0,
            observerLong: 0,
            observerAlt: 0,
            observerRadius: 0
        }
    }

    onChangeLong = (value) => {
        console.log('value ', value)
        this.setState({
            observerLong: value
        })
    }

    onChangeLat = (value) => {
        console.log('value ', value)
        this.setState({
            observerLat: value
        })
    }

    onChangeAlt = (value) => {
        console.log('value ', value)
        this.setState({
            observerAlt: value
        })
    }

    onChangeRadius = (value) => {
        console.log('value ', value)
        this.setState({
            observerRadius: value
        })
    }
    
    showSatellite = () => {
        this.props.onShow(this.state); // from Main
    }

    render() {
        return (
            <div className="sat-setting">
                <div className="loc-setting">
                    <p className="setting-label">From Location</p>
                    {/*<div className="setting-list two-item-col">*/}
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Longitude: </label>
                            <InputNumber // InputNumber is an AntDesign React component
                                min={-180}
                                max={180}
                                defaultValue={0}
                                style={{margin: "0 45px"}}
                                onChange={this.onChangeLong}
                                className="inputbox"
                            />
                        </div>
                    </div>
                        {/*<div className="list-item right-item">*/}
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Latitude: </label>
                            <InputNumber
                                placeholder="latitude"
                                min={-90}
                                max={90}
                                defaultValue={0}
                                style={{margin: "0 57px"}}
                                onChange={this.onChangeLat}
                            />
                        </div>
                    </div>
                    {/*</div>*/}
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Altitude(meters): </label>
                            <InputNumber
                                min={-413}
                                max={8850}
                                defaultValue={0}
                                style={{margin: "0 8px"}}
                                onChange={this.onChangeAlt}
                            />
                        </div>
                    </div>

                    <p className="setting-label">Restrictions</p>
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Search Radius </label>
                            <InputNumber
                                min={0}
                                max={90}
                                defaultValue={0}
                                style={{margin: "0 24px"}}
                                onChange={this.onChangeRadius}
                            />
                        </div>
                    </div>

                    <div className="show-nearby">
                        <Button
                            className="show-nearby-btn"
                            size="large"
                            onClick={this.showSatellite}
                        >
                            Find Nearby Satellites
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default SatSetting;
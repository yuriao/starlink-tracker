import React, {Component} from 'react'; //{Component} indicates the name cannot be changed?
import starlinklogo from '../assets/images/Starlink_Logo.svg'

class Header extends Component {
    render(){
        return (
            <header className="App-header">
                <img src={starlinklogo} className="App-logo" alt="logo" />
                <p className="title">
                    Starlink Tracker
                </p>

            </header>
        )
    }
}
export default Header;
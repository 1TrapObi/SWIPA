import React from 'react';
import './index.css'
import {Link} from "react-router-dom";
import * as Color from "../../common/colors";
const {BrowserWindow} = window.require('electron').remote;
// const {BrowserWindow} = require('electron').remote;

export default class Header extends React.Component {

    minimizeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    };

    maximizeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    };

    closeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    };

    render() {
        const selectedIndex = this.props.path;
        return (
            <div className="header-nav nav-side">
                <div className="logo-wrap">
                <img className="logo" src={require('../../images/logo/logo.png')} alt=""/>
                </div>

                <div className="menu-items">

                    <ul>
                        <Link to="/dashboard">
                            <li><i
                                className="fa fa-tachometer-alt"
                                style={{color: selectedIndex === '/dashboard' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/dashboard' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Home</span>
                            </li>
                        </Link>
                        <Link to="/task">
                            <li><i
                                className="fa fa-tasks"
                                style={{color: selectedIndex === '/task' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/task' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Task</span>
                            </li>
                        </Link>
                        <Link to="/profile">
                            <li><i className="fa fa-search-location"
                                   style={{color: selectedIndex === '/profile' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/profile' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Profile</span>
                            </li>
                        </Link>
                        {/*<Link to="/cards">*/}
                            {/*<li><i className="fa fa-credit-card"*/}
                                   {/*style={{color: selectedIndex === '/cards' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>*/}
                                {/*<span style={{color: selectedIndex === '/cards' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Cards</span>*/}
                            {/*</li>*/}
                        {/*</Link>*/}
                        <Link to="/proxies">
                            <li><i className="fa fa-network-wired"
                                   style={{color: selectedIndex === '/proxies' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/proxies' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Proxy</span>
                            </li>
                        </Link>

                        <Link to="/captcha">
                            <li><i className="fa fa-th-large"
                                   style={{color: selectedIndex === '/captcha' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/captcha' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR,left:-13}}>Captcha</span>
                            </li>
                        </Link>
                        <Link to="/settings">
                            <li><i className="fa fa-cog"
                                   style={{color: selectedIndex === '/settings' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/settings' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR,left:-13}}>Settings</span>
                            </li>
                        </Link>
                    </ul>

                </div>

           {/*     <div id="title-bar-btns">
                <i className="fas fa-window-minimize" onClick={()=> this.minimizeWindow()} id="min-btn"/>
                <i className="fas fa-window-maximize" onClick={()=> this.maximizeWindow()} id="max-btn"/>
                <i className="fas fa-window-close" onClick={()=> this.closeWindow()} id="close-btn"/>
                </div> */}
            </div>
        )
    }
};


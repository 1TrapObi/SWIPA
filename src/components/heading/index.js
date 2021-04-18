import React from 'react';
import {Button, Row, Collapse} from "react-bootstrap";
import './index.css';

const {BrowserWindow} = window.require('electron').remote;

export default class Heading extends React.Component {

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
        return (
            <div className="task-submenu d-flex justify-content-center">
                <div>
                    <span className='main-heading-color'>{this.props.text}</span>

                    <div id="title-bar-btns">
                        <i className="fas fa-window-minimize" onClick={() => this.minimizeWindow()} id="min-btn"/>
                        <i className="fas fa-window-maximize" onClick={() => this.maximizeWindow()} id="max-btn"/>
                        <i className="fas fa-window-close" onClick={() => this.closeWindow()} id="close-btn"/>
                    </div>

                </div>
            </div>

        )
    }

}
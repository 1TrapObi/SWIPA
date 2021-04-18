import React from 'react';
import './index.css'
import {Row, Form, Col,} from "react-bootstrap";
import {DefaultButton1, DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
     


           
                <div className="profile-manger-btns">
                    <ul>

                        <li className='create-btn'>
                            <DefaultButton1 onClick={this.props.onProxySaveClicked} text="Save" styles={{
                                margin: '0 auto',
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#DBDBDB',
                                marginRight: 10
                            }}/>
                        </li>

                        <li className='delete-btn'>
                            <DefaultButton1 onClick={this.props.testAllProxies} text="Test All" styles={{
                                marginRight:10,
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#CA7653'
                            }}/>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton1 onClick={this.props.deleteAllProxies} text="Delete All" styles={{
                                margin: '0 auto',
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#CA7653'
                            }}/>
                        </li>
                    </ul>

                </div>
          
           
        )
    }
};


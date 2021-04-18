import React from 'react';
import './index.css'
import {Row} from "react-bootstrap";
import {DefaultButton1} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
        
          
                <div className="profile-manger-btns">
                    <ul>
                        <li className='create-btn'>
                            <DefaultButton1 onClick={this.props.logout} text="Logout" styles={{
                                margin: '0 auto',
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#C24148'
                            }}/>
                        </li>
                    </ul>

                </div>
        
        )
    }
};


import React from 'react';
import './index.css'
import {Row} from "react-bootstrap";
import {DefaultButton1} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
           
                <div className="captcha-manger-btns">
                    <ul>
                        <li className='delete-btn'>
                            <DefaultButton1 onClick={this.props.onAddAccountClicked} text="Add Account" styles={{
                               
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


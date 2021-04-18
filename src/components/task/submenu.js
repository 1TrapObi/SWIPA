import React from 'react';
import './index.css'
import {Row, Button, Col} from "react-bootstrap";
import {DefaultButton1, DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        const {onCreateTaskClicked, deleteAllTaskClicked, onStartAllTaskClicked, onStopAllTaskClicked} = this.props;
        return (
            <Row>
                <Col md={12}>
                    <div className="task-manger-btns">
                        <ul>
                            <li className='create-btn'>
                                <DefaultButton1 onClick={onCreateTaskClicked} text="Create Task"/>
                            </li>
                            <li className='start-btn'>
                                <DefaultButton2 onClick={onStartAllTaskClicked} text="Start All"/>
                            </li>
                            <li className='stop-btn'>
                                <DefaultButton1 onClick={onStopAllTaskClicked} text="Stop All"/>
                            </li>
                            <li className='delete-btn'>
                                <DefaultButton2 onClick={deleteAllTaskClicked} text="Delete All" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#CA7653'}}/>

                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>
        )
    }
};


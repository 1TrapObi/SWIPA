import React from 'react';
import './index.css'
import * as Color from "../../common/colors";
import {Row, Button , Col} from "react-bootstrap";
import {DefaultButton1,DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (

        <Row>
        <Col md={12}>
                <div className="profile-manger-btns">
                    <ul>
                        <li className='create-btn'>
                            <DefaultButton1 onClick={this.props.openProfileModal} text="Create Profile" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#DBDBDB'}}/>
                        </li>
                        <li className='create-btn'>
                            <DefaultButton1 onClick={this.props.openAddBulkProfileModal} text="Bulk Upload" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#DBDBDB'}}/>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton2 onClick={this.props.onDeleteAllProfile} text="Delete All" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#CA7653'}}/>
                        </li>
                    </ul>

                </div>
        </Col>


            </Row>
        
        )
    }
};


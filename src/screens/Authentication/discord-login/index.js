import React, {Component} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import './index.css'
import {DefaultButton1,DefaultButton2} from "../../../components/Buttons";
import DashboardHeader from "../../../components/mokha-dashboard-header";

export default class DiscordLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <div className="login-form">
                        <DashboardHeader/>
                        <DefaultButton1 onClick={() => window.location.href = '#/dashboard'} text="Login with Discord"
                                       styles={{
                                           margin: '0 auto',
                                           marginTop: -70,
                                           width: '30%',
                                           fontSize: 14,
                                           borderColor: '#C24148'
                                       }}/>
                    </div>
                </Row>
            </Container>
        )
    }
}
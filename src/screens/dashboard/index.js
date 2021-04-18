import React, {Component} from 'react';
import './index.css'

import Header from '../../components/header/index';
import {Col, Container, Modal, Row} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Redirect} from "react-router-dom";
import Apis from "../../utils/api";
import DashboardHeader from "../../components/mokha-dashboard-header";
import {DefaultButton1} from "../../components/Buttons/default";
import {Line} from 'react-chartjs-2'
import User from "../../utils/utility";
import * as Color from "../../common/colors";
import Headingtop from "../../components/heading/index";


const Constant = require('../../common/constants');

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginUserObj: {},
            nav: false,
            totalAmount: 0,
            totalOrders: 0,
            credits: 0,
            licenseKey: "",
            expiryDate: "",
            recentOrders: [],
            accountStatus: "",
            userEmail: "",
            contentHeight: window.innerHeight - 194,

        };
    }

    componentDidMount() {
        this.setState({contentHeight: window.innerHeight - 194})

        window.addEventListener("resize", (event) => {
            this.setState({contentHeight: window.innerHeight - 194})
        })
        try {
            if (localStorage.getItem('logged-status')) {
                let loginDataFromLS = localStorage.getItem('logged-status');
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem('logged-user-obj');
                    let userObj = JSON.parse(loginUserObj);
                    this.fetchDashboardData(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    fetchDashboardData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.DASHBOARD_DATA + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout();
            } else if (res.status === 200) {
                if (res.data.success) {
                    let dashboardData = res.data.data
                    let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
                    context.setState({
                        licenseKey: dashboardData.licenseDetails.license_key,
                        expiryDate: new Date(parseInt(dashboardData.licenseDetails.expiry_date)).toLocaleString("en", dateOptions),
                        totalAmount: dashboardData.completedOrders.totalAmount === null ? 0 : dashboardData.completedOrders.totalAmount,
                        totalOrders: dashboardData.completedOrders.totalOrders,
                        credits: dashboardData.userData.credits,
                        recentOrders: dashboardData.recentOrders,
                        accountStatus: dashboardData.userData.is_active ? "Active" : "Inactive",
                        userEmail: dashboardData.userData.email
                    });
                }
            } else {
            }
        });
    }

    columns = [
        {
            dataField: 'url',
            text: 'Product URL',
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'left', width: '50%'};
            }
        }, {
            dataField: 'size',
            text: 'Size',
            headerStyle: (colum, colIndex) => {
                return {width: '130px', textAlign: 'center'};
            },
            formatter: (cell, row) => {
                return <span>{row.size[0]}</span>
            }
        }, {
            dataField: 'added_on',
            text: 'Date',
            headerStyle: (colum, colIndex) => {
                return {width: '120px', textAlign: 'center'};
            },
            formatter: (cell, row) => {
                let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
                let purchaseDate = new Date(parseInt(row.added_on)).toLocaleString("en", dateOptions)
                return <span>{purchaseDate}</span>
            }
        }
    ];

    chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Monthly Purchase Analytics',
                fill: true,
                lineTension: 0.4,
                backgroundColor: Color.SECONDARY_COLOR,
                borderColor: Color.PRIMARY_COLOR,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: Color.PRIMARY_COLOR,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: Color.PRIMARY_COLOR,
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    render() {
        const {licenseKey, expiryDate, totalAmount, totalOrders, credits, recentOrders, accountStatus, userEmail, contentHeight} = this.state

        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }
        return (
            <Container fluid className='dashboard-container p-l-0 p-r-0'>


                <Header path={this.props.location.pathname}/>


                <div className="right-side">
                    {/*<div className='dashboard-container'>*/}

                    {/*<Row className='center dashboard-sticky-header'>*/}
                        <Headingtop text="DASHBOARD"/>

                    {/*</Row>*/}

                    <div className="dark-bg" style={{marginRight:15}}>
                        <Row>
                            <Col className='dashboard-main-container sub-container-background l-h-90'>
                                <Row>
                                    <Col xs={2} className='text-center'>
                                        <img className='custom-radius' src={require('../../images/logo/play.png')}
                                             height={80}
                                             width={80}/>
                                    </Col>
                                    <Col>
                                        <Row className='r-h-30'>
                                            <span className='dash-title main-heading-color'>{userEmail}</span>
                                        </Row>
                                        <Row className='r-h-81'>
                                            <span className='dash-status main-heading-color2'>{accountStatus}</span>
                                        </Row>

                                    </Col>
                                    <Col/>
                                    <Col>
                                        <span className='dash-status main-heading-color2'>Status</span> : <span
                                        className='dash-status main-heading-color'>Bound</span>
                                    </Col>
                                    {/*<Col>*/}
                                    {/*<DefaultButton1 onClick={() => alert("Under construction")} text="Unbind" styles={{*/}
                                    {/*margin: '0 auto',*/}
                                    {/*width: undefined,*/}
                                    {/*fontSize: 14,*/}
                                    {/*borderColor: '#C24148'*/}
                                    {/*}}/>*/}
                                    {/*</Col>*/}
                                </Row>

                            </Col>

                        </Row>

                        <Row>

                            <Col className='dashboard-main-container sub-container-background l-h-190'>
                                <Row className='vertical-align'>
                                    <Col>
                                        <div className='square-box'>
                                            <div className='square-content'>
                                                <img src={require('../../images/money-bag.png')} alt=""
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className='m-l-35'>
                                        <Row className='r-h-20'>
                                        <span className='dash-title main-heading-color'
                                              style={{fontSize: 20}}>$ {totalAmount}</span>
                                        </Row>
                                        <Row>
                                            <span className='dash-status main-heading-color2' style={{fontSize: 12}}>Total Amount Spent</span>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='dashboard-main-container sub-container-background l-h-190'>
                                <Row className='vertical-align'>
                                    <Col>
                                        <div className='square-box'>
                                            <div className='square-content'>
                                                <img src={require('../../images/shoe.png')} alt=""
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className='m-l-35'>
                                        <Row className='r-h-20'>
                                        <span className='dash-title main-heading-color'
                                              style={{fontSize: 20}}>{totalOrders}</span>
                                        </Row>
                                        <Row>
                                        <span className='dash-status main-heading-color2'
                                              style={{fontSize: 12}}>Total Items Purchased</span>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='dashboard-main-container sub-container-background l-h-190'>
                                {this.purchaseChart()}
                            </Col>

                        </Row>

                        <Row>

                            <Col className='dashboard-main-container sub-container-background l-h-140'>
                                <Row className='vertical-align' style={{height: 65}}>
                                    <i style={{paddingRight: 10}}
                                       className='dash-title fa fa-key main-heading-color2'/><span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'>Key :</span><span
                                    style={{paddingLeft: 7}}
                                    className='dash-title main-heading-color'>{licenseKey}</span>
                                </Row>
                                <Row className='vertical-align r-h-0'>
                                <span style={{paddingRight: 10}}
                                      className='dash-title main-heading-color2'>$</span><span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'>Credits :</span><span
                                    style={{paddingLeft: 7}} className='dash-title main-heading-color'>{credits}</span>
                                </Row>
                            </Col>
                            <Col className='dashboard-main-container sub-container-background'>
                                <Row className='vertical-align r-h-90'>
                                    <i style={{paddingRight: 10}}
                                       className='dash-title fa fa-credit-card main-heading-color2'/><span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'>Renewal :</span><span
                                    style={{paddingLeft: 7}}
                                    className='dash-title main-heading-color'>{expiryDate}</span>
                                </Row>
                                {/*<Row className='vertical-align'>*/}
                                {/*<DefaultButton1 onClick={() => alert("Under construction")} text="Renew" styles={{*/}
                                {/*margin: '0 auto',*/}
                                {/*width: undefined,*/}
                                {/*fontSize: 14,*/}
                                {/*borderColor: '#C24148',*/}
                                {/*position: 'relative',*/}
                                {/*top: -10*/}
                                {/*}}/>*/}
                                {/*</Row>*/}
                                {/*<Row className='vertical-align'>*/}
                                {/*<span className='price-span'>$40/month</span>*/}
                                {/*</Row>*/}
                            </Col>

                        </Row>

                        <Row className='center' style={{marginTop: 10}}>
                            <span className='dash-title main-heading-color2'>Past Checkouts</span>
                        </Row>

                        <Row>
                            <BootstrapTable keyField='id' id='checkoutTable'
                                            data={recentOrders}
                                            columns={this.columns}
                                            bordered={false}
                                            noDataIndication={"No past checkouts"}
                            />
                        </Row>
                    </div>
                </div>
            </Container>

        );
    }

    purchaseChart = () => {
        return (
            <Line
                options={{
                    responsive: true,
                    legend: {
                        labels: {
                            fontColor: Color.SECONDARY_COLOR,
                            fontSize: 16,
                            boxWidth: 0,
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: Color.SECONDARY_COLOR,
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: Color.PRIMARY_COLOR,
                            }
                        }]
                    }
                }}
                data={this.chartData}
            />
        )
    }

}

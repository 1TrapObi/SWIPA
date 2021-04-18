import React, {Component} from 'react';
import './index.css'

import Header from '../../components/header/index';
import SubHeaderMenu from '../../components/proxy/submenu';
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Redirect} from "react-router-dom";
import Apis from "../../utils/api";
import {Toaster} from "../../components/toast";
import User from "../../utils/utility";
import Headingtop from "../../components/heading/index";

const Constant = require('../../common/constants');

export default class Proxies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proxyListData: "",
            loginUserObj: {},
            proxyData: [],
            nav: false,
            apiMessage: "",
            successResponse: true,
            showToast: false,
            contentHeight: window.innerHeight - 194
        };
        this.handleSelect = this.handleSelect.bind(this);
        this._fetchTaskAtRegularInterval()
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    _fetchTaskAtRegularInterval() {
        if (localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS)) {
            let loginDataFromLS = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS);
            if (loginDataFromLS === 'true') {
                let loginUserObj = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_INFO);
                let userObj = JSON.parse(loginUserObj);
                this.setState({loginUserObj: userObj});
                this.fetchProxyData(userObj);
            }
        }
        setTimeout(this._fetchTaskAtRegularInterval.bind(this), 2000);
    }

    componentDidMount() {
        this.setState({contentHeight: window.innerHeight - 194})

        window.addEventListener("resize", (event) => {
            this.setState({contentHeight: window.innerHeight - 194})
        });
        try {
            if (localStorage.getItem('logged-status')) {
                let loginDataFromLS = localStorage.getItem('logged-status');
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem('logged-user-obj');
                    let userObj = JSON.parse(loginUserObj);
                    // this.fetchSiteData(userObj);
                    // this.fetchProfileData(userObj);
                    this.fetchProxyData(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    formatWithIcon = (cell, row) => {
        return (
            <span>
            <i style={{marginLeft: '20px', fontSize: 15}} onClick={() => {
                // alert("Under construction")
                this.runProxy([row.id])
            }} className="fas fa-play c-pointer"/>
                <i style={{marginLeft: '20px', fontSize: 15}} onClick={() => {
                    this.deleteProxy(row)
                }} className="fas fa-trash c-pointer"/>
            </span>
        )
    };

    fetchProxyData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.USER_PROXIES + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({proxyData: res.data.proxies});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    deleteProxy(row) {
        let context = this;
        try {
            let accessToken = this.state.loginUserObj.accessToken;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.DELETE_USER_PROXY_SINGLE + '/' + row.id + '?access_token=' + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({apiMessage: res.data.msg, successResponse: true, showToast: true})
                        context.fetchProxyData(context.state.loginUserObj)
                    } else
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                }
            });
        } catch (e) {
            context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    }

    async submitBulkProxy(e) {
        e.preventDefault();
        try {
            let accessToken = this.state.loginUserObj.accessToken;
            let context = this;
            let bulkProxyList = [];
            await this.state.proxyListData.split('\n').map(async (item, i) => {
                if (item.toString().length !== 0) {
                    await bulkProxyList.push(item);
                }
            });
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.ADD_BULK_PROXY + "?access_token=" + accessToken, {proxyArray: bulkProxyList}).then(function (res) {
                if (res.error) {
                    User.logout()
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({apiMessage: res.data.msg, successResponse: true, showToast: true})
                        context.fetchProxyData(context.state.loginUserObj);
                    }
                    else
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                } else
                    context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
            });
        } catch (e) {
            this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    }

    deleteAllProxies() {
        try {
            const {loginUserObj} = this.state;
            let context = this;
            let accessToken = loginUserObj.accessToken;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.DELETE_USER_PROXIES + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({apiMessage: res.data.msg, successResponse: true, showToast: true})
                        context.fetchProxyData(loginUserObj)
                    } else {
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                    }
                }
            });
        } catch (e) {
            this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    }

    columns = [
        {
            dataField: 'ip',
            text: 'Proxy',
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'left'};
            },
            formatter: (cell, row) => {
                let text = row.ip + ":" + row.port;
                if (row.user !== undefined)
                    text += ":" + row.user + ":" + row.pass
                return text;
            }
        },
        {
            dataField: 'time',
            text: 'Time',
            formatter: (cell, row) => {
                return <span
                    style={{color: row.status_color, fontWeight: 'bold'}}>{row.time === "" ? 0 : row.time}ms</span>
            }
        },
        {
            dataField: 'status',
            text: 'Status',
            headerStyle: (colum, colIndex) => {
                return {width: '130px', textAlign: 'center'};
            },
            formatter: (cell, row) => {
                return <span style={{color: row.status_color, fontWeight: 'bold'}}>{row.status}</span>
            }
        },
        {
            dataField: '5',
            text: 'Actions',
            formatter: this.formatWithIcon,
            headerStyle: (colum, colIndex) => {
                return {width: '130px', textAlign: 'left'};
            }
        }
    ];

    runProxy(id) {
        let context = this;
        let accessToken = this.state.loginUserObj.accessToken;
        Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.TEST_PROXY + '?access_token=' + accessToken, {proxies: id}).then(function (res) {
            if (res.error) {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                User.logout();
            } else if (res.status === 200) {
                if (res.data.success) {
                    context.setState({apiMessage: res.data.msg, successResponse: true, showToast: true})
                    // context.fetchProxyData(context.state.loginUserObj)
                } else
                    context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
            }
        });
    }

    render() {
        const {proxyListData, proxyData, apiMessage, successResponse, showToast, contentHeight} = this.state;

        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }
        return (
            <Container fluid className="d-flex p-l-0 p-r-0">
                <Toaster context={this} showToast={showToast} message={apiMessage} success={successResponse}/>
                <Header path={this.props.location.pathname}/>


                <div className="right-side">
                    <Headingtop text="PROXIES"/>

                    <div className="blue-bg">
                        <SubHeaderMenu
                            testAllProxies={() => this.runProxy(['ALL'])}
                            onProxySaveClicked={(e) => this.submitBulkProxy(e)}
                            deleteAllProxies={() => this.deleteAllProxies()}/>
                        <Row className='proxy-main-container main-background' style={{height: contentHeight}}>
                            <span className='enter-proxy-text sub-heading-color m-l-m-15'>Enter Proxies</span>
                            <Col className='sub-container-background'
                                 style={{height: '85%', marginTop: 55, opacity: 0.5}}>
                        <textarea name='proxyListData' value={proxyListData} onChange={(e) => this.handleInputChange(e)}
                                  style={{border: 'none'}}
                                  placeholder='ip:port:user:pass' className='sub-container-background sub-heading-color'
                                  cols="30" rows="10"/>
                            </Col>
                            <Col style={{backgroundColor: 'transparent'}} className='proxy-list'>
                                <Row>
                                    <BootstrapTable keyField='id' id='proxyTable'
                                                    data={proxyData}
                                                    columns={this.columns}
                                                    bordered={false}
                                                    noDataIndication={"No proxy added"}/>
                                </Row>
                            </Col>

                        </Row>
                    </div>
                </div>
            </Container>
        );
    }

    handleSelect(key) {
        this.setState({key: key});
    }

}

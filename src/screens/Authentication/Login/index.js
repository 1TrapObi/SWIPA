import React, {Component} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import './index.css'
import {DefaultButton1} from "../../../components/Buttons/default";
import {Redirect} from "react-router-dom";
import Constant from "../../../common/constants";
import Apis from "../../../utils/api";
import {Toaster} from "../../../components/toast";

const {BrowserWindow} = window.require('electron').remote;

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            license_key: "",
            loading: false,
            nav: false,
            showToast: false,
            apiMessage: "",
            successResponse: false
        }
    }

    loader = () => {
        return (
            <div className='login-form'>
                <img src={require('../../../images/spinner.gif')} style={{height: 100, width: 100}}/>
                <span className='text-center sub-heading-color'>Please wait while we validate your key..</span>
            </div>
        )
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        try {
            if (localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS)) {
                let loginDataFromLS = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS);
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_INFO);
                    this.setState({nav: true})
                } else {
                    this.setState({nav: false})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    async submitValidateKey(e) {
        e.preventDefault();
        let context = this;
        const {license_key} = this.state;
        if (license_key === "") {
            context.setState({apiMessage: "Enter key", successResponse: false, showToast: true})
            return;
        }
        this.setState({loading: true});

        let dataObj = {
            "key": license_key,
            "app_id": Constant.APP_ID
        };
        await Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.LOGIN, dataObj).then(async function (res) {
            context.setState({loading: false});
            if (res.error) {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
            } else if (res.status === 200) {
                if (res.data.success) {
                    if (res.data.is_expired) {
                        context.setState({
                            apiMessage: "License key has expired",
                            successResponse: false,
                            showToast: true
                        })
                    } else {
                        context.setState({
                            apiMessage: "Logged in successfully",
                            successResponse: true,
                            showToast: true
                        })
                        await context.setLocalStorageValue(res.data.response, context)
                    }
                } else {
                    context.setState({
                        apiMessage: res.data.msg,
                        successResponse: false,
                        showToast: true
                    })
                }
            } else {
                context.setState({
                    apiMessage: "Some error has occured",
                    successResponse: false,
                    showToast: true
                })
            }
        }).catch((err) => {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true
            })
            context.setState({loading: false});
        });
    }

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

    async setLocalStorageValue(userData, context) {
        await localStorage.setItem(Constant.LOCAL_STORAGE.LOGIN_STATUS, true);
        await localStorage.setItem(Constant.LOCAL_STORAGE.LOGIN_INFO, JSON.stringify(userData));
        context.setState({nav: true})
    }

    render() {
        const {loading, license_key, showToast, apiMessage, successResponse} = this.state;
        if (this.state.nav) {
            return <Redirect to='dashboard'/>
        }

        return (
            <Container fluid className='login-container'>
                <Toaster context={this} showToast={showToast} message={apiMessage} success={successResponse}/>

                <Row>
                    {!loading ? <div className="login-form">
                    <div className="login-wrap">
                        <img src={require('../../../images/logo/full-text-logo.png')} alt="" height={80}/>
                        <input onChange={(e) => {
                            this.handleInputChange(e)
                        }} value={license_key} name="license_key" type="text" required={true}
                               placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                               className="input-box-color"/>
                        <DefaultButton1 onClick={(e) => this.submitValidateKey(e)} text="Login"
                                        styles={{margin: '0 auto', width: '30%', fontSize: 14}}/>
                        </div>
                    </div> : this.loader()}
                </Row>
                <div id="title-bar-btns" style={{top: 0}}>
                    <i className="fas fa-window-minimize" onClick={() => this.minimizeWindow()} id="min-btn"/>
                    <i className="fas fa-window-maximize" onClick={() => this.maximizeWindow()} id="max-btn"/>
                    <i className="fas fa-window-close" onClick={() => this.closeWindow()} id="close-btn"/>
                </div>
            </Container>
        )
    }
}
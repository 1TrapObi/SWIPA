import React, {Component} from 'react';
import './index.css'
import Header from '../../components/header/index';
import SubHeaderMenu from '../../components/cards/submenu';
import {Button, Col, Container, Modal, Row, Form, Tabs, Tab} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Redirect} from "react-router-dom";
import Apis from "../../utils/api";
import {DefaultButton1, DefaultButton2} from "../../components/Buttons/default";
import {Toaster} from "../../components/toast";
import User from "../../utils/utility";

const Constant = require('../../common/constants');

export default class Cards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            profileData: [],
            statesArray: [],

            isEditing: false,
            editingTrData: [],
            addSiteData: [],
            selected: false,
            showCatchaModal: false,
            isAddSiteModalOpened: false,
            selectedData: [],
            proxyDataArray: [],
            error: [],
            key: 1,
            default_proxy: "",
            cardId: "",
            loginUserObj: {},
            nav: false,
            tabActive: "shipping",

            ship: true,
            bill: false,
            card: false,
            isCopyShipping: false,
            isUpdatingProfile: false,
            profileID: "",

            // shipping
            profile_name: "",
            ship_firstname: "",
            ship_lastname: "",
            ship_email: "",
            ship_phone: "",
            ship_address1: "",
            ship_address2: "",
            ship_country: "",
            ship_state: "",
            ship_city: "",
            ship_zipcode: "",

            // billing
            bill_firstname: "",
            bill_lastname: "",
            bill_email: "",
            bill_phone: "",
            bill_address1: "",
            bill_address2: "",
            bill_country: "",
            bill_state: "",
            bill_city: "",
            bill_zipcode: "",

            // card

            card_holder: "",
            card_type: "",
            card_number: "",
            card_expiry_month: "",
            card_expiry_year: "",
            card_expiry_cvv: "",

            apiMessage: "",
            successResponse: false,
            showToast: false,

            bill_state_name: "",
            ship_state_name: "",

            isLoadingStates: false

        };
        // this.handleSelect = this.handleSelect.bind(this);
    }

    resetFormOnProfileCreation() {
        this.setState({
            profile_name: "",
            ship_firstname: "",
            ship_lastname: "",
            ship_email: "",
            ship_phone: "",
            ship_address1: "",
            ship_address2: "",
            ship_country: "",
            ship_state: "",
            ship_city: "",
            ship_zipcode: "",

            // billing
            bill_firstname: "",
            bill_lastname: "",
            bill_email: "",
            bill_phone: "",
            bill_address1: "",
            bill_address2: "",
            bill_country: "",
            bill_state: "",
            bill_city: "",
            bill_zipcode: "",

            // card

            card_holder: "",
            card_type: "",
            card_number: "",
            card_expiry_month: "",
            card_expiry_year: "",
            card_expiry_cvv: "",
            contentHeight: window.innerHeight - 144
        })
    }

    handleInputChange(event) {
        const {statesArray} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name === 'ship_country')
            this.fetchStatesData(value)
        if (name === 'bill_country')
            this.fetchStatesData(value)

        if (name === 'ship_state') {
            for (let state of statesArray)
                if (state.state_code === value)
                    this.setState({ship_state_name: state.state_name})
        }
        if (name === 'bill_state') {
            for (let state of statesArray)
                if (state.state_code === value)
                    this.setState({bill_state_name: state.state_name})
        }

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        this.setState({contentHeight: window.innerHeight - 144})

        window.addEventListener("resize", (event) => {
            this.setState({contentHeight: window.innerHeight - 144})
        });
        try {
            if (localStorage.getItem('logged-status')) {
                let loginDataFromLS = localStorage.getItem('logged-status');
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem('logged-user-obj');
                    let userObj = JSON.parse(loginUserObj);
                    // this.fetchProfileData(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    // this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    fetchStatesData(countryCode) {
        let context = this;
        this.setState({isLoadingStates: true})
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.COUNTRY + Constant.API_ENDPOINTS.GET_STATES + '/' + countryCode).then(function (res) {
            context.setState({isLoadingStates: false})
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({statesArray: res.data.data});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    fetchProfileData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.USER_PROFILES + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({profileData: res.data.profiles});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    formatWithIcon = (cell, row) => {
        return (
            <span>
            <i style={{marginLeft: '20px', fontSize: 15}} onClick={() => {
                this.editProfileData(row)
            }} className="fas fa-pen c-pointer"/>
                <i style={{marginLeft: '20px', fontSize: 15}} onClick={() => {
                    this.deleteCard(row)
                }} className="fas fa-trash c-pointer"/>
            </span>
        )
    };

    columns = [
        {
            dataField: 'card.cardHolderName',
            text: 'Card Holder'
        },
        {
            dataField: 'card.number',
            text: 'Card Number'
        },
        {
            dataField: '5',
            text: 'Actions',
            formatter: this.formatWithIcon,
            width: "200"
        }
    ];

    selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            let data = this.state.selectedData;
            if (isSelect) {
                data.push(row);
                this.setState({selectedData: data})
            } else {
                for (let index = 0; index < data.length; index++) {
                    if (row['id'] === data[index]['id'])
                        data.splice(index, 1)
                }
                this.setState({selectedData: data})
            }
        },
        onSelectAll: (isSelect, rows, e) => {
            let data = rows;
            if (isSelect) {
                this.setState({selectedData: data});
            } else {
                data = [];
                this.setState({selectedData: data});
            }
        }
    };

    render() {
        const {showToast, apiMessage, successResponse, contentHeight} = this.state;

        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }

        return (
            <Container fluid>
                {this.ProfileModal()}
                <Toaster context={this} showToast={showToast} message={apiMessage} success={successResponse}/>
                <Header path={this.props.location.pathname}/>
                <SubHeaderMenu onDeleteAllCards={() => this.deleteAllCards()}
                               openCardModal={() => {
                                   // this.resetFormOnProfileCreation();
                                   this.setState({modalShow: true, isUpdatingProfile: false})
                               }}/>
                <Row className='profile-main-container main-background' style={{height: contentHeight}}>
                    <Col>
                        <BootstrapTable id="profileDataTable" keyField='id' data={this.state.profileData}
                                        columns={this.columns}
                                        selectRow={this.selectRow} bordered={false}
                                        noDataIndication={"No cards added"}/>
                    </Col>
                </Row>
            </Container>
        );
    }

    deleteCard(row) {
        let context = this;
        try {
            let accessToken = this.state.loginUserObj.accessToken;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.DELETE_USER_PROFILE_SINGLE + '/' + row.id + '?access_token=' + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                    User.logout()
                } else if (res.status === 200) {
                    context.setState({apiMessage: "Deleted successfully", successResponse: true, showToast: true})
                    context.fetchProfileData(context.state.loginUserObj)
                } else {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                }
            });
        } catch (e) {
            this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    }

    deleteAllCards() {
        alert("Under construction")
        // try {
        //     const {loginUserObj} = this.state;
        //     let context = this;
        //     let accessToken = loginUserObj.accessToken;
        //     Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.DELETE_USER_PROFILES + "?access_token=" + accessToken, {}).then(function (res) {
        //         if (res.error) {
        //             context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        //             User.logout()
        //         } else if (res.status === 200) {
        //             if (res.data.success) {
        //                 context.fetchProfileData(loginUserObj);
        //                 context.setState({apiMessage: "All Profile deleted", successResponse: true, showToast: true})
        //             } else
        //                 context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
        //         } else
        //             context.setState({apiMessage: "Failed to delete", successResponse: false, showToast: true})
        //     });
        // } catch (e) {
        //     this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        // }
    }

    editProfileData(row) {
        this.setState({isUpdatingProfile: true, modalShow: true});
        this.setState({
            profileID: row.id,
            isCopyShipping: !this.state.isCopyShipping,
            profile_name: row.profile_name,
            ship_firstname: row.firstName,
            ship_lastname: row.lastName,
            ship_email: row.email,
            ship_phone: row.phone,
            ship_address1: row.line1,
            ship_address2: row.line2,
            ship_country: row.country.isocode,
            ship_state: row.region.isocodeShort,
            ship_state_name: row.region.isocodeShort,
            ship_city: row.town,
            ship_zipcode: row.postalCode,

            bill_firstname: row.billing.firstName,
            bill_lastname: row.billing.lastName,
            bill_email: row.billing.email,
            bill_phone: row.billing.phone,
            bill_address1: row.billing.line1,
            bill_address2: row.billing.line2,
            bill_country: row.billing.country.isocode,
            bill_state: row.billing.region.isocodeShort,
            bill_state_name: row.billing.region.isocodeShort,
            bill_city: row.billing.town,
            bill_zipcode: row.billing.postalCode,

            card_holder: row.card.cardHolderName,
            card_type: row.card.cardType,
            card_number: row.card.number,
            card_expiry_month: row.card.month,
            card_expiry_year: row.card.year,
            card_expiry_cvv: row.card.cvv,
            cardId: row.card.id
        });

        this.fetchStatesData(row.country.isocode)
        this.fetchStatesData(row.billing.country.isocode)
    }

    handleChecked() {
        const {
            ship_firstname,
            ship_lastname,
            ship_email,
            ship_phone,
            ship_address1,
            ship_address2,
            ship_country,
            ship_state,
            ship_city,
            ship_zipcode
        } = this.state;

        if (!this.state.isCopyShipping) {

            const {statesArray} = this.state;
            for (let state of statesArray)
                if (state.state_code === ship_state)
                    this.setState({bill_state_name: state.state_name})

            this.setState({
                isCopyShipping: !this.state.isCopyShipping,
                bill_firstname: ship_firstname,
                bill_lastname: ship_lastname,
                bill_email: ship_email,
                bill_phone: ship_phone,
                bill_address1: ship_address1,
                bill_address2: ship_address2,
                bill_country: ship_country,
                bill_state: ship_state,
                bill_city: ship_city,
                bill_zipcode: ship_zipcode,


            });
        }
        else
            this.setState({
                isCopyShipping: !this.state.isCopyShipping,
                bill_firstname: "",
                bill_lastname: "",
                bill_email: "",
                bill_phone: "",
                bill_address1: "",
                bill_address2: "",
                bill_country: "",
                bill_state: "",
                bill_city: "",
                bill_zipcode: "",
            });

    }

    async createProfile(e) {
        e.preventDefault();
        alert("Under construction");
        return;
        try {
            this.setState({modalShow: false});
            let accessToken = this.state.loginUserObj.accessToken;
            const {
                profile_name,
                ship_firstname,
                ship_lastname,
                ship_email,
                ship_phone,
                ship_address1,
                ship_address2,
                ship_country,
                ship_state,
                ship_city,
                ship_zipcode,
                bill_firstname,
                bill_lastname,
                bill_email,
                bill_phone,
                bill_address1,
                bill_address2,
                bill_country,
                bill_state,
                bill_city,
                bill_zipcode,
                card_holder,
                card_type,
                card_number,
                card_expiry_month,
                card_expiry_year,
                card_expiry_cvv,
                ship_state_name,
                bill_state_name
            } = this.state;

            let dataObj = {
                profile_name: profile_name,
                firstName: ship_firstname,
                lastName: ship_lastname,
                country: {
                    isocode: ship_country,
                    name: 'United States'
                },
                region: {
                    countryIso: 'US',
                    isocode: 'US-' + ship_state,
                    isocodeShort: ship_state,
                    name: ship_state_name,
                },
                phone: ship_phone,
                line1: ship_address1,
                line2: ship_address2,
                postalCode: ship_zipcode,
                town: ship_city,
                email: ship_email,
                billing: {
                    firstName: bill_firstname,
                    lastName: bill_lastname,
                    country: {
                        isocode: bill_country,
                        name: 'United States'
                    },
                    region: {
                        countryIso: 'US',
                        isocode: 'US-' + bill_state,
                        isocodeShort: bill_state,
                        name: bill_state_name,
                    },
                    phone: bill_phone,
                    line1: bill_address1,
                    line2: bill_address2,
                    postalCode: bill_zipcode,
                    town: bill_city,
                    email: bill_email
                },
                card: {
                    number: card_number,
                    month: card_expiry_month,
                    year: card_expiry_year,
                    cvv: card_expiry_cvv,
                    cardType: card_type,
                    cardHolderName: card_holder
                }
            };

            let context = this;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.ADD_PROFILE + "?access_token=" + accessToken, dataObj).then(function (res) {
                if (res.error) {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true});
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchProfileData(context.state.loginUserObj)
                        context.setState({apiMessage: "Created successfully", successResponse: true, showToast: true})
                    } else
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                } else {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                }
            });
        } catch (e) {
            this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    }

    async updateProfile(e) {
        alert("Under construction");
        return;
        e.preventDefault();
        try {
            this.setState({modalShow: false});
            let accessToken = this.state.loginUserObj.accessToken;
            const {
                profile_name,
                ship_firstname,
                ship_lastname,
                ship_email,
                ship_phone,
                ship_address1,
                ship_address2,
                ship_country,
                ship_state,
                ship_city,
                ship_zipcode,
                bill_firstname,
                bill_lastname,
                bill_email,
                bill_phone,
                bill_address1,
                bill_address2,
                bill_country,
                bill_state,
                bill_city,
                bill_zipcode,
                card_holder,
                card_type,
                card_number,
                card_expiry_month,
                card_expiry_year,
                card_expiry_cvv,
                profileID,
                cardId,
                ship_state_name,
                bill_state_name
            } = this.state;

            let dataObj = {
                id: profileID,
                profile_name: profile_name,
                firstName: ship_firstname,
                lastName: ship_lastname,
                country: {
                    isocode: ship_country,
                    name: 'United States'
                },
                region: {
                    countryIso: 'US',
                    isocode: 'US-' + ship_state,
                    isocodeShort: ship_state,
                    name: ship_state_name,
                },
                phone: ship_phone,
                line1: ship_address1,
                line2: ship_address2,
                postalCode: ship_zipcode,
                town: ship_city,
                email: ship_email,
                billing: {
                    firstName: bill_firstname,
                    lastName: bill_lastname,
                    country: {
                        isocode: bill_country,
                        name: 'United States'
                    },
                    region: {
                        countryIso: 'US',
                        isocode: 'US-' + bill_state,
                        isocodeShort: bill_state,
                        name: bill_state_name,
                    },
                    phone: bill_phone,
                    line1: bill_address1,
                    line2: bill_address2,
                    postalCode: bill_zipcode,
                    town: bill_city,
                    email: bill_email
                },
                card: {
                    id: cardId,
                    number: card_number,
                    month: card_expiry_month,
                    year: card_expiry_year,
                    cvv: card_expiry_cvv,
                    cardType: card_type,
                    cardHolderName: card_holder
                }
            };

            let context = this;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.UPDATE_PROFILE + "?access_token=" + accessToken, dataObj).then(function (res) {
                if (res.error) {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true});
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchProfileData(context.state.loginUserObj)
                        context.setState({apiMessage: "Updated successfully", successResponse: true, showToast: true})
                    } else
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                } else {
                    context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                }
            });
        } catch (e) {
            this.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        }
    };

    ProfileModal = () => {
        const {isUpdating, task_name, size, profile_id, buttonText, tabActive, ship, bill, card} = this.state;

        const {
            profile_name,
            ship_firstname,
            ship_lastname,
            ship_email,
            ship_phone,
            ship_address1,
            ship_address2,
            ship_country,
            ship_state,
            ship_city,
            ship_zipcode,
            bill_firstname,
            bill_lastname,
            bill_email,
            bill_phone,
            bill_address1,
            bill_address2,
            bill_country,
            bill_state,
            bill_city,
            bill_zipcode,
            card_holder,
            card_type,
            card_number,
            card_expiry_month,
            card_expiry_year,
            card_expiry_cvv,
            isUpdatingProfile, statesArray,
            isLoadingStates
        } = this.state;


        return (
            <Modal
                show={this.state.modalShow}
                onHide={() => {
                    this.setState({modalShow: false});
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <form id='taskaddForm' onSubmit={(e) => {
                    this.submitForm(e)
                }}>
                    <Modal.Body>

                        <span
                            className='c-task-header sub-heading-color f-w-700'>{isUpdatingProfile ? "Update " : "Add "}Card</span>

                        <div id={'card'}>

                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <input
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={card_holder}
                                        name='card_holder'
                                        style={{background: '#3A2B2B', color: '#fff'}} type="text" required={true}
                                        placeholder="Card Holder"
                                        className="input-box-color"/>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control className="input-box-color"
                                                      onChange={(e) => this.handleInputChange(e)} name='card_type'
                                                      value={card_type} as="select">
                                            <option selected value='-1'>Card Type</option>
                                            {['VISA', 'MASTER'].map((data, index) => {
                                                return (
                                                    <option value={data}>{data}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 0}}>
                                <Col>
                                    <input
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={card_number}
                                        name='card_number'
                                        style={{background: '#3A2B2B', color: '#fff'}} type="text" required={true}
                                        placeholder="Card Number"
                                        className="input-box-color"/>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 15, paddingBottom: 35}}>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control className="input-box-color"
                                                      onChange={(e) => this.handleInputChange(e)}
                                                      name='card_expiry_month'
                                                      value={card_expiry_month} as="select">
                                            <option selected value='-1'>Exp. Month</option>
                                            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((data, index) => {
                                                return (
                                                    <option value={data}>{data}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control className="input-box-color"
                                                      onChange={(e) => this.handleInputChange(e)}
                                                      name='card_expiry_year'
                                                      value={card_expiry_year} as="select">
                                            <option selected value='-1'>Exp. Year</option>
                                            {['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'].map((data, index) => {
                                                return (
                                                    <option value={data}>{data}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <input
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={card_expiry_cvv}
                                        name='card_expiry_cvv'
                                        style={{background: '#3A2B2B', color: '#fff'}} type="text" required={true}
                                        placeholder="Cvv"
                                        className="input-box-color"/>
                                </Col>
                            </Row>
                            <Row>
                                <DefaultButton1
                                    onClick={(e) => isUpdatingProfile ? this.updateProfile(e) : this.createProfile(e)}
                                    text={'Save'}
                                    styles={{
                                        margin: '0 auto',
                                        width: undefined,
                                        fontSize: 14,
                                        position: 'absolute',
                                        right: 15,
                                        bottom: 0
                                    }}/>
                            </Row>

                        </div>
                    </Modal.Body>
                </form>
            </Modal>
        )
    };

}

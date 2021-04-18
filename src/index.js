import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Task from './screens/task/index';
import Dashboard from './screens/dashboard/index';
import Settings from './screens/settings/index';
import Proxies from './screens/proxy/index';
import Profiles from './screens/profile/index';
import Captcha from './screens/captcha/index';
import Login from './screens/Authentication/Login/index';
import DiscordLogin from './screens/Authentication/discord-login/index';

import './css/style.css';
import './css/colors.css';

import {Route, HashRouter, Switch} from 'react-router-dom'
import Cards from "./screens/cards";

export default class Routing extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/captcha" component={Captcha}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route path="/task" component={Task}/>
                    <Route path="/profile" component={Profiles}/>
                    <Route path="/cards" component={Cards}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/proxies" component={Proxies}/>
                    <Route path="/discord-login" component={DiscordLogin}/>
                </Switch>
            </HashRouter>
        )
    }
};

ReactDOM.render(
    <Routing/>,
    document.getElementById('root')
);

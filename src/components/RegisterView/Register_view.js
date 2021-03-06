import React, {Component} from 'react';
import {User} from "../../entities/User";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {RegisterForm} from "../forms/RegisterForm/RegisterForm";
import {user_type} from "../../entities/constants";
import {Visitor} from "../../entities/Visitor";
import {Employee} from "../../entities/Employee";
import {Redirect} from "react-router-dom";

const us_states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
    'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY'];

export class Register_view extends Component {
    isEmployee = false;
    hash = null;
    hr = new XMLHttpRequest();
    url = 'http://localhost:5000';

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            anchorEl: null,
            andhorEl2: null,
            usertype: null,
            curr_state: "AL",
            reg_success: false,
            username: null
        };
        this.hash = props.location.hash;
        this.initUser(this.hash);
    }

    initUser(hash) {
        switch (hash) {
            case '#user':
                this.state.user = new User();
                this.state.usertype = user_type.USER;
                break;
            case '#visitor':
                this.state.user = new Visitor();
                this.state.usertype = user_type.VISITOR;
                break;
            case '#employee-visitor':
                this.state.user = new Employee(null, null, null, null, null, null, user_type.EMP_VIS,
                    null, true, null, null);
                this.isEmployee = true;
                break;
            case '#employee':
                this.state.user = new Employee(null, null, null, null, null, null, user_type.EMP,
                    null, false, null, null);
                this.isEmployee = true;
                break;
        }
    }

    handleTypeClick = event => {
        this.setState({anchorEl: event.currentTarget});
        console.log("Changed type to " + event.currentTarget);
    };

    handleClose = (event, value) => {
        this.setState({
            anchorEl: null,
            anchorEl2: null
        });
    };

    handleMenuClick = (event) => {
        this.setState({
            anchorEl: null,
            usertype: event.target.innerText
        });
    };

    handleStateClick = event => {
        this.setState({anchorEl2: event.currentTarget});
    };

    handleStateClose = (event, value) => {
        this.setState({anchorEl2: null});
    };

    handleStateMenuClick = (event) => {
        this.setState({
            anchorEl2: null,
            curr_state: event.target.innerText
        });
    };

    handleReset = () => {
        this.loginForm.reset();
    };

    handleSubmit = (e) => {
        console.log(e);
        console.log(e['email']);
    };

    generate_emp_id(emp_id) {
        const url = this.url + '/check_emp_id?emp_id=' + Math.abs(Math.random())
        this.hr.open('GET', url);
    }

    register = (data) => (e) => {
        const new_obj = this.createNewUser(this.hash, data);
        const new_user = new_obj[0];
        const _path = new_obj[1];
        console.log(this.url + _path);
        this.hr.open('POST', this.url + _path);
        this.hr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.hr.onreadystatechange = (e) => {
            if (e.target.readyState === 4 && e.target.status === 200) {
                console.log("registered user");
                // console.log(e.target.responseText);
                const respone = e.target.responseText;
                this.state.reg_success = true;
                this.state.username = new_obj['username'];
                console.log(this.state.username);
                this.setState(
                    this.state
                );
                console.log(this.state);
            }
        };
        this.hr.send(JSON.stringify(new_user));
    };

    getEmails(emails) {
        let email = '';
        for (let i = 0; i < emails.length; i++) {
            email = email + emails[i];
        }
        console.log(email);
        return email;
    }

    createNewUser(hash, data) {
        switch (hash) {
            case '#user':
                this.state.user = {
                    'username': data['username'],
                    'email': this.getEmails(data['emails']),
                    'pw': data['pw'],
                    'fname': data['fname'],
                    'lname': data['lname']
                };
                return [this.state.user, '/register_user'];
            case '#visitor':
                this.state.user = {
                    'username': data['username'],
                    'email': this.getEmails(data['emails']),
                    'pw': data['pw'],
                    'fname': data['fname'],
                    'lname': data['lname']
                };
                return [this.state.user, '/register_visitor'];
            case '#employee-visitor':
                // const em_id = this.generate_emp_id();
                this.state.user = {
                    'username': data['username'],
                    'fname': data['fname'],
                    'lname': data['lname'],
                    'pw': data['pw'],
                    'phone': data['phone'],
                    'address': data['address'],
                    'city': data['city'],
                    'state': this.state.curr_state,
                    'zip': data['zip'],
                    'emp_type': this.state.usertype,
                    'emp_id': Math.abs(Math.floor(Math.random())),
                    'emails': data['emails']
                };
                return [this.state.user, '/register_emp_visitor'];
            case '#employee':
                this.state.user = {
                    'username': data['username'],
                    'fname': data['fname'],
                    'lname': data['lname'],
                    'pw': data['pw'],
                    'phone': data['phone'],
                    'address': data['address'],
                    'city': data['city'],
                    'state': this.state.curr_state,
                    'zip': data['zip'],
                    'emp_type': this.state.usertype,
                    'emp_id': Math.abs(Math.floor(Math.random())),
                    'emails': data['emails']
                };
                return [this.state.user, '/register_employee'];
        }
    }

    render() {
        return (
            <div>
                {this.state.reg_success ?
                    <Redirect to={{
                        pathname: "/functionality",
                        hash: this.state.username}}/>
                    :
                    <div>
                        <Grid container justify="center" item xs={12}><h1>Register User</h1></Grid>
                        <RegisterForm onSubmit={this.handleSubmit} handleTypeClick={this.handleTypeClick}
                                      register={this.register} isEmployee={this.isEmployee}
                                      handleClose={this.handleClose} handleMenuClick={this.handleMenuClick}
                                      anchorEl={this.state.anchorEl} userType={this.state.usertype}
                                      anchorEl2={this.state.anchorEl2} states={us_states}
                                      handleStateClick={this.handleStateClick}
                                      handleStateMenuClick={this.handleStateMenuClick}
                                      curr_state={this.state.curr_state}/>
                    </div>
                }
            </div>
        );
    }
}


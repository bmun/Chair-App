import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Navigation/index.css'
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import {AuthUserContext, withAuthentication} from '../Session';
import {withFirebase} from "../Firebase";

class NavigationBase extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "Loading..."};
    }

    getUsername = authUser => {
        let that = this;
        this.props.firebase.user(authUser.uid)
            .once('value').then(function(snapshot) {
                that.setState({username: snapshot.val()["username"]});
        })
    };

    render() {
        const {username} = this.state;
        return (
            <div>
                <header>
                    <img src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-devices/40/radio-512.png"/>
                    <AuthUserContext.Consumer>
                        {authUser => {
                            if (authUser) {
                                this.getUsername(authUser);
                            }
                            return (authUser ? <div><NavigationAuth/> <p> Welcome, {username} </p><SignOutButton/></div> : <NavigationNonAuth/>);
                        }
                        }
                    </AuthUserContext.Consumer>
                </header>
            </div>
        );
    }
}

const NavigationAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <Link to={ROUTES.POST}>Post</Link>
        </li>
        <li>
            <Link to={ROUTES.WATCH}>Watch</Link>
        </li>
    </ul>
);



const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li>
            <Link to={ROUTES.WATCH}>Watch</Link>
        </li>
    </ul>
);

const Navigation = withAuthentication(withFirebase(NavigationBase));
export default Navigation;
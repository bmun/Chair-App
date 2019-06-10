import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Navigation/index.css'
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import {AuthUserContext, withAuthorization} from '../Session';

const Navigation = () => (
    <div>
        <header>
            <img src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-devices/40/radio-512.png"/>
            <AuthUserContext.Consumer>
                {authUser => {
                    return (authUser ? <NavigationAuth/> : <NavigationNonAuth/>);
                }
                }
            </AuthUserContext.Consumer>
        </header>
    </div>
)

class NavigationAuthBase extends Component {

    render() {
        return (

            <div>
                <ul>
                    <li>
                        <Link to={ROUTES.LANDING}>Landing</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.GRADING}>Grading</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.POST}>Post</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.WATCH}>Watch</Link>
                    </li>
                </ul>
                <p> Welcome, {this.props.committee} </p>
                <SignOutButton/>
            </div>
        );
    }
}



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

const condition = authUser => !!authUser;
const NavigationAuth = withAuthorization(condition)(NavigationAuthBase)

export default Navigation;
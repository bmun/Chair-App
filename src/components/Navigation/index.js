import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Navigation/index.css'
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import {AuthUserContext, withAuthorization} from '../Session';
import {Navbar, Nav} from "react-bootstrap";

const Navigation = () => (
    <div>
        <header>
            {/*<img src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-devices/40/radio-512.png"/>*/}
            <AuthUserContext.Consumer>
                {authUser => {
                    return (authUser ? <NavigationAuth/> : <NavigationNonAuth/>);
                }
                }
            </AuthUserContext.Consumer>
        </header>
    </div>
);

class NavigationAuthBase extends Component {

    render() {
        return (
                <Navbar expand="lg" bg="light">
                    <Navbar.Brand href={ROUTES.LANDING}>Radio</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href={ROUTES.LANDING}>Landing</Nav.Link>
                            <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
                            <Nav.Link href={ROUTES.GRADING}>Grading</Nav.Link>
                            <Nav.Link href={ROUTES.POST}>Post</Nav.Link>
                            <Nav.Link href={ROUTES.WATCH}>Watch</Nav.Link>
                        </Nav>
                        <span className="my-2 my-lg-0">
                            <span className="navbar-text"> Welcome, {this.props.committee}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <SignOutButton/>
                        </span>
                    </Navbar.Collapse>
                </Navbar>

        );
    }
}



const NavigationNonAuth = () => (

        <Navbar bg="light" expand="lg">
            <Navbar.Brand href={ROUTES.LANDING}>Radio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href={ROUTES.LANDING}>Landing</Nav.Link>
                    <Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
                    <Nav.Link href={ROUTES.WATCH}>Watch</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
);

const condition = authUser => !!authUser;
const NavigationAuth = withAuthorization(condition)(NavigationAuthBase)

export default Navigation;
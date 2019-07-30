import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import GradingPage from '../Grading';
import AdminPage from '../Admin';
import PostPage from '../Post';
import * as ROUTES from '../../constants/routes';
import WatchPage from "../Watch";
import { withAuthentication } from '../Session';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const App = () => (
            <Router>
                <div>
                    <Navigation />

                    <Route
                        exact
                        path={ROUTES.LANDING}
                        component={LandingPage}
                    />
                    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                    <Route
                        exact
                        path={ROUTES.PASSWORD_FORGET}
                        component={PasswordForgetPage}
                    />
                    <Route exact path={ROUTES.HOME} component={HomePage} />
                    <Route
                        exact
                        path={ROUTES.GRADING}
                        component={GradingPage}
                    />
                    <Route exact path={ROUTES.ADMIN} component={AdminPage} />
                    <Route exact path={ROUTES.POST} component={PostPage} />
                    <Route exact path={ROUTES.WATCH} component={WatchPage} />
                </div>
            </Router>
        );


export default withAuthentication(App);
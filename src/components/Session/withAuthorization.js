import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AuthUserContext from './context';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        constructor(props) {
            super(props);
            this.state = {username: "Loading..."}
        }

        getUsername = authUser => {
            let that = this;
            this.props.firebase.user(authUser.uid)
                .once('value').then(function(snapshot) {
                that.setState({username: snapshot.val()["username"]});
            })
        };

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            const {username} = this.state;
            return (
                <AuthUserContext.Consumer>
                    {authUser => {
                        if (authUser) {
                            this.getUsername(authUser);
                        }

                        return (condition(authUser) ? <Component {...this.props} committee={username}/> : null);

                    }
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;
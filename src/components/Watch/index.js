import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';


const WatchPage = () => (
    <div>
        <h1>Watch</h1>
        <WatchBox />
    </div>
);


class WatchBoxBase extends Component {
    constructor(props) {
        super(props);
        this.state = {content: ""}
    }



    initListener = () => {
        this.setState({content: "hello world!"});
        const watchRef = this.props.firebase.database.ref("users/");
        let that = this;

        function update(v) {
            that.setState({content: v["curr"]})
        }

        watchRef.on('value', function (snapshot) {
            update(snapshot.val());
        });
    };


    render() {
        const {content} = this.state;

        return (
            <div>
                <p>
                    {content}
                </p>
                <button onClick={this.initListener}> Listen </button>
            </div>



        )
    }
}

const WatchBox = compose(
    withRouter,
    withFirebase,
)(WatchBoxBase);

export default(WatchPage);

export {WatchBox};
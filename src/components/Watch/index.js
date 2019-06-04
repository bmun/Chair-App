import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import ReactMarkdown from 'react-markdown'


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
        const db = this.props.firebase.database;
        let that = this;

        function update(v) {
            that.setState({content: v["currPost"]})
        }
        db.collection("committees").doc("ICPO")
            .onSnapshot(function(doc) {
                update(doc.data())
            });
    };


    render() {
        const {content} = this.state;

        return (
            <div>
                <ReactMarkdown source={content} />
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
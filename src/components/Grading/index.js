import React, {Component} from 'react';
import Select from 'react-select';
import {withAuthorization} from "../Session";
import GradingBox from './GradingBox';
import './styles.css';

const INITIAL_STATE = {
    refreshed: false,
    delList: [],
    gotCommittee: false,
};

class GradingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE,
        };
        let gradingPage = this;
        this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
            .once('value').then(function(snapshot) {
                gradingPage.committee = snapshot.val()["username"];
            });
    }

    componentDidMount() {
        this.getDelegateList();
    }

    getDelegateList = () => {
        while (!this.state.gotCommittee) {
            console.log('wiating for committee...');
            if (this.committee) {
                let gradingPage = this;
                this.props.firebase
                .getDelegates(this.committee)
                .then(function(snapshot) {
                    let delList = snapshot.docs.map(delegates => delegates.get("country"));
                    gradingPage.setState({delList});
                    console.log(delList);
                    console.log(gradingPage.committee);
                });
                this.setState({gotCommittee: true});
            }
        }
    };

    render() {
        const {refreshed, delList, choice}  = this.state;
        let boxes = delList.length < 4 ? delList.length : 4;
        console.log(boxes);
        const arr = Array.from(new Array(boxes), (x,i) => i);
        return (
            <div className='grading-container'>{
                arr.map(i => 
                    <GradingBox
                        refreshed={refreshed}
                        current={true}
                        committee={this.props.committee}
                        firebase={this.props.firebase}
                        delegate={delList[i]}
                    />
                )
            }
            </div>
        );
    }

}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(GradingPage);
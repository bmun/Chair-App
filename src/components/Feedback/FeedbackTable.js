import React, {Component} from 'react';
import ReactTable from 'react-table';
import ModalBox from './ModalBox';
import 'react-table/react-table.css';
import './styles.css';

class FeedbackTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayModal: false,
            feedbackData: null,
        }
        this.hideModalBox = this.hideModalBox.bind(this);
    }

    displayModalBox() {
        this.setState({displayModal: true});
    }

    hideModalBox() {
        this.setState({displayModal: false});
    }

    render () {
        const columns = [
            {Header: 'Delegation', accessor: 'country',},
            {Header: 'Times Spoken', accessor: 'times',},
            {Header: 'Feedback', accessor: 'feedback',},
        ];
        const tableData = this.props.feedback.map(f => {
            return {
                country: f['country'],
                times: f['feedback'].length,
                feedback: f['feedback'] ? f['feedback'][0]['comments'] : '',
            };
        });
    
        return <div>
            {this.state.displayModal && this.state.feedbackData ? 
                <ModalBox 
                    feedback={this.state.feedbackData}
                    onClose={this.hideModalBox}
                /> 
                : null
            }
            <ReactTable 
                columns={columns} 
                data={tableData}
                getTdProps={(state, rowInfo, column, instance) => {
                    return {
                        onClick: (e, handleOriginal) => {
                            if (rowInfo && 'row' in rowInfo && !this.state.displayModal) {
                                const country = rowInfo['row']['country'];
                                const filteredFeedback = this.props.feedback.filter(f => f['country'] === country);
                                if (filteredFeedback === []) {
                                    return;
                                }
                                const feedbackData = filteredFeedback[0];
                                console.log(feedbackData);
                
                                this.setState({feedbackData: feedbackData});
                                this.displayModalBox();
        
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            } else if (this.state.displayModal) {
                                this.hideModalBox();
                            }
                        }
                    }
                }}
            />
        </div>
    }
}


export default FeedbackTable;
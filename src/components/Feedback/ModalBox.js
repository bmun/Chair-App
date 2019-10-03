import React, {Component} from 'react';
import './styles.css';

class ModalBox extends Component {
    render () {
        return (
            <div className="box">
                <span id = "close" onClick={this.props.onClose}>×</span>
                <h3>{this.props.feedback['country']}</h3>
                {this.props.feedback['feedback'].map(f => {
                    return (<div>
                        <span className = "title"> Score:</span> {f['score']}
                        <br/>
                        <span className = "title"> Feedback:</span> <br/>{f['comments']}
                        <hr/>
                    </div>);
                })}
            </div>
        );
    }
}


export default ModalBox;
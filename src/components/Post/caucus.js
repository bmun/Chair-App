import React from 'react';

const CaucusView = ({caucus}) => (
    <div>
    <h2>Current Caucus:</h2>
    <h4>Speeches Remaining: {caucus.rem}</h4>
    <h4>Speaking Time: {caucus.sp_time}</h4>
    <h4>Total Time: {caucus.time}</h4>
    <h4> Type: {caucus.type} </h4>
    <h4>Topic: {caucus.topic}</h4>
    <h4>Delegate: {caucus.del}</h4>
    </div>
);

export default CaucusView;
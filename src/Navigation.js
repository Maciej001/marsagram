import React from 'react';

const Navigation = ({sol, onSolDecrease, onSolIncrease}) => (
  <div className="sols">
    <button onClick={onSolDecrease}>{`<`}</button>
    <span>{sol}</span>
    <button onClick={onSolIncrease}>{`>`}</button>
  </div>
);

export default Navigation;

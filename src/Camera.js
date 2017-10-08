import React from 'react';

const Camera = ({ name, active, onClick }) => (
  <button data-name={name} className={`${active ? 'active' : ''}`} onClick={onClick}>
    {name}
  </button>
);

export default Camera;

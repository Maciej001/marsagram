import React from "react";
import Camera from './Camera'

const Cameras = ({ cameras, activeCamera, onClick }) => (
  <div className="cameras">
    {cameras.map(camera => (
      <Camera
        key={camera}
        name={camera}
        active={camera === activeCamera}
        onClick={onClick}
      />
    ))}
  </div>
)

export default Cameras;

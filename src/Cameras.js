import React from "react";
import Camera from './Camera'

const Cameras = ({ data, activeCamera, onClick }) => (
  <div className="cameras">
    {data.map(camera => (
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

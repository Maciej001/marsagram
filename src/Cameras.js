import React from "react";
import Camera from './Camera'

const Cameras = ({ cameras, activeCamera, onClick, isLoadingCameras }) => {
  if (isLoadingCameras) {
    return (
      <div>
        <p>Loading cameras...</p>
      </div>
    )
  }

  if (!cameras || !cameras.length) {
    return (
      <div>
        <p>There are no data for chosen sol.</p>
      </div>
    )
  }

  return (
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
};

export default Cameras;

import React from 'react';
import Camera from './Cameras';

const withCamerasLoadingOrEmpty = (Component) => props => {
  if ( props.isLoadingCameras ) {
    return (
      <div>
        <p>Loading cameras...</p>
      </div>
    )
  }

  if (!props.cameras || !props.cameras.length) {
    return (
      <div>
        <p>There are no data for chosen sol.</p>
      </div>
    )
  }

  return <Component {...props} />
};

const CamerasWithLoadingOrEmpty = withCamerasLoadingOrEmpty(Camera);

export default CamerasWithLoadingOrEmpty;

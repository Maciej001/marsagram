import React from 'react';
import Cameras from './Cameras';

const withLoadingOrEmpty = (Component) => props => {
  if ( props.isLoading ) {
    return (
      <div>
        <p>{props.messages.onLoading}</p>
      </div>
    )
  }

  if (!props.data || !props.data.length) {
    return (
      <div>
        <p>{props.messages.onNoData}</p>
      </div>
    )
  }

  return <Component {...props} />
};

const CameraWithLoadingOrEmpty = withLoadingOrEmpty(Cameras);

export default CameraWithLoadingOrEmpty;

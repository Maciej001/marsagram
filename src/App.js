import React, { Component } from "react";
import { connect } from "react-redux";
import {
  doSetRover,
  doSetSol,
  doSetCameras,
  doSetCamera,
  doSetPhotos,
  doIsLoadingCameras,
  doSetManifestLoadingError,
} from "./appReducer";

import "./App.css";

import Rovers from "./Rovers";
import CameraWithLoadingOrEmpty from "./CameraWithLoadingOrEmpty";
import Navigation from "./Navigation";
import Images from "./Images";
import ImagesWithFetching from "./ImagesWithFetching";

const API = "https://api.nasa.gov/mars-photos/api/v1/manifests/";
const API_KEY = "LbFYO3SNWbNiztw71oMQpzChpytNi5uFxhKe7ZR0";
const API_IMAGES = "https://api.nasa.gov/mars-photos/api/v1/rovers/";

const rovers = ["curiosity", "opportunity", "spirit"];

const solChangeDirection = {
  increase: 1,
  decrease: -1
};

class App extends Component {

  componentDidMount() {
    this.fetchManifest(this.props.activeRover);
  }

  fetchManifest = rover => {
    const {
      sol,
      photos,
      onSetPhotos,
      onSetCameras,
      onManifestLoadingError,
      onIsLoadingCameras
    } = this.props;

    if (photos[rover].length === 0) {
      this.setState({ isLoadingCameras: true });

      const query = `${rover}?api_key=${API_KEY}`;

      onIsLoadingCameras(true);

      fetch(API + query)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error fetching manifest");
          }
        })
        .then(data => {
          onIsLoadingCameras(false);
          const photos = data.photo_manifest.photos;

          onSetPhotos(photos, rover);

          const cameras = photos.find( photo =>
            photo.sol === sol).cameras;

          onSetCameras(cameras);
        })
        .catch(error => {
          onManifestLoadingError(error);
          onIsLoadingCameras(false);
        });
    }
  };

  onRoverClick = e => {
    const rover = e.target.dataset.name;
    this.props.onSetRover(rover);
    this.fetchManifest(rover);
  };

  onCameraClick = e => this.props.onSetCamera(e.target.dataset.name);

  onSolDecrease = () =>
    this.onSolChange(this.props.sol, solChangeDirection.decrease);

  onSolIncrease = () =>
    this.onSolChange(this.props.sol, solChangeDirection.increase);

  // sol numbers start at 0
  onSolChange = (sol, direction) => {
    this.props.onSetSol(sol, direction)

    this.setCameras({
      photos: this.state.photos[this.state.activeRover],
      sol: this.props.sol + direction
    });
  };

  onSolChange = (sol, direction) => {
    this.props.onSetSol(sol, direction);

    const photos = this.props.photos[this.props.activeRover];
    const solPhotos =
      photos.find(photo => photo.sol === this.props.sol)
    const cameras = solPhotos ? solPhotos.cameras : [];
    this.props.onSetCameras(cameras);
  };

  render() {
    const imagesQuery = `${this.props.activeRover}/photos?sol=${this.props
      .sol}&camera=${this.props.activeCamera}&api_key=${API_KEY}`;

    const messages = {
      onLoading: "Loading cameras...",
      onNoData: "No data for chosen sol."
    }

    return (
      <div className="container">
        <h1>Marsagram</h1>

        <Rovers
          rovers={this.props.rovers}
          activeRover={this.props.activeRover}
          onClick={this.onRoverClick}
        />

        <CameraWithLoadingOrEmpty
          data={this.props.cameras}
          messages={messages}
          activeCamera={this.props.activeCamera}
          onClick={this.onCameraClick}
          isLoading={this.props.isLoadingCameras}
        />

        <Navigation
          sol={this.props.sol}
          onSolDecrease={this.onSolDecrease}
          onSolIncrease={this.onSolIncrease}
        />

        {this.props.cameras && <ImagesWithFetching url={`${API_IMAGES}${imagesQuery}`} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rovers: state.rovers,
  activeRover: state.activeRover,
  photos: state.photos,
  sol: state.sol,
  cameras: state.cameras,
  activeCamera: state.activeCamera,
  isLoadingCameras: state.isLoadingCameras,
  manifestError: state.manifestError
});

const mapDispatchToProps = dispatch => ({
  onSetRover: rover => dispatch(doSetRover(rover)),
  onSetSol: (sol, change) => dispatch(doSetSol(sol, change)),
  onSetCameras: cameras => dispatch(doSetCameras(cameras)),
  onSetCamera: camera => dispatch(doSetCamera(camera)),
  onSetPhotos: (photos, rover) => dispatch(doSetPhotos(photos, rover)),
  onIsLoadingCameras: isLoading => dispatch(doIsLoadingCameras(isLoading)),
  onManifestLoadingError: (error) => dispatch(doSetManifestLoadingError(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

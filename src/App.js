import React, { Component } from "react";
import "./App.css";

import Rovers from "./Rovers";
import Cameras from "./Cameras";
import Navigation from "./Navigation";
import Images from "./Images";

const API = "https://api.nasa.gov/mars-photos/api/v1/manifests/";
const API_KEY = "LbFYO3SNWbNiztw71oMQpzChpytNi5uFxhKe7ZR0";

const rovers = ["curiosity", "opportunity", "spirit"];

const solChangeDirection = {
  increase: 1,
  decrease: -1
};

class App extends Component {
  state = {
    activeRover: "curiosity",
    cameras: [],
    activeCamera: "",
    photos: {
      curiosity: [],
      opportunity: [],
      spirit: []
    },
    error: null,
    isLoadingCameras: true,
    sol: 78
  };

  componentDidMount() {
    this.fetchManifest(this.state.activeRover);
  }

  fetchManifest = rover => {

    // Fetch manifest data for chosen rover if is's not present in state yet

    if (this.state.photos[rover].length === 0) {
      this.setState({ isLoadingCameras: true });

      const query = `${rover}?api_key=${API_KEY}`;

      fetch(API + query)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error fetching manifest");
          }
        })
        .then(data => {
          const photos = data.photo_manifest.photos;

          this.setState({
            photos: { ...this.state.photos, [`${rover}`]: photos },
            isLoadingCameras: false
          });
          this.setCameras({
            photos,
            sol: this.state.sol
          });
        })
        .catch(error => this.setState({ error, isLoadingCameras: false }));
    }
  };

  onRoverClick = e => {
    this.setState({
      activeRover: e.target.dataset.name
    });

    this.fetchManifest(e.target.dataset.name);
  };

  onCameraClick = e => this.setState({ activeCamera: e.target.dataset.name });

  onSolDecrease = () =>
    this.onSolChange(solChangeDirection.decrease, this.state.sol);
    
  onSolIncrease = () =>
    this.onSolChange(solChangeDirection.increase, this.state.sol);

  // sol numbers start at 0
  onSolChange = (direction, sol) => {
    if (sol + direction >= 0) {
      this.setState({ sol: sol + direction });
    }
    this.setCameras({
      photos: this.state.photos[this.state.activeRover],
      sol: sol + direction
    });
  };

  setCameras = ({ photos, sol }) => {
    const cameras = photos.find(photo => photo.sol === sol);
    this.setState({
      cameras: cameras ? photos[sol].cameras : null,
      activeCamera: cameras ? photos[sol].cameras[0] : null
    });
  };

  render() {
    return (
      <div className="container">
        <h1>Marsagram</h1>

        <Rovers
          rovers={rovers}
          activeRover={this.state.activeRover}
          onClick={this.onRoverClick}
        />

        <Cameras
          cameras={this.state.cameras}
          activeCamera={this.state.activeCamera}
          onClick={this.onCameraClick}
          isLoadingCameras={this.state.isLoadingCameras}
        />

        <Navigation
          sol={this.state.sol}
          onSolDecrease={this.onSolDecrease}
          onSolIncrease={this.onSolIncrease}
        />

        <Images
          rover={this.state.activeRover}
          camera={this.state.activeCamera}
          sol={this.state.sol}
        />
      </div>
    );
  }
}

export default App;

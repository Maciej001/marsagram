import React, { Component } from "react";

const API = "https://api.nasa.gov/mars-photos/api/v1/rovers/";
const API_KEY="LbFYO3SNWbNiztw71oMQpzChpytNi5uFxhKe7ZR0";

class Images extends Component {
  state = {
    imageUrls: []
  };

  componentDidMount() {
    const { rover, camera, sol } = this.props;
    this.fetchData( rover, camera, sol );
  }

  componentWillReceiveProps(nextProps) {
    const { rover, camera, sol } = nextProps;
    this.fetchData( rover, camera, sol );
  }

  fetchData = (rover, camera, sol) => {
    const query = `${rover}/photos?sol=${sol}&camera=${camera}&api_key=${API_KEY}`;
    fetch(API + query)
      .then(response => response.json())
      .then(data => {
        const imageUrls = data.photos.map(image => image.img_src);
        this.setState({ imageUrls });
      });
  }

  populateState = data => {
    this.setState({ imageUrls: data.map(item => item.img_src) });
  };

  render() {
    return (
      <div className="images">
        {this.state.imageUrls.map(imgUrl => (
          <img key={imgUrl} src={imgUrl} className="image" />
        ))}
      </div>
    );
  }
}

export default Images;

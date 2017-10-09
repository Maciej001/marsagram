# Higher Order Components and Redux Workshop

## Introduction to Marsagram

There are three Mars rovers:

 - Curiosity (landing 2012)
 - Opportunity (landing 2004)
 - Spirit (landing 2004)

Every Mars rover, has several [cameras](https://api.nasa.gov/api.html#MarsPhotos), but different sets of cameras were used to make photographs every sol.

Sol is the martian rotational day, and it's value is counted from the day of rover's landing (Day 0).

You can chose the rover, camera (if available) and sol. Marsagram pulls the photos from NASA API and displays them (if available).

The App consists of 4 main components

 - Rovers - enables you to chose the rover
 - Cameras - display the available cameras
 - Navigation - allows to go back and forth in time (sols)
 - Images - display available images pulled from the NASA API

![Marsagram](https://s3-eu-west-1.amazonaws.com/codecamps/marsagram/marsagram.jpg)

### How Marsagram works

At first, Marsagram fetches the manifest data for the chosen rover.
```
{
  photo_manifest: {
    name: "Opportunity",
    ...
    photos: [
	  {
	    sol: 1,
	    total_photos: 96,
	    cameras: ["ENTRY", "FHAZ", ...]
	  }
	]
}
```

After fetching manifest data we are storing in `state` only the `photos` array for the chosen rover. This is how we know which cameras are available for the rover on the given sol. We can chose the different rover and if the photos array for it is not available in store we are pulling the data from the API.

Next we display all available cameras in `<Cameras />` component.

Rover name, camera name and sol number are passed to `<Images />` component.
Images component, based on this data fetches and displays the photographs.

### Clone Marsagram

```
git clone git@github.com:Maciej001/marsagram.git
cd marsagram
npm install
npm start
```

## Higher Order Components (HOC)
Higher order components are the functions that take a child component, mixes in some additional parameters and returns the components with additional functionalities.

We have the function
```
const multiplyByTwo = (x) => 2*x;
```

Let's create another function  that takes an argument `y` and `childFunction`,  and then it executes the child function but also adds it's own flavour to the result - it adds `3` to the result:
```
const addThreeFlavour = (y) => childFunction => childFunction(y) + 3;
```

When you execute the add `addThreeFlavour`:
```
addThreeFlavour(4)(multiplyByTwo) // 11
```
What happens now is `addThreeFlavour` will take `4` and return the function that will first execute `childFunction` on `4` and add `3` to the result.

Translating this into the React language:

 - you can create your component (`multiplyByTwo`)
 - create a HOC (`addThreeFlavour`) and pass your component to it
 - get a smarter  component

### Marsagram with HOC
Let's go to `Cameras.js`. A typical component that waits for the date
If the data is still loading we want to display the information that we are waiting for data.
If we received the data, but there is nothing to show, let's tell our users about it.
If we have everything that we need, let's just display the data.

What we can do here is we can remove the two first conditions and encapsulate our main component into HOC that will take care of the edge cases.

```
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
```

Let's create the HOC that will accept the Components, that receives props and returns:

 - Loading indicator - if the data is still loading
 - Information about missing data
 - original components

```
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
```

Last thing to do is to remove the edge cases from `Cameras.js`, so it takes care of only the basic functionality of displaying cameras.

```
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
```

Don't forget to replace in `App.js`,  our `<Cameras />` component with the new and smarter `<CamerasWithLoadingOrEmpty />`.
`<CamerasWithLoadingOrEmpty />`  from now on will also take care of passing all the necessary `props` to `<Cameras />` component.


### HOC fetching data wrapper for Marsagram
Higher order components can get more interesting. Instead of simple functions you can use classes  that extend `React.Component`.
Such components can create also it's own local state.

Our `<Images />` component is responsible for fetching photos from NASA API.
Let's move the fetching logic to the HOC!

It should return the component only if the fetch is successful and there are photos to display.
```
import React, {Component} from 'react';

const withFetching = url => Comp =>
   class WithFetch extends Component {
    state = {
      data: {},
      isLoading: false,
      error: null
    }

    componentDidMount() {
      this.fetchData(url);
    }

    componentWillReceiveProps(nextProps) {
      this.fetchData(url);
    }

    fetchData = (url) => {
      this.setState({ isLoading: true });

      fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ data, isLoading: false }) )
        .catch( error => this.setState({error, isLoading: false }) )
    }

    render() {
      if (this.state.isLoading) {
        return <p>Loading...</p>
      }

      if (this.state.error) {
        return <p>Fetching data error.</p>
      }

      if (
	      !this.state.data ||
	      !this.state.data.photos ||
	      this.state.data.photos.length === 0
	    ) {
	      return <p>There are no images available from this camera.</p>
	    }

      return <Comp {...this.props} {...this.state} />
    }
  }

export default withFetching;
```

This time we are not only passing props to the component but also `this.state`. The state holds the fetched data if the fetch was successful.

Now change your `App.js` file:
```
const imagesQuery = `${this.state.activeRover}/photos?sol=${this.state
      .sol}&camera=${this.state.activeCamera}&api_key=${API_KEY}`;
const API_IMAGES = "https://api.nasa.gov/mars-photos/api/v1/rovers/";

class App extends Component {
  ...
  render() {
    const ImagesWithFetching = withFetching(
      API_IMAGES + imagesQuery
    )(Images);

    return (
      <div>
        ...
        {this.state.cameras && <ImagesWithFetching />}
      </div>
    )
  }
}
```

and the `Images.js`, which can be transformed from the class component into functional component.

```
import React from "react";

const Images = ({ data }) => {
  const imageUrls = data.photos.map(image => image.img_src);

  return (
    <div className="images">
      {imageUrls.map(imgUrl => (
        <img key={imgUrl} src={imgUrl} className="image"/>
      ))}
    </div>
  );
};

export default Images;
```




## Additional information

**API to get the manifest file for the given rover**
API: `https://api.nasa.gov/mars-photos/api/v1/`
Manifest for each rover: `/manifests/rover_name`
Add your API_KEY at the end of the query, eg:
`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=your_api_key`

**API to get the photos (you need to know: rover_name, camera_name and sol_number)**
API: `https://api.nasa.gov/mars-photos/api/v1/rovers/`
Query: "rover_name/photos?sol=sol_number&camera=camera_name&api_key=your_api_key`

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

## Additional information

**API to get the manifest file for the given rover**
API: `https://api.nasa.gov/mars-photos/api/v1/`
Manifest for each rover: `/manifests/rover_name`
Add your API_KEY at the end of the query, eg:
`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=your_api_key`

**API to get the photos (you need to know: rover_name, camera_name and sol_number)**
API: `https://api.nasa.gov/mars-photos/api/v1/rovers/`
Query: "rover_name/photos?sol=sol_number&camera=camera_name&api_key=your_api_key`

## Marsagram

There are three Mars rovers:

 - Curiosity (landing 2012)
 - Opportunity (landing 2004)
 - Spirit (landing 2004)

Every Mars rover, has several [cameras](https://api.nasa.gov/api.html#MarsPhotos), but different sets of cameras were used to make photographs every sol.

Sol is the martian rotational day, and it's value is counted from the day of rover's landing (Day 0).

You can chose the rover, camera (if available) and sol. Marsagram pulls the photos from NASA API and displays them (if available).

## Additional information

**API to get the manifest file for the given rover**
API: `https://api.nasa.gov/mars-photos/api/v1/`
Manifest for each rover: `/manifests/rover_name`
Add your API_KEY at the end of the query, eg:
`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=your_api_key`

**API to get the photos (you need to know: rover_name, camera_name and sol_number)**
API: `https://api.nasa.gov/mars-photos/api/v1/rovers/`
Query: "rover_name/photos?sol=sol_number&camera=camera_name&api_key=your_api_key`

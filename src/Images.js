import React from "react";

const Images = ({ data }) => {

  if (
    !data.photos ||
    data.photos.length === 0
  ) {
    return <p>There are no images available from this camera.</p>;
  }

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

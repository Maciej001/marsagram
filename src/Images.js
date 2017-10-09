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

import React, { useState } from 'react';
// import './App.css';

function UploadImage() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="App">
      <h1>Chọn ảnh từ máy và hiển thị</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '500px', maxHeight: '500px' }} />
        </div>
      )}
    </div>
  );
}

export default UploadImage;

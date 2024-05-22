import React, { useState } from "react";
// import openai from "openai";
const Dalle3Component = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");

const handleGenerateImage = async () => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer "
            },
            body: JSON.stringify({
                model: "dall-e-2",
                prompt: "một con mèo",
                n: 1,
                size: "1024x1024"
            })
        });
    
        const data = await response.json();
        setImageUrl(data.data[0].url);
    } catch (error) {
        console.error(error);
    }
};



  return (
    <div>
      <input
        type="text"
        placeholder="Nhập prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerateImage}>Tạo hình ảnh</button>

      {imageUrl && <img src={imageUrl} alt="Hình ảnh được tạo" />}
    </div>
  );
};

export default Dalle3Component;
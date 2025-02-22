import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [sketch, setSketch] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setSketch(null); // Reset previous sketch
        if (file) {
            setPreview(URL.createObjectURL(file)); // Show preview before uploading
        }
    };
    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image first.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                responseType: "blob", // Ensure response is treated as an image
            });

            console.log("Response received:", response); // Debugging log

            const imageBlob = new Blob([response.data], { type: "image/png" });
            const imageURL = URL.createObjectURL(imageBlob);

            console.log("Generated Sketch URL:", imageURL); // Debugging log

            setSketch(imageURL);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Upload an Image</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Convert to Sketch</button>

            {loading && <p>Processing...</p>}

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                {/* Show original image */}
                {preview && (
                    <div>
                        <h3>Original Image:</h3>
                        <img src={preview} alt="Original" style={{ maxWidth: "300px", height: "auto" }} />
                    </div>
                )}

                {/* Show converted sketch */}
                {sketch && (
                    <div>
                        <h3>Converted Sketch:</h3>
                        <img src={sketch} alt="Sketch" style={{ maxWidth: "300px", height: "auto" }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadImage;

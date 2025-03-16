document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Set up canvas
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size to match the image, but triple the width
                canvas.width = img.width * 3;
                canvas.height = img.height;
                
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imgData = ctx.getImageData(0, 0, canvas.width / 3, canvas.height);
                const data = imgData.data;
                
                // Create new image data for the output (width * 3 for RGB subpixel separation)
                const newImgData = ctx.createImageData(canvas.width, canvas.height);

                // Process each pixel and split into RGB subpixels
                for (let y = 0; y < img.height; y++) {
                    for (let x = 0; x < img.width; x++) {
                        // Find pixel index in the original image
                        const index = (y * img.width + x) * 4;
                        const r = data[index];       // Red channel
                        const g = data[index + 1];   // Green channel
                        const b = data[index + 2];   // Blue channel

                        // Set the red subpixel in the first third of the width
                        newImgData.data[(y * canvas.width + x * 3) * 4] = r;
                        newImgData.data[(y * canvas.width + x * 3) * 4 + 1] = 0;
                        newImgData.data[(y * canvas.width + x * 3) * 4 + 2] = 0;
                        newImgData.data[(y * canvas.width + x * 3) * 4 + 3] = 255;

                        // Set the green subpixel in the second third of the width
                        newImgData.data[(y * canvas.width + x * 3 + 1) * 4] = 0;
                        newImgData.data[(y * canvas.width + x * 3 + 1) * 4 + 1] = g;
                        newImgData.data[(y * canvas.width + x * 3 + 1) * 4 + 2] = 0;
                        newImgData.data[(y * canvas.width + x * 3 + 1) * 4 + 3] = 255;

                        // Set the blue subpixel in the third third of the width
                        newImgData.data[(y * canvas.width + x * 3 + 2) * 4] = 0;
                        newImgData.data[(y * canvas.width + x * 3 + 2) * 4 + 1] = 0;
                        newImgData.data[(y * canvas.width + x * 3 + 2) * 4 + 2] = b;
                        newImgData.data[(y * canvas.width + x * 3 + 2) * 4 + 3] = 255;
                    }
                }

                // Put the new image data onto the canvas
                ctx.putImageData(newImgData, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

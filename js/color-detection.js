const colorNames = {
    "red": "Red",
    "orange": "Orange",
    "yellow": "Yellow",
    "green": "Green",
    "blue": "Blue",
    "purple": "Purple",
    "pink": "Pink",
    "brown": "Brown",
    "black": "Black",
    "white": "White",
    "gray": "Gray"
};
async function startColorDetection(placeholderDiv) {
    try {
        // Show loading state
        placeholderDiv.querySelector('#webcam-placeholder').innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i><br>Starting camera...</div>';
        
        // Get references to elements
        const cameraContainer = placeholderDiv.querySelector('#cameraContainer');
        const colorPointer = placeholderDiv.querySelector('#colorPointer');
        const colorBox = placeholderDiv.querySelector('#colorBox');
        const colorName = placeholderDiv.querySelector('#colorName');
        const colorValue = placeholderDiv.querySelector('#colorValue');
        const colorHex = placeholderDiv.querySelector('#colorHex');
        const colorInfo = placeholderDiv.querySelector('.color-info');
        
        // Clear any existing video elements
        const existingVideo = cameraContainer.querySelector('video');
        if (existingVideo) {
            existingVideo.remove();
        }
        
        // Clear any existing canvas elements
        const existingCanvas = cameraContainer.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.id = 'colorVideoElement';
        videoElement.autoplay = true;
        videoElement.playsinline = true;
        cameraContainer.appendChild(videoElement);
        
        // Show camera container and hide placeholder
        cameraContainer.style.display = 'block';
        colorInfo.style.display = 'block';
        placeholderDiv.querySelector('#webcam-placeholder').style.display = 'none';
        
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 300 }, 
                height: { ideal: 225 },
                facingMode: 'environment'
            } 
        });
        
        videoElement.srcObject = stream;
        
        let isTracking = true;
        let videoWidth, videoHeight;
        let scaleX = 1, scaleY = 1;
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        videoElement.onloadedmetadata = () => {
            videoWidth = videoElement.videoWidth;
            videoHeight = videoElement.videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            
            // Calculate scale factors
            const displayWidth = cameraContainer.offsetWidth;
            const displayHeight = cameraContainer.offsetHeight;
            scaleX = videoWidth / displayWidth;
            scaleY = videoHeight / displayHeight;
            
            // Start tracking
            trackColor();
        };
        
        // Mouse movement handler
        cameraContainer.addEventListener('mousemove', (e) => {
            const rect = cameraContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            colorPointer.style.left = `${x}px`;
            colorPointer.style.top = `${y}px`;
        });
        
        function trackColor() {
            if (!isTracking) return;
            
            // Draw video frame to canvas
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Get pointer position
            const pointerRect = colorPointer.getBoundingClientRect();
            const containerRect = cameraContainer.getBoundingClientRect();
            const x = (pointerRect.left + 10 - containerRect.left) * scaleX;
            const y = (pointerRect.top + 10 - containerRect.top) * scaleY;
            
            // Get pixel color
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const [r, g, b] = pixel;
            updateColorInfo(r, g, b);
            
            requestAnimationFrame(trackColor);
        }
        
        function getColorName(r, g, b) {
            // Convert to HSV for better color classification
            const [h, s, v] = rgbToHsv(r, g, b);
            
            if (v < 0.2) return "black";
            if (s < 0.1) return v > 0.9 ? "white" : "gray";
            
            if (h < 15) return "red";
            if (h < 45) return "orange";
            if (h < 70) return "yellow";
            if (h < 160) return "green";
            if (h < 240) return "blue";
            if (h < 280) return "purple";
            if (h < 330) return "pink";
            return "red";
        }

        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16).padStart(2, '0');
                return hex;
            }).join('');
        }

        function updateColorInfo(r, g, b) {
            const hex = rgbToHex(r, g, b);
            const colorType = getColorName(r, g, b);
            colorBox.style.backgroundColor = `rgb(${r},${g},${b})`;
            colorName.textContent = colorNames[colorType] || colorType;
            if (colorNames[colorType]  === "Red"){
                colorValue.textContent = "A color used to signal danger (red lights, stop signs, fire trucks,…). The color can be associated with the emotion aggressive or passionate.";
            }
            else if (colorNames[colorType] === "Blue"){
                colorValue.textContent = "An interesting color that can represent hope and resilience or sadness and loneliness (sky, ocean)";
            }
            else if (colorNames[colorType]  === "Orange"){
                colorValue.textContent = "A warm color, it can be associated to energizing things (sunset, traffic cones)";
            }
            else if (colorNames[colorType]  === "Yellow"){
            colorValue.textContent = "A bright color, representing things that bring joy and happiness to the mind, but it can also as a signal to be cautious (sunshine, cautious signs) (less dangerous than red) ";
            }
            else if (colorNames[colorType]  === "Pink"){
                colorValue.textContent = "A soft and comforting color, often associating with love and compassion. (Roses, candy)";
            }
            else if (colorNames[colorType]  === "Brown"){
                colorValue.textContent = "Represents earthiness and warmth, providing a welcoming atmosphere";
            }
            else if (colorNames[colorType]  === "Black"){
            colorValue.textContent = "Black represents darkness, giving people the feelings of power or depression (Night, dark thoughts)";
            }
            else if (colorNames[colorType]  === "White"){
                colorValue.textContent = "White symbolizes a fresh start, a clean sheet, the light at the end of the tunnel, it gives people hope and peace (snow, clean sheets)";
            }
            else if (colorNames[colorType]  === "Gray"){
            colorValue.textContent = "Gray is often seen as neutral, or in between, representing the feelings of unsure and lost (fog, cloudy sky).";
            }
            else if (colorNames[colorType]  === "Purple"){
            colorValue.textContent = "Purple is an iconic color used to describe luxury and mystery";
            }
            else if (colorNames[colorType]  === "Green"){
            colorValue.textContent = "Green is a color that is associated with nature and life, signaling peace and safety (traffic lights, grass)";
            }
        }
        function rgbToHsv(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, v = max;
            const d = max - min;
            s = max === 0 ? 0 : d / max;
            
            if (max === min) {
                h = 0;
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            
            return [h * 360, s, v];
        }
        return {
            stop: () => {
                isTracking = false;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                // Remove video and canvas elements
                const videoElement = cameraContainer.querySelector('video');
                if (videoElement) videoElement.remove();
                const canvas = cameraContainer.querySelector('canvas');
                if (canvas) canvas.remove();
                
                cameraContainer.style.display = 'none';
                placeholderDiv.querySelector('#webcam-placeholder').style.display = 'flex';
                placeholderDiv.querySelector('#webcam-placeholder').innerHTML = '<i class="fas fa-images"></i>';
            }
        };
        
    } catch (error) {
        console.error("Camera error:", error);
        placeholderDiv.querySelector('#webcam-placeholder').innerHTML = 
            `<div style="text-align: center; color: red;">
                <i class="fas fa-exclamation-triangle"></i><br>
                ${error.message || 'Could not access camera'}
            </div>`;
        throw error;
    }
}
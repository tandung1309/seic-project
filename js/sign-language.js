const TM_URL = "https://teachablemachine.withgoogle.com/models/qnB5y_nOP/";
let tmModel, tmWebcam, tmLabelContainer, tmMaxPredictions;

async function initSignLanguage(placeholderDiv, resultDiv) {
    try {
        const modelURL = TM_URL + "model.json";
        const metadataURL = TM_URL + "metadata.json";

        tmModel = await tmImage.load(modelURL, metadataURL);
        tmMaxPredictions = tmModel.getTotalClasses();

        const flip = true;
        tmWebcam = new tmImage.Webcam(300, 225, flip);
        await tmWebcam.setup();
        await tmWebcam.play();
        window.requestAnimationFrame(() => signLanguageLoop(resultDiv));

        placeholderDiv.innerHTML = `
            <div id="webcam-container"></div>
            <div id="label-container" style="text-align: center; margin-top: 10px; font-weight: bold;"></div>
        `;
        document.getElementById("webcam-container").appendChild(tmWebcam.canvas);
        tmLabelContainer = document.getElementById("label-container");
        tmLabelContainer.appendChild(document.createElement("div"));
        
        return true;
    } catch (error) {
        console.error("Error initializing Sign Language model:", error);
        placeholderDiv.innerHTML = '<div style="text-align: center; color: red;">Cannot open camera</div>';
        return false;
    }
}

async function signLanguageLoop(resultDiv) {
    tmWebcam.update();
    await predictSignLanguage(resultDiv);
    window.requestAnimationFrame(() => signLanguageLoop(resultDiv));
}

async function predictSignLanguage(resultDiv) {
    const prediction = await tmModel.predict(tmWebcam.canvas);
    
    let highestPrediction = { className: "", probability: 0 };
    for (let i = 0; i < tmMaxPredictions; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }

    if (highestPrediction.probability > 0.5) {
        resultDiv.innerHTML = `Sign language result: ${highestPrediction.className}`;
    } else {
        resultDiv.innerHTML = "Progressing...";
    }
}
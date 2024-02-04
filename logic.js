// static/script.js

let model;

async function loadModel() {
    try {
        model = await tf.loadGraphModel('your_model_url');
        console.log('Model loaded successfully.');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

async function startVideo() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.addEventListener('loadeddata', async () => {
            await loadModel();
            detectSignLanguage(video, context);
        });
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

async function detectSignLanguage(video, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    while (true) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const inputTensor = tf.browser.fromPixels(imageData).expandDims(0).toFloat();
        
        // Replace the following line with actual sign language detection logic
        const predictions = await model.executeAsync(inputTensor);

        // Display or process the predictions as needed
        console.log(predictions);

        tf.dispose([inputTensor, predictions]);
        
        // Use requestAnimationFrame for smooth video processing
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}


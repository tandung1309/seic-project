// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tool-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    const startWebcamButtons = document.querySelectorAll('.start-webcam');
    let webcamActive = false;

    startWebcamButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const parentTab = this.closest('.tool-content');
            const placeholderDiv = parentTab.querySelector('#webcam-placeholder');
            const resultDiv = parentTab.querySelector('.result-display > div:last-child');

            if (!webcamActive) {
                webcamActive = true;
                this.innerHTML = '<i class="fas fa-stop"></i> Close camera';
                
                if (parentTab.id === 'sign-language') {
                    placeholderDiv.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i><br>Camera is running</div>';
                    const success = await initSignLanguage(placeholderDiv, resultDiv);
                    if (!success) {
                        webcamActive = false;
                        this.innerHTML = '<i class="fas fa-video"></i> Open camera';
                    }
                } else if (parentTab.id === 'color-detection') {
                    try {
                        colorDetectionInstance = await startColorDetection(parentTab);
                    } catch (error) {
                        webcamActive = false;
                        this.innerHTML = '<i class="fas fa-video"></i> Open camera';
                    }
                }
            } else {
                webcamActive = false;
                this.innerHTML = '<i class="fas fa-video"></i> Open camera';
                
                if (parentTab.id === 'sign-language') {
                    if (tmWebcam) tmWebcam.stop();
                    placeholderDiv.innerHTML = '<i class="fas fa-camera"></i>';
                } else if (parentTab.id === 'color-detection') {
                    if (colorDetectionInstance) colorDetectionInstance.stop();
                    placeholderDiv.innerHTML = '<i class="fas fa-images"></i>';
                }
            }
        });
    });

    document.getElementById('image-upload').addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const parentTab = this.closest('.tool-content');
            const placeholderDiv = parentTab.querySelector('#webcam-placeholder');
            
            placeholderDiv.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i><br>Processing...</div>';
            
            setTimeout(() => {
                document.getElementById('color-detection-result').innerHTML = 
                    'Main colors: Red (60%), Black (25%), White (15%)';
            }, 1500);
        }
    });

    async function uploadFile() {
        const form = document.getElementById('uploadForm');
        const formData = new FormData(form);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.style.display = 'block';
            downloadLink.download = 'converted.mp3';
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
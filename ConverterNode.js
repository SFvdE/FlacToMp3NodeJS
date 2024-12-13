const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 'select port';

// Multer file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('path/to/website/folder'));

app.post('/convert', upload.single('flacFile'), (req, res) => {
    const tempFilePath = path.join(__dirname, 'uploads', `${Date.now()}.flac`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const outputFilePath = path.join(__dirname, 'uploads', `${Date.now()}.mp3`);

    const cleanupFiles = () => {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
    };

    ffmpeg(tempFilePath)
        .toFormat('mp3')
        .on('end', () => {
            res.download(outputFilePath, 'converted.mp3', (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                }

                fs.unlinkSync(tempFilePath);
                fs.unlinkSync(outputFilePath);
            });
        })
        .on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).send('Conversion error');
        })
        .save(outputFilePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
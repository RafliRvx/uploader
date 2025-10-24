const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const { file } = req.query;
    
    if (!file) {
        return res.status(400).send('File not specified');
    }

    const filePath = path.join('/tmp', file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    // Set appropriate headers
    const ext = path.extname(file).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain'
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream file
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
};

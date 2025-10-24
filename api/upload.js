const { IncomingForm } = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new IncomingForm({
        uploadDir: '/tmp',
        keepExtensions: true
    });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileExt = path.extname(file.originalFilename || file.name);
        const fileName = uuidv4() + fileExt;
        const filePath = path.join('/tmp', fileName);

        // Copy file to tmp directory
        fs.copyFileSync(file.filepath, filePath);

        res.status(200).json({
            success: true,
            filename: fileName,
            url: `https://${req.headers.host}/${fileName}`,
            size: file.size,
            type: file.mimetype
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

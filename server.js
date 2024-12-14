const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/all-images', (req, res) => {
    const imgPath = path.join(__dirname, 'img');
    const allImages = [];

    function readImagesFromDir(dir) {
        try {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    readImagesFromDir(filePath);
                } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                    // Usar ruta relativa desde la raíz del proyecto
                    const relativePath = path.relative(__dirname, filePath);
                    allImages.push(relativePath);
                }
            });
        } catch (error) {
            console.error('Error leyendo directorio:', error);
        }
    }

    readImagesFromDir(imgPath);
    res.json(allImages);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
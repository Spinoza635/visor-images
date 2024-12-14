const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Ruta absoluta a la carpeta externa de imágenes
const EXTERNAL_IMAGE_PATH = '/home/eddison/visor-images/img'; // Ajusta esta ruta

// Servir archivos estáticos desde la carpeta del proyecto
app.use(express.static(__dirname));
// Servir archivos estáticos desde la carpeta externa de imágenes
app.use('/external-images', express.static(EXTERNAL_IMAGE_PATH));

app.get('/all-images', (req, res) => {
    const imgPath = EXTERNAL_IMAGE_PATH;
    const allImages = [];

    function readImagesFromDir(dir) {
        try {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    readImagesFromDir(filePath);
                } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
                    // Crear URL relativa para acceder a través del middleware estático
                    const relativePath = `/external-images/${path.relative(EXTERNAL_IMAGE_PATH, filePath)}`;
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
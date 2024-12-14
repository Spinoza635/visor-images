let currentPage = 1;
const imagesPerPage = 12; // 3 filas x 4 columnas
let allImages = [];

async function showImages() {
    try {
        const response = await fetch('/all-images');
        if (!response.ok) throw new Error('Error al obtener las imágenes');
        
        allImages = await response.json();
        renderCurrentPage();
        updatePagination();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('gallery').innerHTML = 'Error al cargar las imágenes';
    }
}

function renderCurrentPage() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    const start = (currentPage - 1) * imagesPerPage;
    const end = start + imagesPerPage;
    const currentImages = allImages.slice(start, end);

    currentImages.forEach(imagePath => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = `/${imagePath}`; // Usar ruta absoluta
        img.alt = 'Imagen de la galería';
        
        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(allImages.length / imagesPerPage);
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages}`;
    
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage === totalPages;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        updatePagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(allImages.length / imagesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        updatePagination();
    }
}

// Cargar imágenes al iniciar
document.addEventListener('DOMContentLoaded', showImages);
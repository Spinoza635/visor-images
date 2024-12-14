let currentPage = 1;
const imagesPerPage = 12;
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

    currentImages.forEach((imagePath, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = `/${imagePath}`;
        img.alt = 'Imagen de la galería';
        img.loading = 'lazy';
        
        img.onclick = () => openFullImage(index + start);
        
        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);
    });
}

function openFullImage(index) {
    localStorage.setItem('currentImageIndex', index);
    window.location.href = 'img.html';
}

function updatePagination() {
    const totalPages = Math.ceil(allImages.length / imagesPerPage);
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage === totalPages;
    document.getElementById('page-input').max = totalPages;
}

function goToPage() {
    const pageInput = document.getElementById('page-input');
    const newPage = parseInt(pageInput.value);
    const totalPages = Math.ceil(allImages.length / imagesPerPage);
    
    if (newPage && newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderCurrentPage();
        updatePagination();
    }
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

// Funciones para imagen.html
async function loadFullImage() {
    // Primero cargar todas las imágenes si no están disponibles
    if (!allImages || allImages.length === 0) {
        try {
            const response = await fetch('/all-images');
            if (!response.ok) throw new Error('Error al obtener las imágenes');
            allImages = await response.json();
        } catch (error) {
            console.error('Error:', error);
            return;
        }
    }

    const index = parseInt(localStorage.getItem('currentImageIndex')) || 0;
    const imgContainer = document.getElementById('gallery');
    imgContainer.innerHTML = `
        <div class="full-image-container">
            <div class="image-wrapper">
                <img src="/${allImages[index]}" alt="Imagen completa" class="original-size">
            </div>
            <div class="image-controls">
                <button onclick="prevFullImage()">Anterior</button>
                <button onclick="toggleFavorite()" id="favButton">
                    ${isFavorite(allImages[index]) ? '❤️' : '🤍'} Favorito
                </button>
                <button onclick="nextFullImage()">Siguiente</button>
            </div>
        </div>
    `;
}

function isFavorite(imagePath) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(imagePath);
}

function nextFullImage() {
    let index = parseInt(localStorage.getItem('currentImageIndex')) || 0;
    index = (index + 1) % allImages.length;
    localStorage.setItem('currentImageIndex', index);
    loadFullImage();
}

function prevFullImage() {
    let index = parseInt(localStorage.getItem('currentImageIndex')) || 0;
    index = (index - 1 + allImages.length) % allImages.length;
    localStorage.setItem('currentImageIndex', index);
    loadFullImage();
}

function toggleFavorite() {
    const index = parseInt(localStorage.getItem('currentImageIndex')) || 0;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(allImages[index])) {
        favorites = favorites.filter(f => f !== allImages[index]);
    } else {
        favorites.push(allImages[index]);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Cargar imágenes al iniciar
document.addEventListener('DOMContentLoaded', showImages);

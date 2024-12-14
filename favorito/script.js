const itemsPerPage = 6;
let currentPage = 1;
let images = [];

async function fetchImages() {
    try {
        const response = await fetch('/images');
        images = await response.json();
        renderGallery();
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
    }
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = images.slice(start, end);

    paginatedItems.forEach(src => {
        const img = document.createElement('img');
        img.src = `img/${src}`;
        gallery.appendChild(img);
    });

    document.getElementById('page-info').textContent = `Página ${currentPage} de ${Math.ceil(images.length / itemsPerPage)}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderGallery();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(images.length / itemsPerPage)) {
        currentPage++;
        renderGallery();
    }
}

function showImages() {
    // Lógica para mostrar imágenes
    console.log('Mostrar imágenes');
}

function showPDFs() {
    // Lógica para mostrar PDFs
    console.log('Mostrar PDFs');
}

function showMoreImages() {
    // Lógica para mostrar más imágenes
    console.log('Mostrar más imágenes');
}

document.addEventListener('DOMContentLoaded', fetchImages);
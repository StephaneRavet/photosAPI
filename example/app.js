// const apiUrl = 'https://photos-api-sepia.vercel.app/';
// const apiUrl = 'http://localhost:3000/';
const apiUrl = '/';
let photos = [];

$(() => {
    fetchPhotos(); // Fetch and display photos on page load
    Fancybox.bind("[data-fancybox]")
});

// Fetch photos from API
async function fetchPhotos() {
    try {
        const response = await fetch(apiUrl + 'photos');
        if (!response.ok) throw new Error('Error fetching photos: ' + response.status);
        const photos = await response.json();
        displayPhotos(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}


// Display photos in the grid
function displayPhotos(newPhotoList) {
    photos = newPhotoList ?? photos
    const photoGrid = $('#photoGrid');
    photoGrid.children(':not(#addPhoto)').remove(); // Clear previous photos but not #addPhoto
    photos.forEach(photo => {
        const photoCard = `
        <div class="column is-full-mobile is-one-third-tablet is-one-quarter-desktop">
            <div class="card photo-card" onmouseover="onCardMouseOver(this)" onmouseout="onCardMouseOut(this)">
                <div class="card-image">
                    <figure class="image">
                        <a href="${photo.url}" data-fancybox="gallery">
                            <img src="${photo.url}" alt="Photo">
                        </a>
                    </figure>
                    <button class="button is-danger deleteButton" onclick="deletePhoto(event, ${photo.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div class="card-content">
                    <textarea
                     class="textarea title is-5 p-0 no-border"
                     onblur="updatePhotoDescription(${photo.id}, $(this).val())"
                     rows=4>${photo.description}</textarea>
                </div>
            </div>
        </div>
        `;
        photoGrid.append(photoCard);
    });
}

// Delete photo
async function deletePhoto(event, photoId) {
    event.stopPropagation();
    try {
        const response = await fetch(apiUrl + `photos/${photoId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error deleting photo' + response.status);
        await fetchPhotos(); // Re-fetch photos after deletion
    } catch (error) {
        console.error('Error deleting photo:', error);
    }
}

// Search photos by description
async function searchPhotos(element) {
    const query = $(element).val().toLowerCase();
    if (!query) return;
    const searchControl = $(element).closest('.control');
    searchControl.addClass('is-loading');
    try {
        const response = await fetch(apiUrl + `photos/search?description=${query}`);
        if (!response.ok) throw new Error('Error searching photos' + response.status);
        const photos = await response.json();
        displayPhotos(photos);
    } catch (error) {
        console.error('Error searching photos:', error);
    }
    searchControl.removeClass('is-loading');
}

// Send photo
async function newPhoto(event) {
    event.preventDefault();
    const url = $('#inputUrl').val();
    if (!url) {
        $('#addPhotoError').text('No url typed');
        return;
    }
    const description = $('#inputDescription').val();
    if (!description) {
        $('#addPhotoError').text('No description typed');
        return;
    }

    try {
        const response = await fetch(apiUrl + 'photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, description })
        });
        if (!response.ok) throw new Error('Error uploading photos' + response.status);
        fetchPhotos();
        $('#addPhotoError').text(''); // Clear error message on success
        event.target.reset(); // reset form
    } catch (error) {
        console.error('Error uploading photos:', error);
        $('#addPhotoError').text('Error uploading photos');
    }
}

function onCardMouseOver(element) {
    $(element).find('textarea').removeClass('no-border');
}

function onCardMouseOut(element) {
    $(element).find('textarea').addClass('no-border');
}

async function updatePhotoDescription(photoId, newDescription) {
    console.log(photoId, newDescription);
    if (!newDescription) return;
    try {
        const response = await fetch(apiUrl + `photos/${photoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription })
        })
        if (!response.ok) throw new Error('Error updating photo description' + response.status);
    } catch (error) {
        console.error('Error updating photo description:', error);
    }

}
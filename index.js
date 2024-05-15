import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Configuration de base pour le module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/example', express.static(path.join(__dirname, 'example')));

let photos = [];
let nextId = 1;

// Load photos from photos.json using import assertion
const loadPhotos = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, './photos.json'), 'utf8');
        const parsedPhotos = JSON.parse(data);
        photos = parsedPhotos.map((photo, index) => ({ ...photo, id: index + 1 }));
        nextId = photos.length + 1;
    } catch (err) {
        console.error('Error reading or parsing photos.json:', err);
    }
};

// Call the loadPhotos function to initialize photos
loadPhotos();

// GET /photos - Retrieve all photos
app.get('/photos', (req, res) => {
    res.json(photos);
});

// POST /photos - Add a new photo
app.post('/photos', (req, res) => {
    const { description, url } = req.body;
    if (!description || !url) {
        return res.status(400).json({ message: 'Description and URL are required' });
    }
    const newPhoto = { id: nextId++, description, url };
    photos.unshift(newPhoto);
    res.status(201).json(newPhoto);
});

// PUT /photos/:id - Update a photo by id
app.put('/photos/:id', (req, res) => {
    const { id } = req.params;
    const { description, url } = req.body;
    const photoIndex = photos.findIndex(p => p.id === parseInt(id, 10));
    if (photoIndex !== -1) {
        photos[photoIndex] = { id: parseInt(id, 10), description, url };
        res.json(photos[photoIndex]);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// PATCH /photos/:id - Partially update a photo by id
app.patch('/photos/:id', (req, res) => {
    const { id } = req.params;
    const { description, url } = req.body;
    if (!description && !url) {
        return res.status(400).json({ message: 'At least one field is required' });
    }
    const photo = photos.find(p => p.id === parseInt(id, 10));
    if (photo) {
        photo.description = description.trim() ?? photo.description
        photo.url = url.trim() ?? photo.url
        res.json(photo);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// DELETE /photos/:id - Delete a photo by id
app.delete('/photos/:id', (req, res) => {
    const { id } = req.params;
    const photoIndex = photos.findIndex(p => p.id === parseInt(id, 10));
    if (photoIndex !== -1) {
        photos.splice(photoIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// GET /photos/search - Search photos by description
app.get('/photos/search', (req, res) => {
    const { description } = req.query;
    if (!description) {
        return res.status(400).json({ message: 'Description query parameter is required' });
    }
    const matchingPhotos = photos.filter(photo =>
        photo.description?.toLowerCase().includes(description.toLowerCase())
    );
    res.json(matchingPhotos);
});

// GET /photos/:id - Retrieve a single photo by id
app.get('/photos/:id', (req, res) => {
    const { id } = req.params;
    const photo = photos.find(p => p.id === parseInt(id, 10));
    if (photo) {
        res.json(photo);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// Description of available routes
app.get('/', (req, res) => {
    res.send(`
    <h1>PhotosAPI</h1>
    <p>Welcome to PhotosAPI! Below are the available routes:</p>
    <ul>
      <li><strong>GET /photos</strong> - Retrieve all photos</li>
      <li><strong>GET /photos/:id</strong> - Retrieve a single photo by id</li>
      <li><strong>GET /photos/search?description={keyword}</strong> - Search photos by description</li>
      <li><strong>POST /photos</strong> - Add a new photo</li>
      <li><strong>PUT /photos/:id</strong> - Update a photo by id</li>
      <li><strong>PATCH /photos/:id</strong> - Partially update a photo by id</li>
      <li><strong>DELETE /photos/:id</strong> - Delete a photo by id</li>
    </ul>
    `);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
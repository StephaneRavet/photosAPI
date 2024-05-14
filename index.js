import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());

let photos = [];
let nextId = 1;

// GET /photos - Retrieve all photos
app.get('/photos', (req, res) => {
    res.json(photos);
});

// GET /photos/:id - Retrieve a single photo by id
app.get('/photos/:id', (req, res) => {
    const { id } = req.params;
    const photo = photos.find(p => p.id === parseInt(id));
    if (photo) {
        res.json(photo);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// POST /photos - Add a new photo
app.post('/photos', (req, res) => {
    const { title, url } = req.body;
    const newPhoto = { id: nextId++, title, url };
    photos.push(newPhoto);
    res.status(201).json(newPhoto);
});

// PUT /photos/:id - Update a photo by id
app.put('/photos/:id', (req, res) => {
    const { id } = req.params;
    const { title, url } = req.body;
    const photoIndex = photos.findIndex(p => p.id === parseInt(id));
    if (photoIndex !== -1) {
        photos[photoIndex] = { id: parseInt(id), title, url };
        res.json(photos[photoIndex]);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// PATCH /photos/:id - Partially update a photo by id
app.patch('/photos/:id', (req, res) => {
    const { id } = req.params;
    const { title, url } = req.body;
    const photo = photos.find(p => p.id === parseInt(id));
    if (photo) {
        if (title) photo.title = title;
        if (url) photo.url = url;
        res.json(photo);
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

// DELETE /photos/:id - Delete a photo by id
app.delete('/photos/:id', (req, res) => {
    const { id } = req.params;
    const photoIndex = photos.findIndex(p => p.id === parseInt(id));
    if (photoIndex !== -1) {
        photos.splice(photoIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Photo not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

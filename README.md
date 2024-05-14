# PhotosAPI

PhotosAPI is a simple and efficient API for managing and serving photos. Built with Express and Node.js, PhotosAPI allows you to easily upload, retrieve, and manage photo collections.

## Features

- Retrieve all photos
- Retrieve a single photo by ID
- Add a new photo
- Update a photo by ID
- Partially update a photo by ID
- Delete a photo by ID
- Search photos by description

## Getting Started

### Prerequisites

- Node.js (version >= 20.13.1)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/photosapi.git
   cd photosapi
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `photos.json` file in the root directory with the following content:

   ```json
   [
     {
       "description": "Beautiful landscape with mountains",
       "url": "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
     },
     {
       "description": "Aerial view of a city",
       "url": "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8"
     },
     ...
   ]
   ```

4. Start the server:

   ```bash
   npm start
   ```

   For development mode with auto-reloading:

   ```bash
   npm run dev
   ```

5. The server will be running on `http://localhost:3000`.

## API Endpoints

### Retrieve all photos

- **URL:** `/photos`
- **Method:** `GET`
- **Response:** Array of photo objects

### Retrieve a single photo by ID

- **URL:** `/photos/:id`
- **Method:** `GET`
- **URL Params:**
  - `id`: Photo ID
- **Response:** Photo object

### Add a new photo

- **URL:** `/photos`
- **Method:** `POST`
- **Body Params:**
  - `description`: Description of the photo
  - `url`: URL of the photo
- **Response:** Newly created photo object

### Update a photo by ID

- **URL:** `/photos/:id`
- **Method:** `PUT`
- **URL Params:**
  - `id`: Photo ID
- **Body Params:**
  - `description`: Description of the photo
  - `url`: URL of the photo
- **Response:** Updated photo object

### Partially update a photo by ID

- **URL:** `/photos/:id`
- **Method:** `PATCH`
- **URL Params:**
  - `id`: Photo ID
- **Body Params:**
  - `description` (optional): New description of the photo
  - `url` (optional): New URL of the photo
- **Response:** Updated photo object

### Delete a photo by ID

- **URL:** `/photos/:id`
- **Method:** `DELETE`
- **URL Params:**
  - `id`: Photo ID
- **Response:** 204 No Content

### Search photos by description

- **URL:** `/photos/search`
- **Method:** `GET`
- **Query Params:**
  - `description`: Keyword to search in the description
- **Response:** Array of matching photo objects

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
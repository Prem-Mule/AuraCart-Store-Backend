# AuraCart-Store-Backend

AuraCart-Store-Backend is a backend server for an e-commerce website built using Node.js, Express, and MongoDB. It provides API endpoints for managing products, user authentication, and cart management.

## Features

- RESTful API for managing products, users, and carts.
- JWT-based authentication for secure access to protected routes.
- Multer for handling file uploads (e.g., product images).
- MongoDB with Mongoose for data storage and manipulation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Prem-Mule/AuraCart-Store-Backend.git


2. Install dependencies:
   ```bash
    npm install

3. Set up environment variables:
    - Create a .env file in the root directory.
    - Add the following variables to the .env file:
    - ```bash
      PORT=4000
      MONGODB_URL=your_mongodb_url
      SECRET_KEY=your_secret_key
      baseURL=http://localhost:4000

Replace your_mongodb_url with your MongoDB connection string and your_secret_key with a secret key for JWT token generation.

## Usage
 - 1 Start the server:

   ```bash
   npm start
    
 ## Access the API:

- **Base URL:** [http://localhost:4000/api/v1/tasks](http://localhost:4000/api/v1/tasks)
- **Endpoints:**
  - GET /api/products: Get all products.
  - POST /api/products: Create a new product.
  - GET /api/products/:id: Get a product by ID.
  - PUT /api/products/:id: Update a product by ID.
  - DELETE /api/products/:id: Delete a product by ID.
  - POST /api/users/signup: User signup.
  - POST /api/users/login: User login.
  - GET /api/users/profile: Get user profile (requires authentication).
  - PUT /api/users/profile: Update user profile (requires authentication).
  - POST /api/cart/add: Add a product to the cart (requires authentication).
  - DELETE /api/cart/remove/:id: Remove a product from the cart (requires authentication).
  - GET /api/cart: Get the cart items for the current user (requires authentication).
    
# Dependencies

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [mongoose](https://www.npmjs.com/package/mongoose): Elegant MongoDB object modeling for Node.js.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file into `process.env`.
- [nodemon](https://www.npmjs.com/package/nodemon): Utility that monitors for changes in your source code and automatically restarts your server.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): JSON Web Token implementation for Node.js.
- [multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, used for file uploads.
- [cors](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
- [path](https://www.npmjs.com/package/path): Utility for working with file and directory paths in Node.js.


# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

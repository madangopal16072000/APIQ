# Documentation
### Note : 
1.  **You can use it either with docker or without it, In Docker version I have used nginx as a load balancer.**
2.  **But for simplicity you can use normal setup which doesn't have nginx but you need to install mongodb and create account on cloudinary to api secrets.***

### API Documentaion : [Click here](https://documenter.getpostman.com/view/31564556/2s9YsDkah7)
## Normal Setup
-----------------------------------------

### Prerequisites
*   Mongodb installed on local machine. [MongoDB Installation Guide](https://www.mongodb.com/try/download/community)
*   Get Cloudinary secrets by creating a free account. [Cloudinary Usage Guide](https://cloudinary.com/)

### Steps

1.  **Clone the Repository**
    
    ```bash
    git clone <repository_url> cd your_app_directory
    ```
2   **head over to the backend folder**

3.  **Configuration**
    
    *   Create a `.env` file with (port, database credentials, Cloudinary API keys, etc.).
    ```env
        COMPANY_NAME=InstaCart
        CLOUDINARY_CLOUD_NAME=cloudinary cloud name
        CLOUDINARY_KEY=cloudinary key
        CLOUDINARY_SECRET=cloudinary secret
        PORT=4000
        JWT_SECRET=your jwt scret
        JWT_EXPIRE=5d
        COOKIE_EXPIRE=5
        DB_URL=mongodb://127.0.0.1:27017/apiq
    ```
4.  **Install the dependencies**
   ```bash
    npm install
   ```
5.  **Use any api testing tool like Postman(Recommended) to access the api*** on port 4000
   
## Install using Docker
------------------------------------------

### Prerequisites

*   Docker Engine installed on the local machine. [Docker Installation Guide](https://www.docker.com/products/docker-desktop/)
*   Get Cloudinary secrets by creating a free account. [Cloudinary Usage Guide](https://cloudinary.com/)

### Steps

1.  **Clone the Repository**
    
    ```bash
    git clone <repository_url> cd your_app_directory
    ```
2.  **Configuration**
    
    *   Create a `.env` file or define environment variables required by the application (port, database credentials, Cloudinary API keys, etc.).
      ```env
        COMPANY_NAME=InstaCart
        CLOUDINARY_CLOUD_NAME=cloudinary cloud name
        CLOUDINARY_KEY=cloudinary key
        CLOUDINARY_SECRET=cloudinary secret
        PORT=4000
        JWT_SECRET=your jwt scret
        JWT_EXPIRE=5d
        COOKIE_EXPIRE=5
        DB_URL=mongodb://mongodb:27017/apiq
    ```
3.  **Docker Compose Setup**
    
    *   Verify the existence of a `docker-compose.yml` file in the root directory of your project. Ensure it includes services for MongoDB, Express.js, and Nginx.
4.  **Using the Provided Nginx Configuration**
    
    *   Ensure the `nginx.conf` file, containing the Nginx load balancer configuration, is placed in the `nginx` directory within your project.
5.  **Starting the Application**
    
    ```bash
    docker-compose up -d
    ```
    This command will create and start the Docker containers defined in the `docker-compose.yml` file, including MongoDB, Express.js instances, and Nginx as a load balancer.
    
6.  **Accessing the Application through Nginx**
    
    *   Access your application in a web browser at [http://localhost](http://localhost) (assuming Nginx is running on the default HTTP port 80).
7.  **MongoDB Configuration**
    
    *   MongoDB will be available at `mongodb://mongodb:27017`. Verify and configure MongoDB connections as needed in your application.
8.  **Shutting Down the Application**
    
    ```bash
    docker-compose down
    ```

### Notes

*   **Nginx Load Balancer Configuration**: Ensure the provided `nginx.conf` file contains the necessary configuration for load balancing between Express.js instances.

### Troubleshooting

*   If there are issues accessing the application or starting containers, ensure Docker Engine is running and check the logs using:
    ```
    `docker-compose logs`
    ```

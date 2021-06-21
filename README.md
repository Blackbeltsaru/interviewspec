SETUP:

Ensure that ffmpeg is installed on the machine: https://ffmpeg.org/download.html
    The executables will need to be in your path for fluent-ffmpeg to work properly

If you're running on windows, you may have to install ts-node globally *npm i -g ts-node*
    NOTE: For some reason, my Windows platform was not recognizing the local install of ts-node and I had to install it globally. 
    This should not be neccessary in most cases, but if you run into problems starting the server, this may be the issue. 

Ensure that you have Mysql installed and running. 
    Run `dbAlters.sql` to set up the database properly for the application.

Create a `.env` file in the server directory. 
    The env file should have the following fields:
    
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB=video_player_db //This should match the database name created by the `dbAlters.sql` file
    SERVER_PORT=3001

Create a `.env` file in the client directory.
    The env file should have the following fields:

    REACT_APP_SERVER_HOST=localhost
    REACT_APP_SERVER_PORT=3001

    
Create a `.env` file in the root directory.
    The env file should have the following fields:

    SERVER_HOST=localhost
    SERVER_PORT=3001

Run `npm install` from the client, and server directories, as well as this directory. 

Alternatively `node setup.js` will walk you through the process.


UPLOAD:

To run the upload script, first ensure that the server is running `./server npn run start`. Then run `node upload.js`; 
this will ask for the title of the video, and the absolute path to the video file. The script will then take care of the rest of the process. 
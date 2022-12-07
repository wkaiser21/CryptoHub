# CryptoHub

Update env-temp.json template file name to env.json with your own updated login information. Replace "USERNAME" and "PASSWORD" respectively with your own credentials. 
Run npm install to install the required dependencies. 
Before starting the server, run the command psql --username USERNAME -f setup.sql with "USERNAME" being replaced with your postgres username.
To start the server, run command "npm start" from the Cryptohub directory.

The server uses a free api without an api key. It has a limit of 10-50 api calls per minute and it resets every minute if you reach the maximum capacity.
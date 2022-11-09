# CryptoHub

Update env.json template file with your own login information. Replace "USERNAME" and "PASSWORD" respectively with your own credentials. 
Before starting the server, run the command psql --username USERNAME -f setup.sql with "USERNAME" being replaced with your postgres username. This creates the databse named "cryptohub" which the server connects to. 
To start the server, run command "npm start" from the Cryptohub directory.
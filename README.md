# odds_api
Fetch odds history of any sport and league you want from oddsportal site and make an API from that. 
To do so, you need, firstly, create and connect to a database (postgres) in which you will store all your data in the future.
Create .env file in the root of the project in which you need to assign all the credentials of your postgres db according the schema below:
  user=username by which you will log into your db,
  host=the ip of the server, on which your db is running, usually localhost
  database=name of your db
  password=password to your db for the corresponding user
  port=port on which your db is running on your server
Using command api files in ./database/commandAPI to create sport and league
Then using ./crawler/index.js you can fulfill your database :)

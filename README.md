General install (node is a prerequesite):

	'npm run dev' for full development  
 		http://localhost:3000/map  
 	'ng serve' for client side only  
 		http://localhost:4200/map with ng serve  

 Full Install on Windows Machine: 

	Download and install node.js (https://nodejs.org/en/download/)  
	npm install -g @angular/cli  
	npm install -g nodemon  
	npm install -g concurrently  
	npm install -g nativefier  
	
	Download and install postgreSQL and postgis  
		-https://www.postgresql.org/download/windows/  
		-https://postgis.net/install/  
	Configure ...wolverine_web_map/server/src/config/config.json file with db name and password  
	Run wolverine_web_map/desktop_app/create_tables.sql script in database  

	point wolverine_web_map/desktop_app/StartWebMap.bat file to build folder on line 35  
	create shortcut for bat file (right click..)  
		-change icon to favicon_128.ico in wolverine_web_map\desktop_app  
		-make sure bat file is set to admin priviledge (right click and set)  
	run nativefiler in desktop_app folder to create new folder with .exe inside  
		-'nativefier -n "Wolverine Map" -o -i .wolverine_web_map\favicon_128.ico "localhost:3000"'  
		-look in new foler created  
	update wolverine_web_map/server/server.js file to execute the .exe file in your new folder (line 39)  
	optionally convert wolverine_web_map/desktop_app/StartWebMap.bat file to .exe with http://www.f2ko.de/en/b2e.php in order to hide the cmd shell  

Flow of events:  
	1-Run bat file (can be changed to exe) which starts the database server and launches the node server  
	2-Node server launches client and server, also launches desktop app from executable  


Todo's  
	-add Web Server for Chrome to serve local fodler https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related **make sure to append http://127.0.0.1:8887 to images being displayed, also update line 33 in server/src/routes/item.js to reflect new folder  
	


 


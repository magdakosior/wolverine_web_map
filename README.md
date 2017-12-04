

Angular-cli issue
 you have to move the “angular-cli.json” file to your parent directory, and then modify the line “root” to “./client/src”. With this configuration you can now issue any command with angular-cli in the parent folder and all of the generated content will be placed under the client folder.

 

 package.json scripts
 	"start": "node ./server/src/bin/www"


    "ng": "ng",
    "start": "ng serve --proxy-config proxy.config.json",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "start": "gulp && concurrently \"gulp watch\" \"nodemon server/app/server.js\""
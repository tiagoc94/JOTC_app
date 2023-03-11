# Jumping on the clouds app

Web application that shows a web interface for users to enter input for the JOTC (Jumping on the Clouds).
Features an initial log in screen and an admin console available for authenticated users.

https://www.hackerrank.com/challenges/jumping-on-the-clouds/problem

### User authentication:

The user authentication, which will allow access to the admin console, relies on the user's first name. 
Authenticated first names are "admin1" and "admin2".
I chose the first name and not the email, for example, to avoid having to use real emails in the source code while making this repo public.

### Issues:

The table scroll in the admin console doesn't work properly in mobile view.

### Prerequisites

Have npm installed.

### Running the app

* From the root folder:
* Run ```npm i```
* Run ```npm start```

### Running the tests

* From the root folder:
* Run ```npm i``` (skip if done previously)
* Run ```npm test```

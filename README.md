# HomeTest - Time reporting and Corona positive diagnosis + getting co-worker emails to be notified.

Todo:

1. More API tests with Jest.
2. Add Validators.
3. Add more details and descriptions in the Swagger UI.
4. Add an export of MariaDB
5. Extract strings such as sql queries to a separate string resource file.

File: Cynet_hometest.postman_collection.json 
is the Postman requests collection I used.


Run with:
---------
npm run dev
(after npm install)


Update docs:
------------
npm run swagger-autogen
view - (http://localhost:5000/doc)

Run tests:
----------
npm test

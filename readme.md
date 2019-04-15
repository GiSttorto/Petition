
<!--
        EXPRESS ROUTES -->

<!-- 1. GET /petition
    * render the petition page -->

<!-- 2. POST /petition
    * render error message if there was an error (so if user doesn't provide first, last and/or signature,
    render an error message)
    * insert data into a table called signatures, set a cookie, then redirect to /thanks page -->
<!--
3. GET /thanks
    * render the "thank you" page -->

<!-- 4. GET /signers
    * should list first and last names of everyone who has signed the Petition -->



        <!-- QUERIES

1. INSERT into signatures
2. SELECT query to get list of all users who have signed the petition -->


        <!-- EXPRESS-HANDLEBARS TEMPLATES -->

<!-- 1. petition
    * this is where the canvas element should live
    * should contain a form tag with inputs for the first name, last name and signature
        - 1 form tag that contains 2 inputs fields
        - the third input field for the signature should be hidden
        - in our client.slide JS file, then, we need to, on the mouseup event, capture the url of the
        signature the user just mode and put that in the hidden input field
            - we can get this url by calling toDataUrl on the canvas
2. thanks
3. signers
4. layout
5. potential some partials -->





        <!-- PART 2

1. require cookie paner
2. insert
3. set cookie based on new row ID
4. on /thanks route use id cookie
 -->



    <!-- PART 3
1. Database
    * new users table with columns for id, first, last, email and password, email column must have a UNIQUE
    constrain
    * modify signatures table to have a new column for user id -->

<!-- 2. Routes
    * GET /register
        - renders the registration template -->
<!--
    * POST /register
        - first must hash the password using bcrypt
        - call function to insert first, last, email, and hashed password into Database
        - if INSERT is sucesful, log the user in by putting their id in 'req.session'
            - redirect to /petition
        - if INSERT fails, re-render the registration template with an error message -->
<!--
    * GET /login
        - renders the login template -->

    <!-- * POST /login
        - first must do a query to get user information by the email address that was submitted
        - if there is no matching record in the users table for the submitted email address, re-render the
        login template with an error message
        - call bcrypt's compare function, passing it the password that the user just typed ('req.body.password')
        and the hashed password that was just retrieved from the Database.
        - if the compare function gives you 'true', put the user id in session and redirect to /petition
        - if the compare function gives you 'false', re-render the login template with an error message -->
<!--
    * POST /petition
        - only use signature from 'req.body'. Pass the first, last and id that are already known -->

<!-- 3. Queries
    * modify INSERT for signatures tables to include the user id.
    * INSERT for users tables
    * SELECT that gets info from users table by email address

4. Templates
    * registration
        - conditionally renders an error message
    * login
        - conditionally renders and error message
    * petition
        - change template to no longer allow users to input first and last -->



            <!-- PART 4

1. Databas
    * News user_profiles table
    	- age, city, url, user_id
        - user_id cannot be null and must ne unique
    * Change signarues table to exclude first and last  

2. New route:
    * GET /profile
        - renders form for data that goes into new user_profiles table
    * POST /profile
        - does insert into user_profiles table if data was submitted
    * GET /signers/:city
        - does same query as /signers but with a 'WHERE' clause that limits results to the city in the url
    * no longer need to pass first and last to query in POST /petition
    * in GET /login, do new query to get user info including signature is. Remove second query to get
    signature id

3. templates
    * profile template to render new form

4. Queries
    * 'INSERT' dor new user_profiles table
    * modify 'SELECT' for getting user by email so it joins signatures and gets the signature id
    * modify query to get signers so that it joins signature and gets the signature id
    * new query to get signers by city



* no link, just redirect the user is obligated to go to this page
 - CREATE TABLE user_profiles -->





        <!-- PART 5

1. pre-populate the input fields with data about the logged-in user
    * some of this data lives in the users table and some in the user_profiles table, therefore you will have to JOIN the 2 tables to get all this data from the database
2. what to do when user clicks on the "submit" button?
    * UPDATE the users table with the new / possible not changed first, last, email AND we need to UPDATE user_profiles with the updated age, city, url
    * two edge cases / caveats:
        - what to do about password: In the POST route we want to check if the user entered a new password.
            * IF user entered a new password, we need to run an UPDATE query on users that will update first, last, email, and password (don't forget to hash the password!!!)
            * IF the user did not enter a new password, then we'll run an UPDATE query on users that will only UPDATE first, last, and email in the users table
        - should we UPDATE or INSERT into user_profiles?
            * UPSERT! UPSERT will INSERT if user doesn't have a row in user_profiles, and will UPDATE if the user does have a row in user_profiles! -->



WHAT IS MISSING?

<!-- 1. check if the user is logged in; -->
2. More about the petition;
3. Design
<!-- 4. Heroku -->
<!-- 5. Check all security -->
<!-- 6. http// required -->
<!-- 7. delete signatures -->
8. delete account
9. log out

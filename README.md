# PokeBay

Using the Schema you designed yesterday, you will create your very own Pokemon auction site! We will use `handlebars` for the frontend (some views will be provided to you) and `pg` as our PostgreSQL client.

## Part 0: Setup
Let's create a local postgres database and launch the provided starter code!

1. Use the [`createdb`](https://www.postgresql.org/docs/9.6/static/tutorial-createdb.html) terminal command to create your very own pokebay database
    ![](./images/newDB.png)
1. Create an `env.sh` file and set the `DATABASE_URL` environment variable (don't forget to run `source env.sh` following this step)
1. Open `pool.js` and fill in the missing lines of code (found at `//YOUR CODE HERE`)
    - This file will connect to your postgres database and export the `pg` variable
1. In `app.js` import `pool.js` as the variable `db` (we will use this variable to write SQL queries). Since these queries will be written in our `routes/*` files, you should pass the `db` variable in to those files as an argument (as shown below). Modify `app.js` to include the below code, and make changes to `auth.js` & `routes.js` to account for the `db` argument.
    ```js
	app.use('/', auth(passport, db));
	app.use('/', routes(db));
	```
1. Run `npm install`
1. Run `npm start`
    - You should see **Success, you are connected to Postgres** in your terminal window
	- Navigate to `localhost:3000` and you should see the following page
	    ![](./images/setupDone.png)
		
## Part 1: User Login/Registration
In this part we will set up our login and register routes. We will be working out of the `routes/auth.js` file for the following set of steps.

1. Implement a `GET /login` route which renders the provided `login.hbs` file
    - Navigating to `http://localhost:3000/login` should render a login form
1. Implement a `GET /register` route which renders the provided `register.hbs` file
    - Navigating to `http://localhost:3000/register` should render a register form
1. Before we can create `POST` routes for user authentication, let's first set up `passport` in our app
    - Navigate to `app.js` and find the `// Passport` comment. You have to implement the proceeding functions.
	- For `passport.serializeUser` you should call `done()` with `null` as the first argument and the user id as the second argument.
	- For `passport.deserializeUser` you should use `db.query` to select a user from the `users` database with a given `id`. Once the user is found call `done()` with `null` as the first argument and the result as the second argument.
	- To implement `LocalStorage` you should use `db.query` to write a query that looks for a `user` given its' `username` and `password`.
	- **Bonus:** Using [`bcrypt`](https://www.npmjs.com/package/bcrypt) hash the passwords when they're stored in your database
1. Implement a `POST /login` route that redirects to `/dashboard` on success and `/login` on failure
1. Implement a `POST /register` route that checks if username is already take and if `req.body.password` & `req.body.password2` match

## Part 2: Profile

Objective: ExpressJS API - Blog Application

1. What is the main objective of the project?
   - ExpressJS API - Blog Application with Simple CRUD functionalities
2. Who are the target users of the application?
   - Blog application users
3. What are the core features or functionalities required?
   - Basic CRUD operations for managing movie catalog system (Create, Read, Update, Delete).
     - All users ability to retrieve a list of all available blog post documents.
     - All users ability to retrieve a a single blog post by its ID.
     - All users ability to view comments in a single post by its ID
     - All users ability to comment on each blog post
     - Authenticated user ability to create new blog post.
     - Authenticated user ability to edit their own blog posts.
     - Authenticated user ability to delete their own blog posts.
     - Admin user ability to create/add a movie document.
     - Admin user ability to delete any blog posts
     - Admin user ability to delete any blog post comments.
4. What data will the application need to store and manage?

   - Blog Post

     - title
     - content
     - author
     - creation date

   - Comment

     - name
     - comment

   - User information
     - email
     - username
     - password

5. Are there any specific technical requirements or constraints?
   - Express.js API.
   - MongoDB with Mongoose for data storage and management.
   - RESTful Architecture.
6. What are the security and authentication requirements?
   - Token-based Authentication (JWT).
   - Brcypt hash
7. What are your routes and controllers?

   Routes:

   User:
   POST /users/login - User login route.
   POST /users/register - User registration route.
   GET /users/details - User details route.

   Blog Post Routes:

   All Users:
   GET /blogs/getBlogs - Retrieve all blog posts.
   GET /blogs/getBlog/:id - Retrieve a single post by its ID.

   Authenticated User:
   POST /blogs/addPost - Create a blog post
   PATCH /blogs/updatePost/:id - Update a blog post that has been created by an authenticated user based on its ID.
   DELETE /blogs/deleteOwnPost/:id - Delete a blog post that has been created by an authenticated user based on its ID.

   Admin User:
   DELETE /blogs/deletePost/:id - Delete any posts by its ID.

   Comment Routes:

   All Users:
   GET /comments/getComments - Retrieve all comments using the blog ID
   POST /comments/postComments - Add a comment to a post

   Admin Users
   DELETE /comments/deleteComment/:id - Delete any comments by its ID.

   Controllers:

   User Controller:

   loginUser
   registerUser
   userDetails

   Blog Post Controller:

   getBlogs
   getBlog
   addPost
   editPost
   deleteOwnPost
   deletePost

   Comment Controller:

   getComments
   addComment
   deleteComment

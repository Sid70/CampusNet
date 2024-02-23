# CampusNet

CampusNet is a MERN-based social-media web application designed to facilitate communication and collaboration within college or campus communities.

## Authors

CampusNet was developed by:

- [Siddhanta Choudhury](https://github.com/Sid70) ([LinkedIn](https://www.linkedin.com/in/siddhanta-choudhury-674869220/))
- [Aditya Sadangi](https://github.com/Adityasadangi) ([LinkedIn](https://www.linkedin.com/in/aditya-sadangi-885943212/))


## Key Features

- **User Authentication:** Students, professors, and club secretaries can register and log in securely.
- **Post Events:** Users can post upcoming events related to clubs or campus activities.
- **Share Multimedia:** Upload and share photos and videos of achievements and events.
- **Educational Content:** Professors can share informative and motivational videos for students.
- **Job-related Posts:** Teachers can post job opportunities and career-related content.
- **Community Platform:** Provides a comprehensive platform for users to connect, share, and engage with each other.
- **Dark Mode/Light Mode:** Users can select between dark mode and light mode for their preferred interface appearance.

## Additional Features

- **Register**: Users can create a new account by providing necessary information, such as email, profile picture, and password etc.
- **Login**: Registered users can securely log in to their accounts using their credentials.
- **Forget Password**: Users can reset their password if they forget it by following a password reset process.
- **Captcha**: Implemented Captcha for security verification during registration or login processes, reducing the risk of automated attacks.
- **Search Features**: Users can search for specific posts, users, or content within the platform using a search bar.
- **Manage Account**: Users can update their account information, including profile details and settings, such as profile picture, bio, and privacy settings.
- **View Profile**: Users can view their own profile as well as profiles of other users to see their posts and interactions.
- **Notifications**: Users receive notifications when others interact with their posts, such as likes or comments, keeping them informed about activity related to their content.
- **Delete Account**: Users can permanently delete their account and associated data, removing their presence from the platform.
- **Deactivate Account**: Users can temporarily deactivate their account, making it inaccessible to others, while retaining the option to reactivate it later.
- **Reactivate Account**: Users can reactivate their deactivated account, restoring access to their profile and content.
- **Send Follow Request**: Users can connect with other users by sending follow requests, initiating a mutual following relationship.
- **Unfollow Request**: Users can manage their follow requests by unfollowing other users, removing them from their following list.
- **Add Comments**: Users can engage with posts by adding comments, enabling discussion and interaction between users.
- **Like/Unlike**: Users can show appreciation for posts by liking them or remove their like if desired.
- **Edit/Delete Comments**: Users have the ability to manage their comments on posts, including editing or deleting them as needed.
- **Post Multiple Content Types**: Users can create posts containing multiple types of content, such as videos, images, or both, enhancing the variety and richness of their contributions.
- **Edit/Delete Posts**: Users can control the content of their posts by editing or deleting them, allowing them to update or remove outdated or unwanted content.

## Technologies Used

- **MongoDB:** NoSQL database for storing user information, posts, and multimedia content.
- **Express.js:** Backend framework for building the RESTful API.
- **React.js:** Frontend library for building dynamic and interactive user interfaces.
- **Node.js:** JavaScript runtime environment for server-side scripting.
- **Material-UI:** React components library for building visually appealing UIs.
- **Redux Toolkit:** State management library for managing application state efficiently.
- **Multer:** Node.js middleware for handling multipart/form-data, used for uploading files.
- **Mongoose:** MongoDB object modeling tool for Node.js, used for schema validation and data manipulation.
- **Nodemailer:** Module for sending emails, used for communication purposes.
- **bcrypt:** Library for hashing passwords securely, used for password encryption and storage.
- **Morgan:** HTTP request logger middleware for Node.js, used for logging HTTP requests.

## Getting Started
follow these steps:
1. Clone the repository: `git clone https://github.com/Sid70/CampusNet.git`
2. Navigate to the project directory: `cd CampusNet`

## Getting Started (Client)

To get started with the client side of CampusNet, follow these steps:

1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Set up environment variables (if necessary):
   - If any environment variables are required for the client side, ensure that the server URL is defined appropriately within the api/Serverhost.js file located in the client/src directory.
4. Start the development server: `npm run start`
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)



## Getting Started (Server)

To get started with the server side of CampusNet, follow these steps:

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the server directory.
   - Define environment variables such as `EMAIL_ADDRESS`, `EMAIL_PASSWORD(application's secret key password , it's not your gmail password)`, `MONGODB_URL`, `PORT`, etc.
4. Start the development server: `npm run start`
5. The server will be running on the specified port, and you can access the API endpoints accordingly.


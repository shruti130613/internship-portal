# Free deployment

This project is configured for one free Render web service. It serves the Vite frontend and Django API from the same `onrender.com` address.

## Publish

1. Put this project in a **private GitHub repository**. The root `.gitignore` excludes the local database, uploaded resumes, virtual environment, and generated build files.
2. Sign in to Render and choose **New → Blueprint**. Connect that GitHub repository and approve the Blueprint named `internship-portal` from `render.yaml`.
3. Keep the service plan set to **Free**, then create the service. Render builds the frontend and backend together; when deployment finishes, open the `onrender.com` URL shown on the service page.

## Free plan behavior

- The app may take about a minute to open after 15 minutes without visitors because free web services go idle.
- Render's free web service has temporary local storage. The SQLite database and uploaded resumes can disappear when the service restarts, redeploys, or goes idle. This is suitable for a demo, not for keeping real user accounts, applications, or resumes.
- The existing local database and resume files are not included in the repository. The deployed app starts with an empty database and applies its migrations at launch.

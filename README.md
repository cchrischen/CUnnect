# CUnnect
CUnnect is a web app built with [React](https://react.dev/) and [Express](https://expressjs.com/) that allows users to connect with others by browsing and hosting events. The website is live [here](https://cunnect.fly.dev).

The website uses [Firebase](https://firebase.google.com/) to authenticate users and storing local data. The frontend utilizes [Material UI](https://mui.com/material-ui/) for design.

## Getting Started
### Prerequisites
* pnpm
  ```sh
  npm install -g pnpm
  ```
### Installation and Running
1. Install dependencies
   ```sh
   pnpm install
   ```
2. Get a Firebase service account, named `service_account.json`, and move it into `server` directory.
3. `cd` to `client/src/constants/Constants.tsx` and update `serverBaseURL` accordingly.
4. Start the frontend web, located at `http://localhost:5173`, and backend server, located at `https://localhost:8080`
   ```sh
   pnpm dev
   ```

* Thanks to [Trend in Web Dev](https://webdev.cornelldti.org/) course for teaching full-stack development and credit to [their repo](https://github.com/cornell-dti/trends-mono/tree/main/frontend-starter) for template.
* Credit to [Freepik](https://www.freepik.com/) for HomePage svg.
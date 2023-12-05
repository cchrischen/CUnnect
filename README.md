# CUnnect
CUnnect is a web app that allows users to connect with others by browsing and hosting events. 

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
   
Credit to Freepik for HomePage svg.
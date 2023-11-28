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
   cd client
   pnpm install
   cd ../server
   pnpm install
   ```
2. Get a Firebase service account, named `service_account.json`, and move it into `server` directory.
3. Start the backend server, located at `http://localhost:8080`
   ```sh
   pnpm dev
   ```
4. Start the frontend web, located at `http://localhost:5173`
   ```sh
   pnpm dev
   ```
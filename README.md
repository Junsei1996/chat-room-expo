# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

## Backend setup

The app relies on the backend server in `backend/`.

1. Change into the backend folder:

   ```bash
   cd backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with at least:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   JWT_SECRET=your-secret-string
   ```

4. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the backend server:

   ```bash
   npm run dev
   ```

## Mobile setup

1. From the app root, install dependencies:

   ```bash
   npm install
   ```

2. Ensure `services/api.ts` uses your machine's local network IP under `API_BASE_URL`.
   - Do not use `localhost` when testing from a physical device or Expo Go.

3. Start Expo:

   ```bash
   npx expo start
   ```

## Testing with multiple devices

1. Launch the backend server.
2. Open the Expo app on two or more devices/emulators.
3. Sign in or register on each device.
4. Open the same room on all devices.
5. Send a text message from one device.
6. Confirm the message appears on the other device in real time.
7. Tap the image icon to select a photo and send it.
8. Confirm the image message shows up on all connected devices.

## Common issues

- If a physical device cannot reach the backend, update `API_BASE_URL` to your LAN IP and ensure the backend port is reachable.
- If the chat screen is empty, confirm the room exists and the backend is running.
- If image upload fails, make sure Expo has media library permission.

## Notes

This project now uses backend-driven messages and Socket.IO for real-time chat.

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

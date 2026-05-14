# Copilot Workspace Instructions

## Project Overview

This repository is an Expo React Native app built with TypeScript and Expo Router.
The app uses React 19, React Native 0.81, Expo SDK 54, and Expo Router file-based routing.

## Key Files and Folders

- `app/` - primary entrypoint and screen structure for the Expo Router.
- `components/` - reusable UI components.
- `constants/theme.ts` - theme values.
- `hooks/` - custom React hooks used across the app.
- `assets/` - static images and assets.
- `package.json` - project dependencies and scripts.
- `eslint.config.js` - linting configuration.
- `tsconfig.json` - TypeScript configuration.

## Goals

- Keep the app stable on Expo and React Native versions used in this repo.
- Use function components with React hooks and TypeScript.
- Prefer minimal and targeted code changes.
- Keep the file/folder structure intact unless refactoring is specifically requested.

## Coding Rules

- Use TypeScript for new code and preserve existing TSX/TS conventions.
- Use Expo Router conventions for navigation and screen routing.
- Avoid unsupported native APIs or packages not compatible with Expo managed workflow.
- Do not modify `node_modules/`.
- Avoid adding new dependencies without explicit instruction.
- Keep UI consistent with existing component and theme patterns.

## Context and Constraints

- This app is an Expo managed workflow project, so prefer Expo-friendly solutions.
- The codebase is small and mostly focused on app UI and navigation.
- Existing packages include `expo`, `expo-router`, `react-native`, `react-native-web`, and Expo-related libraries.
- Follow the current style of folder structure and export patterns.

## When Assisting

- Provide code changes only, with concise explanations if needed.
- If asked to implement new behavior, add tests or validation only when it is part of the repo's current style.
- If making UI changes, keep them aligned with existing app design and theming.
- Respect the current linting setup and TypeScript strictness.

## Do Not Do

- Do not refactor the whole app unless explicitly requested.
- Do not introduce backend services or server-side code.
- Do not remove or replace core Expo Router and React Native configuration without a strong need.

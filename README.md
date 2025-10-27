# Produtos App

React Native Expo application for listing and viewing product details of a fictional store.

## Main Features
- **Native navigation with React Navigation**: integrates seamlessly with the mobile ecosystem (native stack headers, smooth transitions, deep linking).
- **Data management with React Query + Axios**: intelligent caching, automatic revalidation, and built-in state handling (loading, error, success), reducing manual request logic.
- **Styling with StyleSheet**: maintains runtime performance (compiled and cached styles), reduces bundle size, and avoids extra styling dependencies.
- **Reusable components**: `ProductCard`, `LoadingState` and `ErrorState` speed up new screens and centralize visual consistency.
- **Scalable architecture**: layered services (`api`, `products`), isolated navigation, and folder structure designed to grow without clutter.
- **Performance optimizations**: FlatList with memoized key extractor, memoized callbacks `useCallback`, React Query caching, and optimized components.
- **User feedback**: standardized loading and error states to ensure a consistent UX.
- **Code quality**: TypeScript, clean code practices, and unit tests for reliability.

## Stack
- Expo (React Native 0.81, React 19)
- React Navigation (stack)
- React Query + Axios
- TypeScript
- Jest + React Native Testing Library

## Folder Structure
```
src/
  components/       # Reusable components
  navigation/       # Stack navigator and types
  screens/          # List and detail screens
  services/
    api/            # Axios client and QueryClient
    products/       # APIs, hooks, and product types
  theme/            # Color tokens
  utils/            # Helpers such as formatCurrency
```

## Requirements
- Node.js 18+
- Yarn 1.22+
- Expo CLI (optional for global `expo start`)

## Installation
```bash
yarn install
```

## Available Scripts
- `yarn start` — starts the Metro bundler with Expo.
- `yarn android` — runs the app on an Android emulator/device.
- `yarn ios` — runs the app on an iOS simulator/device.
- `yarn web` — runs the project in the browser.
- `yarn test` — runs the project in the browser.

## Tests
- Unit tests with Jest and Testing Library cover components, screens, services, and hooks.
- `yarn test --coverage` generates a coverage report.
- Current coverage results:
  - Statements: 96.96%
  - Branches: 81.25%
  - Functions: 95.65%
  - Lines: 96.72%

## APIs
- Base URL: `https://dummyjson.com`
- Endpoints used:
  - `GET /products`
  - `GET /products/:id`

## Technical Decisions
- **React Navigation**: provides a stack navigator with native headers, gesture support, and a mature API.
- **React Query + Axios**: eliminates boilerplate manual state management (loading/error), offering caching, invalidation, and background synchronization.
- **StyleSheet**: styles are preprocessed and cached natively, avoiding runtime cost and extra dependencies.
- **Memoization & FlatList**: reduces unnecessary renders, improves scrolling performance, and keeps the UI responsive even with large lists.
- **TypeScript & clean code**: ensures strong typing, autocomplete, and consistent code standards.

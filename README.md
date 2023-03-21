# Landscape

Landscape provides the primary launching interface for Tlon's suite of userspace applications. This repository contains the front-end web application to power said interface.

Landscape is built primarily using [React], [Typescript], and [Tailwind CSS]. [Vite] ensures that all code and assets are loaded appropriately, bundles the application for distribution and provides a functional dev environment.

## Getting Started

To get started using Landscape first you need to run `npm i` from the `ui` directory.

Once that's done, you can then run `npm run mock` if you'd like to get started immediately. This will use hard-coded mock data to power the interface so you can work on the interface without being connected to a ship.

To develop against a working ship, you first need to add a `.env.local` file to the `./ui` directory. This file will not be committed. Adding `VITE_SHIP_URL={URL}` where **{URL}** is the URL of the ship you would like to point to, will allow you to run `npm run dev`. This will proxy all requests to the ship except for those powering the interface, allowing you to see live data.

Regardless of what you run to develop, Vite will hot-reload code changes as you work so you don't have to constantly refresh.

## Deploying

Deploys to internal moons are managed via github actions.

[react]: https://reactjs.org/
[typescript]: https://www.typescriptlang.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/

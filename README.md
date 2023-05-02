# Viva-api

[![Made with GH Actions](https://img.shields.io/badge/CI-GitHub_Actions-orange?logo=github-actions&logoColor=white)](https://github.com/features/actions "Go to GitHub Actions homepage")
[![Made with Docker](https://img.shields.io/badge/Made_with-Docker-blue?logo=docker&logoColor=white)](https://www.docker.com/ "Go to Docker homepage")
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://typescriptlang.org "Go to TypeScript homepage")

## :mega: Description

This repository serves as a data source for the B2C application at Vivatech. It provides the necessary information for the application to function, such as managing tickets, schedules, and speakers. The repository acts as a central hub for all the data required by the application, making it easy to access and update information as needed. With this data readily available, the B2C application can provide users with an optimal experience at Vivatech.

## :bellhop_bell: Requirements

[![Made with Node.js](https://img.shields.io/badge/Node.js->=16-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")

## :raised_hands: How it works

### Setup project

- Clone the repository

```sh
git clone git@github.com:WorkshopMDS/vivatech-back.git
```

- Launch installation

```sh
make install
```

- Configure environment

Copy `.env.sample` file, rename it to `.env` and configure all fields accordingly with your credentials.

```
MONGO_ATLAS_ADDRESS=
MONGO_ATLAS_DATABASE=
MONGO_ATLAS_USERNAME=
MONGO_ATLAS_PASSWORD=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

*Contact an administrator if you need help for this operation*

**That's it! Everything is ready.**

### Launch project using docker

```sh
make up
```

**:tada:  It's live! Go to [http://localhost:4000](http://localhost:4000)**

## Others commands who can help

- Down container

```sh
make down
```

- Launch tests

```sh
make test
```

- Rebuild docker image

```sh
make build
```

## :fr: Contributors

- :link: [Maengdok](https://github.com/Maengdok)
- :link: [Quentin Aubert](https://github.com/BrystoQ)
- :link: [Iti98](https://github.com/iti98)
- :link: [Kilian Pichard](https://github.com/kilianpichard)
- :link: [Rémi Rubis](https://github.com/remirubis)


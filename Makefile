install:
	yarn install

build:
	docker compose build

up:
	docker compose up -d

test:
	yarn test:verbose

down:
	docker compose down --remove-orphans

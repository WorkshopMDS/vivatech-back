install:
	yarn install

build:
	docker-compose build

up:
	docker-compose up -d

test:
	yarn test:coverage

down:
	docker-compose down --remove-orphans

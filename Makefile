docker-build:
	docker compose up --build -d

docker-down-ui:
	docker compose rm --stop --force web

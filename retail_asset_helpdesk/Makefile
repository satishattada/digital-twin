.PHONY: help build up down logs shell-frontend shell-backend clean

help:
	@echo "Available commands:"
	@echo "  make build          - Build all containers"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make logs           - View logs"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make clean          - Remove all containers and volumes"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

shell-frontend:
	docker compose exec frontend sh

shell-backend:
	docker compose exec backend bash

clean:
	docker compose down -v --rmi local
all: up
.PHONY: up

.PHONY: all
all: up

.PHONY: clean
clean:
	rm -rf docker/dev/volume project/backend/.env project/backend/dist project/backend/node_modules project/backend/package-lock.json project/frontend/.env project/frontend/tsconfig.tsbuildinfo project/frontend/tsconfig.next-env.d.ts project/frontend/.next project/frontend/node_modules project/frontend/package-lock.json

.PHONY: fclean
fclean: clean
	rm -rf docker/main/volume

.PHONY: re
re:
	$(MAKE) fclean
	$(MAKE) all

.PHONY: up
up:
	docker compose --env-file .env -f docker/main/docker-compose.yml up -d

.PHONY: down
down:
	docker compose --env-file .env -f docker/main/docker-compose.yml down

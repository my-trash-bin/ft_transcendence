all: up
.PHONY: up

.PHONY: all
all: up

.PHONY: clean
clean:
	rm -f .env

.PHONY: fclean
fclean: clean

.PHONY: re
re:
	$(MAKE) fclean
	$(MAKE) all

.PHONY: up
up: prelude
	docker compose --env-file .env -f docker/main/docker-compose.yml up -d

.PHONY: down
down: prelude
	docker compose --env-file .env -f docker/main/docker-compose.yml $@

.PHONY: prelude
prelude: .env

.env:
	sh docker/env-validator/validate.sh .env.sample
	cp .env.sample .env

.PHONY: dev
dev: prelude
	@docker compose --env-file .env -f docker/dev/docker-compose.yml down -v
	@docker compose --env-file .env -f docker/dev/docker-compose.yml up -d --build

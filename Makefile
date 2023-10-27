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
	docker compose --env-file .env up -d

.PHONY: down
down: prelude
	docker compose --env-file .env $@

.PHONY: prelude
prelude: .env

.env:
	cp .env.sample .env
	sh docker/env-validator/validate.sh .env || mv .env .env.invalid

.PHONY: dev
dev: prelude
	@docker compose --env-file .env down -v
	@docker compose --env-file .env up -d --build

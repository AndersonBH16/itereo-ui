CMD_CP = cp

ifeq (${OS}, Windows_NT)

ifeq (,$(findstring /Git/,$(SHELL)))
CMD_CP = copy
endif

endif

start:
	@docker run -p 8081:8080 -ti --rm -v ${PWD}:/app --workdir /app node:16.20.0 sh -c 'export CYPRESS_CACHE_FOLDER=/app/.cache && npm install && npm run serve:local'

start-dev:
	@docker run -p 8080:8080 -ti --rm -v ${PWD}:/app --workdir /app node:16.20.0 sh -c 'export CYPRESS_CACHE_FOLDER=/app/.cache && npm install && npm run serve:dev'

test-local:
	@${CMD_CP} cypress.env.local.json cypress.env.json
	npm run cypress:open

test-dev:
	@${CMD_CP} cypress.env.dev.json cypress.env.json
	@docker run -it -v ${CURDIR}:/e2e -w /e2e cypress/included:12.6.0 --browser chrome

test-pre:
	@${CMD_CP} cypress.env.pre.json cypress.env.json
	@docker run -it -v ${CURDIR}:/e2e -w /e2e cypress/included:12.6.0 --browser chrome

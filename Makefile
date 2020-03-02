.PHONY: build
build:
	yarn build

.PHONY: clean
clean:
	yarn clean

.PHONY: publish
publish:
	yarn publish

.PHONY: test
test:
	yarn test

.PHONY: verify-configuration
verify-configuration: build
	yarn run \
		codeclimate-collector verify-configuration \
		pagerduty \
		collector-config.json

.PHONY: discover-streams
discover-streams: build
	yarn run \
		codeclimate-collector discover-streams \
		pagerduty \
		collector-config.json

.PHONY: sync-stream
# GNU `date` & BSD (MacOS) `date` are not compatible enough to easily do a
# relative date here. Not going to fuss too much and just pick a static date for
# now.
sync-stream: build
	yarn run \
		codeclimate-collector sync-stream \
		pagerduty \
		collector-config.json \
		'{"type": "Stream", "attributes":{"id":"1", "self": "https://pagerduty.com", "name":"Account"}}' \
		2020-01-01



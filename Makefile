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
		codeclimate-connector verify-configuration \
		pagerduty \
		connector-config.json

.PHONY: discover-streams
discover-streams: build
	yarn run \
		codeclimate-connector discover-streams \
		pagerduty \
		connector-config.json

.PHONY: sync-stream
# GNU `date` & BSD (MacOS) `date` are not compatible enough to easily do a
# relative date here. Not going to fuss too much and just pick a static date for
# now.
sync-stream: build
	yarn run \
		codeclimate-connector sync-stream \
		pagerduty \
		connector-config.json \
		'{"_type": "Stream", "id":"1", "self": "https://pagerduty.com", "name":"Account"}' \
		2020-01-01



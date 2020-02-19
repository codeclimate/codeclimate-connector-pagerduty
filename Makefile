.PHONY: test
test:
	bundle exec rspec $(RSPEC_ARGS)

.PHONY: pry
pry:
	bundle exec pry -r "codeclimate-collector-pagerduty"

.PHONY: build
build:
	mkdir -p build
	gem build codeclimate-collector-pagerduty.gemspec \
		--output "build/codeclimate-collector-pagerduty-$(shell cat VERSION).gem"


.PHONY: release
release: build
	gem push "build/codeclimate-collector-pagerduty-$(shell cat VERSION).gem"

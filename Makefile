.PHONY: test
test:
	bundle exec rspec $(RSPEC_ARGS)

.PHONY: pry
pry:
	bundle exec pry -r "codeclimate-collector-pagerduty"

# Code Climate Collector: PagerDuty

A collector integration for Code Climate Velocity to collect data from
[PagerDuty](https://pagerduty.com).

## Configuration

Expects configuration of the following schema:

```
{
  apiToken: "your_v2_api_token" # only needs read-only access
}
```

See [PagerDuty's docs][pd_api_support] for guidance on creating API keys.

[pd_api_support]: https://support.pagerduty.com/docs/generating-api-keys#section-generating-a-general-access-rest-api-key

## Development

Clone this repo, run `yarn install` to install dependencies. `yarn test` will
run unit tests.

## Running the collector locally

To run the collector in an integration environment, the
[`codeclimate-collector-sdk`][sdk] provides a CLI you can use.

First, generate a PagerDuty token, and write a file in this project's directory
called `collector-config.json` with the that token:

```json
{
  "apiToken": "YOUR_TOKEN"
}
```

To ensure the project's current code has been compiled into `./lib` for
execution, run `yarn build`.

Then, to run a sync, run (replace `YYYY-MM-DD` with the date you want to sync
back to):

```
yarn run codeclimate-collector sync-stream pagerduty collector-config.json '{"type": "Stream", "attributes":{"id":"1", "name":"Account"}}' YYYY-MM-DD
```

[sdk]: https://github.com/codeclimate/codeclimate-collector-sdk



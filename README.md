# Code Climate Collector: PagerDuty

A collector integration for Code Climate Velocity to collect data from
[PagerDuty](https://pagerduty.com).

## Configuration

Expects configuration of the following schema:

```
{
  api_token: "your_v2_api_token" # only needs read-only access
}
```

See [PagerDuty's docs][pd_api_support] for guidance on creating API keys.

[pd_api_support]: https://support.pagerduty.com/docs/generating-api-keys#section-generating-a-general-access-rest-api-key

# Automate releases from GitHub

GuessIt uses GitHub Flow with a protected `main`, short-lived branches, required pull-request CI, and squash merges. GitHub Actions owns deterministic release preparation from manually supplied version and release-note inputs, then a merged release pull request produces the shared Git tag that triggers the EAS iOS build and TestFlight upload. App Review submission remains an explicit GitHub Actions operation after TestFlight verification; a Codex skill would duplicate this repository-owned automation and is intentionally omitted.

## Consequences

- Release preparation uses the repository `GITHUB_TOKEN` with minimum permissions. CI created for its automated pull request enters GitHub's approval-required state.
- If that approval becomes recurring friction, replace `GITHUB_TOKEN` with a narrowly scoped GitHub App installation token so the release pull request can trigger CI automatically. Do not add a long-lived personal access token for this convenience.
- The version and release notes supplied in GitHub are committed before the release tag is created. Apple and Google use the same public semantic version; EAS owns only their independent technical build numbers.
- EAS remains responsible for the signed build and TestFlight upload. ASC CLI stages the versioned Apple metadata and performs the manually confirmed App Review submission.
- Additional TestFlight builds for a release run directly in EAS from its existing tag; GitHub does not duplicate this trigger.

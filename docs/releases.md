# Releases

GuessIt releases are operated from GitHub. A local Mac is not required after the one-time
repository setup.

## One-time GitHub setup

1. In **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve
   pull requests**.
2. Protect `main`, require the `Quality` status check, require pull requests, allow squash
   merges only, and disable force pushes and branch deletion.
3. Connect the repository to the GuessIt project from the Expo dashboard so EAS Workflows
   receive GitHub tag events.
4. Add these GitHub Actions secrets:
   - `ASC_KEY_ID`: the App Store Connect API key ID.
   - `ASC_ISSUER_ID`: the App Store Connect API issuer ID.
   - `ASC_PRIVATE_KEY_B64`: the base64-encoded App Store Connect `.p8` private key.
5. Create the `app-store-production` GitHub environment. Add a required reviewer when the
   repository plan supports environment approvals.

The automated release pull request uses the repository `GITHUB_TOKEN`. Its first CI run is
approval-required by GitHub. If this becomes recurring friction, use the GitHub App described
in [ADR 0002](adr/0002-automate-releases-from-github.md).

## Prepare and release a version

1. Open **Actions → Prepare release → Run workflow** from `main`.
2. Enter the public `X.Y.Z` version and the French release notes.
3. Review the generated `release/X.Y.Z` pull request, approve its CI run, then squash-merge it.
4. The merge creates the annotated `vX.Y.Z` tag.
5. The tag automatically starts the EAS iOS production build and uploads it to TestFlight.
6. After testing the build, open **Actions → Submit App Review → Run workflow**, enter `X.Y.Z`,
   and check the submission confirmation.

The preparation workflow keeps `package.json`, `app.config.ts`, Apple metadata, shared release
notes, and the Git tag on the same public version. EAS independently increments the technical
iOS build number.

## Additional TestFlight builds and recovery

- Run `eas workflow:run .eas/workflows/release-ios.yml --ref vX.Y.Z --wait` to build and upload
  another TestFlight build from an existing release tag. Always pass the tag; running from
  `main` would not reproduce the reviewed release source.
- Re-run a failed GitHub job from its workflow page. Release finalization is idempotent when the
  existing tag already points to the merged release commit.
- Do not submit App Review again when App Store Connect already has an active submission for the
  version. Inspect its state before retrying.

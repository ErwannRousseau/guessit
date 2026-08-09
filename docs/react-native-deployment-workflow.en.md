# Automating My React Native Releases from My iPhone

I was building a small React Native app for fun, entirely from my iPhone. With Codex in the ChatGPT app, I could control my agent on my Mac and keep the project moving without sitting at my desk.

Then came release time. And just like that, I was back to my old Fastlane workflow: start the build locally, keep an eye on it, and wait for everything to make its way to TestFlight. Fastlane did its job, but without CI or any infrastructure around it, my Mac was still running the show.

For a personal app, I had no interest in building a miniature release factory. I wanted something simple, inexpensive, and consistent with the way I was already developing the app.

The constraint became pretty obvious: **if I can develop from my phone, I should be able to ship from my phone too.** And through a single app: GitHub.

The result fits on one line:

`Prepare → review → merge → tag → EAS build → TestFlight → test → submit to App Review`

Two human decisions remain in that flow. The first starts the release with a version and changelog. The second approves the tested build for App Review. The workflows handle everything in between. The YAML has to earn its keep somehow.

## First green light: prepare what is shipping

From the GitHub app, I open the release preparation workflow. I enter a semantic version and the French release notes, then run it. At this point, my part fits into two fields.

```yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: Public semantic version, without the v prefix
        required: true
        type: string
      release_notes:
        description: French release notes
        required: true
        type: string
```

`workflow_dispatch` creates the form directly in the GitHub app. No need to build a dedicated interface just to send two values to a pipeline.

![Preparing the release from the GitHub app](assets/react-native-deployment-workflow/prepare-release-github-mobile.jpeg)

_The preparation workflow runs directly from the GitHub app._

Before touching any files, the workflow checks that the release starts from `main`, that the version is valid, and that the “What’s New” field is not empty. It then aligns the app version, package version, and Apple metadata.

It runs the same checks as any other contribution: formatting, linting, type checking, and tests. If everything passes, it creates a `release/X.Y.Z` branch, commits the changes, and opens a PR.

```yaml
- name: Validate prepared release
  run: |
    bun run format:check
    bun run lint
    bun run typecheck
    bun run test

- name: Commit release branch
  run: |
    git switch -c "$RELEASE_BRANCH"
    git add app.config.ts package.json store-metadata
    git commit -m "chore(release): prepare v$RELEASE_VERSION"
    git push --set-upstream origin "$RELEASE_BRANCH"

- name: Open release pull request
  run: |
    gh pr create \
      --base main \
      --head "$RELEASE_BRANCH" \
      --title "chore(release): prepare v$RELEASE_VERSION" \
      --body-file "$PR_BODY"
```

`PR_BODY` contains the summary and release notes prepared just before. Nothing magical here: the release becomes a branch, a commit, and a PR.

From my phone, I can read the changelog and check the changes one last time before merging. The release is clearly visible and reviewable instead of being prepared by a string of commands running somewhere outside GitHub.

![A release pull request with its branch and release notes in the GitHub app](assets/react-native-deployment-workflow/release-pull-request-github-mobile.jpeg)

_The release PR brings the version, branch, and notes together for one last review before merging._

## The tag comes after review, not before

I could have created the tag in the first workflow. It would have been shorter, but it would also have removed the guarantee I actually cared about: building the code I had just reviewed and merged.

A second workflow waits for the PR to close and only continues if it was merged. It reads the `merge_commit_sha`, then creates the annotated tag on that commit.

```yaml
if: >-
  github.event.pull_request.merged == true &&
  startsWith(github.event.pull_request.head.ref, 'release/')

env:
  RELEASE_COMMIT: ${{ github.event.pull_request.merge_commit_sha }}

- name: Create the annotated tag
  run: |
    git tag -a "$TAG" "$RELEASE_COMMIT" -m "$TAG"
    git push origin "$TAG"
```

The tag answers a very practical question: which code produced this build? If something goes wrong later, I can find the exact commit immediately.

The same workflow then creates the GitHub Release. EAS detects the `vX.Y.Z` tag and starts the production iOS build.

## EAS gets the build off my Mac

EAS is Expo’s cloud service for building and distributing apps. Its job here is simple: GitHub pushes the tag, EAS detects it, and the build starts on Expo’s infrastructure.

The configuration has two jobs. The first builds the app with the production iOS profile. The second waits for that result, reads its identifier, and sends that exact build to TestFlight.

```yaml
on:
  push:
    tags:
      - "v*.*.*"

jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: production

  testflight:
    needs: [build_ios]
    type: submit
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      profile: production
```

## TestFlight does not stop the automation

Once the binary reaches TestFlight, the release is prepared. I can install it on my iPhone and share it with other people, not just developers. They install the app normally, test it, and tell me how it feels.

![The iOS build available to install and test in TestFlight](assets/react-native-deployment-workflow/testflight-build-ios-redacted.png)

_The same build is available in TestFlight for a final check on a real device._

That covers what automated tests cannot really measure: the app’s feel, its transitions, and its behaviour on an actual device.

This manual test is not the end of the automation. The pipeline is simply waiting for my second green light, just as it originally waited for the version and release notes.

When I am happy with the build, I open a second workflow in GitHub. I enter the version and confirm the submission. ASC CLI then takes over App Store Connect: it validates the metadata, selects the latest valid TestFlight build for that version, and sends it to App Review.

![The Submit App Review workflow form in the GitHub app on iPhone](assets/react-native-deployment-workflow/submit-app-review-github-mobile.jpeg)

_After testing, submission to App Review requires explicit confirmation._

```yaml
- name: Resolve latest valid build
  id: build
  run: |
    BUILD_ID="$(
      asc builds list \
        --app "$ASC_APP_ID" \
        --version "$RELEASE_VERSION" \
        --platform IOS \
        --processing-state VALID \
        --sort=-uploadedDate \
        --limit 1 \
        --output json |
        jq -er '.data[0].id'
    )"
    echo "id=$BUILD_ID" >>"$GITHUB_OUTPUT"

- name: Preview App Review submission
  env:
    BUILD_ID: ${{ steps.build.outputs.id }}
  run: |
    asc review submit \
      --app "$ASC_APP_ID" \
      --version "$RELEASE_VERSION" \
      --build "$BUILD_ID" \
      --platform IOS \
      --dry-run \
      --output table

- name: Submit App Review
  env:
    BUILD_ID: ${{ steps.build.outputs.id }}
  run: |
    asc review submit \
      --app "$ASC_APP_ID" \
      --version "$RELEASE_VERSION" \
      --build "$BUILD_ID" \
      --platform IOS \
      --confirm \
      --output table
```

The workflow selects the latest valid build for the requested version. It first runs the command with `--dry-run`, then performs the same submission with `--confirm`. ASC CLI handles the rest.

I have not removed people from the pipeline. I have just limited their role and the time they spend in it: announce the release, test the result, and approve its submission. Everything else runs on its own.

`Human intent → automated preparation → human testing → automated submission`

## What I would keep for another app

My implementation currently covers iOS, TestFlight, and App Review. Android and Google Play still need to be added, but the model itself is not really tied to Apple.

The principles I would keep:

- **Prepare in GitHub.** Review the version, notes, and metadata before creating the tag.
- **Tag the commit that was actually validated.** If something goes wrong, the tag points straight back to the code that produced the build.
- **Give each operation one tool.** EAS builds and sends the binary. On Apple’s side, `asc` handles metadata and the App Review submission. For the Play Store, the equivalent would be `gpc`.
- **Keep the decisions human.** I give the green light; the workflow executes what comes next.

This model also works really well in a team. GitHub keeps track of what is shipping, which checks ran, and which decisions were made. The release no longer lives inside a terminal or one person’s memory.

And voilà. From my iPhone, I can provide a version and changelog, review the preparation, test the build, and approve its trip to App Review. No need to pull a terminal out of my pocket.

I can finish from my phone the same journey I started there: build an idea, prepare its release, test it, then send it to the App Store. And honestly, the DX is pretty nice.

It still needs some polishing, of course, but it works well. Give it a try!

You can see the complete setup in the repo: https://github.com/ErwannRousseau/guessit

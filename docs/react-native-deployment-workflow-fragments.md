# Deploying my React Native app: workflow fragments

I want to write about the deployment workflow for my React Native app.

---

The workflow does not break. That is the point: run one release, let it build and deploy, then finalize the release for public store publication.

---

The release is not a Mac ritual. GitHub creates the release pull request, validates the version and French release notes, aligns the app, package, and store metadata, then creates the tag after merge. The tag starts EAS, which builds the signed iOS binary and uploads it to TestFlight. Only after testing does a separate, explicitly confirmed workflow stage metadata and submit the build to App Review.

---

The useful boundary is between delivery and publication: EAS owns signed binaries and TestFlight; the store CLI owns storefront metadata and the explicit review submission. A TestFlight build is delivered, not yet publicly released.

---

The article is about an elegant automation and a reproducible release architecture.

---

The tag, generated release pull request, clear ownership between EAS and App Store Connect, and manual public-submission gate are one system. Together they turn a release into a repeatable path from reviewed source to a public store listing.

---

I build most features in the Codex app, using it as a harness. I did not want releasing an app to require returning to my Mac for a sequence of manual steps. A release should stay possible from GitHub: prepare the release, merge it, publish the tag, and let the infrastructure build and deliver it.

---

The goal is not merely CI. It is location independence: development can happen through Codex, and release delivery can happen through GitHub, without a local machine becoming a hidden production dependency.

---

I use this workflow as a solo React Native developer, but it becomes more valuable in a team. The same GitHub-native release path gives everyone the same source of truth, creates a reviewable release change, and keeps the irreversible public-submission decision explicit.

---

This release path prevents four quiet failures: building the wrong commit; letting public version, release notes, and metadata diverge; publishing by accident; and releasing without a visible validation record.

---

Leading word: release pipeline. The source commit, semantic version, release notes, metadata, tag, binary delivery, and public-submission gate all agree on what “this release” means.

---

The article should work at three depths. Some readers can copy the GitHub workflows, some can adapt the architectural boundaries to their own stack, and some only need the mental model: releases should be reproducible, reviewable, and independent of one person’s laptop.

---

The concrete example is iOS: a tag triggers EAS to build and upload to TestFlight, then a separate confirmed GitHub action submits the tested build to App Review. The architectural principles apply to multiple stores even where the Android automation is not yet implemented.

# Separate binary delivery from store administration

GuessIt uses EAS Build and EAS Submit as the exclusive owners of signed iOS and Android builds, developer-facing build numbers, and binary uploads. App Store administration is owned by ASC CLI and Google Play administration by GPC because EAS Metadata is Apple-only and still in beta; we intentionally avoid overlapping commands such as `asc builds upload` and `eas metadata:push`.

## Consequences

- Git owns durable publication inputs. `store-metadata/apple/**` and the future `store-metadata/google/**` are the canonical platform-specific metadata; Markdown files are editorial drafts only.
- Starting with the next release, one user-facing semantic version is shared by `app.config.ts`, Apple, and Google, while EAS remotely increments `ios.buildNumber` and `android.versionCode`.
- A normal production release maps both platforms to the same source commit and `vX.Y.Z` tag.
- Store rollout is softly synchronized within the same release window. Review delays, rejections, and platform-specific hotfixes may justify temporary divergence; strict coordination is reserved for launches that require it.

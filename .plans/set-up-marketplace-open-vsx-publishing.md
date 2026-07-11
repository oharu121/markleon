# Plan: Set up Marketplace + Open VSX publishing

**Status:** Completed
**Date:** 2026-07-11

## Goal

Establish an automated release-publish pipeline for the markleon VS Code extension,
triggered when a GitHub release is published, and harden the CI that gates it.

## Summary of Changes

- Rewrote the publish workflow to fit a **pnpm-based VS Code extension** (was a
  broken npm-library template): trigger changed to `release: published`, pnpm
  install with `--frozen-lockfile`, and real gates (`typecheck` + `lint` + `test`).
- Publishes a single packaged `.vsix` to **VS Code Marketplace** (`vsce`, via
  `VSCE_PAT`) and **Open VSX** (`ovsx`, with idempotent namespace create).
- Added **npm Trusted Publishing** via OIDC — `id-token: write`, no stored token,
  automatic provenance; runs last so it can't block the extension publish.
- Repaired the Dependabot auto-merge workflow (`fetch-metadata@v5` → `@v3`).
- Upgraded to **TypeScript 6** and **`@types/node` 24 (LTS line)**; added explicit
  `"types": ["node", "vscode"]` to tsconfig; pinned `@types/node` majors in
  Dependabot to stay on the Node LTS line.
- Added `"packageManager": "pnpm@10.21.0"` so `pnpm/action-setup` resolves in CI.

## Files Modified

- [.github/workflows/publish.yml](.github/workflows/publish.yml) - full rewrite: release-triggered, pnpm, Marketplace + Open VSX + npm (OIDC)
- [.github/workflows/dependabot-auto-merge.yml](.github/workflows/dependabot-auto-merge.yml) - `fetch-metadata@v5` → `@v3`
- [.github/dependabot.yml](.github/dependabot.yml) - ignore `@types/node` semver-major
- [tsconfig.json](tsconfig.json) - explicit `types`; TS 6 baseline
- [package.json](package.json) - TS 6, `@types/node` 24, `packageManager`

## Breaking Changes

None (user-facing extension behavior unchanged).

## Deprecations

Azure DevOps retires global PATs on 2026-12-01; `VSCE_PAT` must migrate to Entra
ID/OIDC before then. A note and pre-provisioned app registration are documented
in the workflow.

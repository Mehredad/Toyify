---
id: 0001
title: Initialize openspec for the repository
status: accepted
authors:
  - Mehredad <you@example.com>
created: 2026-01-07
---

## Summary

Add an `openspec/` directory with basic spec layout and templates to start tracking architecture and change proposals.

## Motivation

The project rules require an `openspec` directory to keep design decisions and change proposals documented and discoverable.

## Specification

- Create `openspec/spec/changes/`, `openspec/spec/archived/`, and `openspec/spec/templates/`.
- Add a `change-template.md` to standardize proposals.

## Drawbacks

Small repository size increase; maintenance overhead for specs.

## Alternatives

Track proposals in a single markdown file, but that reduces discoverability and structure.

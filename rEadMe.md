# Floyd cli

A cli for automating and simplifying common tasks such as

-   Managing git worktrees (creating, displaying, switching, deleting, etc.)
-   Managing pr checks (displaying, rerunning, etc.)
-   Scaffolding projects
-   More to come...

## Installation

1. Clone the repo
2. Run `npm i`
3. Run `npm i . -g` - may require the good ol' `sudo`

## TODO
-   [ ] Refactor config handling -> consider using the configStore package
-   [ ] Create a $schema for the config file
-   [x] Add installation instructions

### Features
-   [x] git worktrees
-   [ ] http server
-   [ ] Playgrounds (angular, ...) -> take inspration from joshua morony's playground script
-   [ ] More workflow commands
    -   [ ] Make more generic
    -   [ ] eslint
-   [ ] Maybe some ci runs specific stuff (for handling runs that arent triggered by a PR)
-   [ ] PRs
    -   [x] Checks
    -   [ ] Opening `gh pr create` ...
    -   [ ] Merging `gh pr merge --auto --squash --delete-branch <number>`

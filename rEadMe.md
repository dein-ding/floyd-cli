# Floyd cli
A cli for automating and simplifying common tasks such as
 - Managing git worktrees (creating, displaying, switching, deleting, etc.)
 - Managing pr checks (displaying, rerunning, etc.)
 - Scaffolding projects
 - More to come...

## TODO
- [x] git worktrees
- [ ] http server
- [ ] Playgrounds (angular, ...) -> take inspration from joshua morony's playground script
- [ ] More init commands
     - [ ] Make more generic
     - [ ] eslint
- [ ] Maybe some ci runs specific stuff (for handling runs that arent triggered by a PR)
- [ ] PRs
     - [x] Checks
     - [ ] Opening `gh pr create` ...
     - [ ] Merging `gh pr merge --auto --squash --delete-branch <number>`

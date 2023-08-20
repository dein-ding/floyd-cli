import { Logger } from '../../lib/logger.service'
import { getRelativePathOf } from '../../lib/utils'
import { Worktree } from './git.model'
import { GitRepository } from './git.repo'

export const fixBranchName = (branch: string) =>
    branch.replace('refs/', '').replace('heads/', '').replace('remotes/', '').replace('origin/', '')

export const getWorktreeDisplayStr = (tree: Worktree, isDirty?: boolean) => {
    const isCurrentTree = tree.isCurrent ? '(current) '.yellow : ''
    const info = [
        isDirty ? 'dirty' : null,
        tree.isLocked ? 'locked'.red : null,
        tree.isPrunable ? 'prunable'.cyan : null,
    ]
        .filter(Boolean)
        .join(', ')
    const checkedOut = tree.isBare ? '[bare]'.yellow : tree.isDetached ? tree.head?.green : tree.branch?.green
    const isMainWorktree = tree.isMainWorktree ? ' (main)'.blue : ''

    return `${checkedOut} ${isCurrentTree}${info ? `(${info}) ` : ''}${tree.directory.dim}${isMainWorktree}`
}

export const getNextWorktreeName = (worktrees: Worktree[]) => {
    const worktreesIndicies = worktrees
        .map(worktree => /worktree-\d+/.exec(worktree.directory)?.[0]?.match(/\d+/)?.[0])
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => a - b)
    const nextIndex = (worktreesIndicies[worktreesIndicies.length - 1] || 0) + 1

    return `worktree-${nextIndex}`
}

export const getBranchWorktreeString = (worktrees: Worktree[], branch: string | undefined): string => {
    const checkedOutWorktree = worktrees.find(wt => wt.branch == branch)
    const pathToWorkTree = checkedOutWorktree ? getRelativePathOf(checkedOutWorktree.directory).dim : ''

    if (!checkedOutWorktree) return ''

    return ` ${'(checked out'.red} ${pathToWorkTree}${')'.red}`
}

export const getWorktreeFromBranch = (
    branch: string,
    worktrees = GitRepository.getInstance().getWorktrees(),
) => {
    const worktree = worktrees.find(tree => {
        return tree.branch == branch || tree.branch == fixBranchName(branch)
    })
    if (!worktree) {
        Logger.getInstance().warn(`No worktree found for branch ${branch}`.red)
        process.exit(1)
    }

    return worktree
}

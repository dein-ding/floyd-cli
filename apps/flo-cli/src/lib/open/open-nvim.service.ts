import { Logger } from '../logger.service'
import { SysCallService } from '../sys-call.service'
import { OpenPort } from './open.types'

export class OpenNeovimService implements OpenPort {
    constructor(private sysCallService: SysCallService) {}

    name = 'neovim'
    isReuseWindowSupported = false
    isFilesSupported = true
    isFoldersSupported = true
    isUrlsSupported = false

    open(directory: string, options?: { reuseWindow?: boolean }) {
        this.assertInstalled()

        if (options?.reuseWindow) Logger.getInstance().warn('Reusing windows is not supported with neovim.')

        Logger.getInstance().log(`Opening ${directory.green} in neovim...`.dim)
        try {
            this.sysCallService.execInherit(`nvim ${directory}`)
            return true
        } catch (e) {
            Logger.error(`Failed to open ${directory} in neovim.`.red)
            Logger.debug(e)
            return false
        }
    }

    isInstalled = () => this.sysCallService.testCommand('nvim --version')
    assertInstalled() {
        if (this.isInstalled()) return

        Logger.error('Please install nvim'.red)
        process.exit(1)
    }
}

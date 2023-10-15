import fs from 'fs'
import { z } from 'zod'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { interpolateVariables, stripJsonComments } from '../../../../../packages/common/src'
import env from '../../../env.json'
import { Logger } from '../logger.service'
import { OpenService } from '../open/open.service'
import { OpenType } from '../open/open.types'
import { indent } from '../utils'
import { globalConfigSchema } from './config.schemas'
import { DEFAULT_LOG_LEVEL, globalPaths } from './config.vars'

export const initConfig = () => {
    const rawDefaultConfig = fs.readFileSync(globalPaths.defaultConfigFile, 'utf-8')
    const interpolatedDefaultConfig = interpolateVariables(rawDefaultConfig, {
        cliVersion: env.VERSION,
        defaultLogLevel: DEFAULT_LOG_LEVEL,
    })

    fs.mkdirSync(globalPaths.configRoot, { recursive: true })
    fs.writeFileSync(globalPaths.configFile, interpolatedDefaultConfig)
}

export const readOrInitConfig = () => {
    try {
        const exists = fs.existsSync(globalPaths.configFile)
        if (!exists) initConfig()

        const rawConfigFile = fs.readFileSync(globalPaths.configFile, 'utf-8')
        const strippedConfigFile = stripJsonComments(rawConfigFile, { trailingCommas: true })
        const parsed = JSON.parse(strippedConfigFile)
        const validated = globalConfigSchema.parse(parsed)

        return { config: validated, rawConfigFile, strippedConfigFile }
    } catch (e) {
        if (e instanceof z.ZodError) {
            Logger.error('Config file is invalid:\n'.red)
            Logger.error(
                e.issues
                    .map(issue => {
                        const message = ` - ${issue.message.red} (at config.${issue.path.join('.')})`

                        if ('unionErrors' in issue)
                            return (
                                message +
                                ' -> One of these must apply\n' +
                                issue.unionErrors
                                    .map(unionError =>
                                        indent(
                                            ` - config.${unionError.issues[0]?.path.join('.')}: ${
                                                (unionError.issues[0] as z.ZodInvalidTypeIssue).expected.red
                                            }`,
                                        ),
                                    )
                                    .join('\n')
                            )

                        return message
                    })
                    .join('\n') + '\n',
            )
            console.error(e)
            process.exit(1)
        }
        if (e instanceof SyntaxError) {
            Logger.error(`Config file is invalid: ${e.message}`.red)
            process.exit(1)
        }

        throw e
    }
}

export const editConfig = () => {
    Logger.getInstance().verbose('Opening config file '.dim, globalPaths.configFile.yellow)

    // @TODO: this should be in the config service
    OpenService.getInstance().useFirst(OpenType.Neovim).open(globalPaths.configFile)
}

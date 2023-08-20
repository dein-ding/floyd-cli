import { z } from 'zod'
import { LogLevel } from '../logger.service'
import { workflowSchema } from '../workflows/workflow.schemas'
import { worktreeConfigSchema } from '../worktrees/worktree-config.schemas'
import { DEFAULT_LOG_LEVEL } from './config.vars'
import { validateWorkflows } from '../workflows/validate-workflows'

export type ProjectConfig = z.infer<typeof projectConfigSchema>
export const projectConfigSchema = worktreeConfigSchema

export type BaseConfig = z.infer<typeof baseConfigSchema>
export const baseConfigSchema = z.object({
    version: z.string(),
    logLevel: z.nativeEnum(LogLevel).default(DEFAULT_LOG_LEVEL),
    workflows: workflowSchema
        .array()
        .optional()
        .refine(validateWorkflows, { message: 'Invalid workflow definition, see above.' }),
})

export type LocalConfig = z.infer<typeof localConfigSchema>
export const localConfigSchema = baseConfigSchema.merge(projectConfigSchema)

export type GlobalConfig = z.infer<typeof globalConfigSchema>
export const globalConfigSchema = baseConfigSchema.extend({
    projects: z.record(z.string(), projectConfigSchema).optional(),
})

export type Config = z.infer<typeof configSchema>
export const configSchema = globalConfigSchema

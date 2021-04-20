import * as core from '@actions/core'
import sloc from 'node-sloc'

async function run(): Promise<void> {
  try {
    const filesToIgnore = JSON.parse(core.getInput('filesToIgnore'))
    const maxCount: number = +core.getInput('filesToIgnore')
    const fileOrFolderToProcess: string = core.getInput('fileOrFolderToProcess')

    const stats = await sloc({
      path: fileOrFolderToProcess,
      extensions: ['ts', 'html', 'css', 'scss'],
      ignorePaths: filesToIgnore,
      ignoreDefault: true
    })

    if ((stats?.sloc || 0) > maxCount) {
      core.setFailed(
        `The total amount of lines exceeds the maximum allowed.
        Total Amount: ${stats?.sloc}
        Max Count: ${maxCount}`
      )
    }

    core.debug(stats?.sloc?.toString() || '')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

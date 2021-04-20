import * as core from '@actions/core'
import sloc from 'node-sloc'

async function run(): Promise<void> {
  try {
    // extract inputs
    const filesAndFoldersToIgnore = JSON.parse(
      core.getInput('filesAndFoldersToIgnore')
    )
    const maxCount: number = +core.getInput('maxCount')
    const fileOrFolderToProcess: string = core.getInput('fileOrFolderToProcess')

    // calculate loc stats
    const stats = await sloc({
      path: fileOrFolderToProcess,
      extensions: ['ts', 'html', 'css', 'scss'],
      ignorePaths: filesAndFoldersToIgnore,
      ignoreDefault: true
    })

    // set the output of the action
    core.setOutput('locs', stats?.sloc)

    // debug information is only available when enabling debug logging https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging
    core.debug(`LOC ${stats?.sloc?.toString() || ''}`)
    core.debug(`Max Count ${maxCount.toString() || ''}`)

    // verify that locs threshold is not exceeded
    if ((stats?.sloc || 0) > maxCount) {
      core.debug('Threshold exceeded')
      throw new Error(
        `The total amount of lines exceeds the maximum allowed.
        Total Amount: ${stats?.sloc}
        Max Count: ${maxCount}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

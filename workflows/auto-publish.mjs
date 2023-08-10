/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios'
import { Octokit } from 'octokit'
import * as semver from 'semver'
import * as fs from 'fs/promises'
import * as path from 'path'
import { $ } from 'execa'
import { dirname } from 'dirname-filename-esm'
import { setTimeout } from 'timers/promises'

/**
 * Returns versions in recent order from npm registry
 *
 * @returns {Promise<string>}
 */
async function getPublishedVersion() {
  const res = await axios.get('https://registry.npmjs.org/hasura-cli')
  const versions = Object.keys(res.data.versions)
  return versions
}

/**
 * Returns versions in recent order from github releases
 *
 * @returns {Promise<string>}
 */
async function getGithubReleases() {
  const octokit = new Octokit({
    // auth: process.env.GITHUB_TOKEN, // When using GraphQL, auth token is required.
  })

  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'hasura',
    repo: 'graphql-engine',
    // eslint-disable-next-line @typescript-eslint/camelcase
    per_page: 20,
    order: 'desc',
    sort: 'created_at',
  })

  // eslint-disable-next-line @typescript-eslint/camelcase
  return releases.data.map(({ tag_name }) => semver.clean(tag_name)) // removes 'v' prefix
}

/**
 * Returns versions that's not published to npm, but on github releases.
 *
 * @returns {Promise<string>} - ascending order by creation time of github releases
 */
async function versionsToPublish() {
  const publishedVersions = await getPublishedVersion()
  const githubReleases = await getGithubReleases()
  return githubReleases
    .slice()
    .reverse()
    .filter(version => !publishedVersions.includes(version))
}

/**
 * Modify package.json versionr versions that's not published to npm, but on github releases.
 *
 * @param {string} version
 */
async function changeVersion(version) {
  const filename = path.join(dirname(import.meta), '..', 'package.json')
  const rawPackageJson = await fs.readFile(filename, {
    encoding: 'utf-8',
  })
  const packageJson = JSON.parse(rawPackageJson)
  packageJson.version = version
  await fs.writeFile(filename, JSON.stringify(packageJson, undefined, 2), {
    encoding: 'utf-8',
  })
}

async function main() {
  const $$ = $({ stdio: 'inherit', cwd: path.join(dirname(import.meta), '..') })
  const versions = await versionsToPublish()
  for (const version of versions) {
    console.log(`Publishing ${version}`)
    await changeVersion(version)
    await $$`yarn test`
    await $$`git checkout hasura` // Reset ./hasura file if it's modified by postinstall lifecycle. This is preventive purpose.
    await $$`git add package.json`
    const message = `chore(release): v${version} \n\n[skip ci]`
    await $$`git commit -m ${message}` // message is quoted(escaped) automatically by execa
    await $$`git tag v${version}`
    await $$`git push`
    await $$`git push origin --tags`
    const parsed = semver.parse(version)
    const tag = parsed?.prerelease[0] // e.g. 'alpha', 'beta', or null(stable)
    console.log(tag)
    if (tag) {
      await $$`npm publish --tag ${tag}`
    } else {
      await $$`npm publish`
    }
    await setTimeout(5 * 1000) // wait for 5 seconds
  }
}

main()

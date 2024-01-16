/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import axios from 'axios'
import { Octokit } from 'octokit'
import * as semver from 'semver'
import path from 'upath'
import { $ as $$ } from 'execa'
import { dirname } from 'dirname-filename-esm'
import { readPackage } from 'read-pkg'

const projectRoot = path.resolve(dirname(import.meta), '..')

/**
 * Returns versions in recent order from npm registry
 */
async function getPublishedVersions(): Promise<Set<string>> {
  const res = await axios.get<{ versions: Record<string, unknown> }>(
    'https://registry.npmjs.org/hasura-cli',
  )
  const versions = new Set(Object.keys(res.data.versions))
  return versions
}

/**
 * Returns versions in recent order from github releases
 */
async function getGithubReleases(): Promise<string[]> {
  const octokit = new Octokit({
    // auth: process.env.GITHUB_TOKEN, // When using GraphQL, auth token is required.
  })

  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'hasura',
    repo: 'graphql-engine',
    per_page: 20,
    order: 'desc',
    sort: 'created_at',
  })

  // tag_name: 'v3.alpha.12-19-2023' will be mapped to null
  return releases.data.map(({ tag_name }) => semver.clean(tag_name)) as string[] // removes 'v' prefix
}

/**
 * Returns versions that's not published to npm, but on github releases
 * in ascending order by creation time of github releases
 */
async function versionsToPublish(): Promise<string[]> {
  const publishedVersions = await getPublishedVersions()
  const githubReleases = await getGithubReleases()
  return githubReleases
    .reverse()
    .filter((version) => !publishedVersions.has(version))
}

/**
 * Modify package.json versionr versions that's not published to npm, but on github releases.
 *
 * @param {string} version
 */
async function changeVersion(version: string) {
  const filename = path.resolve(projectRoot, 'package.json')
  const packageJson = await readPackage({
    cwd: projectRoot,
    normalize: false,
  })
  packageJson.version = version
  await fs.writeFile(
    filename,
    JSON.stringify(packageJson, undefined, 2),
    'utf8',
  )
}

async function main() {
  const $ = $$({ stdio: 'inherit', cwd: projectRoot })
  const versions = await versionsToPublish()
  for (const version of versions) {
    // `version` of 'v3.alpha.12-19-2023' will be null
    if (!version) {
      continue
    }

    console.log(`Publishing ${version}`)
    await changeVersion(version)
    await $`pnpm test`
    await $`git checkout hasura` // Reset ./hasura file if it's modified by postinstall lifecycle. This is preventive purpose.
    await $`git add package.json`
    const message = `chore(release): v${version}

[skip ci]`
    await $`git commit -m ${message}` // message is quoted(escaped) automatically by execa
    await $`git tag v${version}`
    await $`git push`
    await $`git push origin --tags`
    const parsed = semver.parse(version)
    const tag = parsed?.prerelease[0] // e.g. 'alpha', 'beta', or null(stable)
    console.log(tag)
    await (tag ? $`pnpm publish --tag ${tag}` : $`pnpm publish`)
    await setTimeout(5 * 1000) // wait for 5 seconds
  }
}

await main()

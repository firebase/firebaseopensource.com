import { queryFirestore } from 'firewings'
import { Env, PageContent, ProjectConfig, RepoRelease } from '../../shared/types'
import { Util } from '../../shared/util'
import { Category } from '@/types/app'

// The @/plugins/nuxtFireInit.js plugin initializes Firebase and
// caslls _setupFirestore() to set the fireStore instance in this file.
let fireStore: firebase.firestore.Firestore
export const _setupFirestore = (firestore: firebase.firestore.Firestore) => {
  fireStore = firestore
}

// Categories used for the subheader
const ALL_CATEGORIES = [
  {
    title: 'Android',
    icon: 'android',
    platform: 'android',
    projects: [],
    featured: []
  },
  {
    title: 'Web',
    icon: 'web',
    platform: 'web',
    projects: [],
    featured: []
  },
  {
    title: 'iOS',
    icon: 'phone_android',
    platform: 'ios',
    projects: [],
    featured: []
  },
  {
    title: 'Admin',
    icon: 'lock',
    platform: 'admin',
    projects: [],
    featured: []
  },
  {
    title: 'Games',
    icon: 'gamepad',
    platform: 'games',
    projects: [],
    featured: []
  }
]

/**
 * Firebase get() call to retrieve a "config" document by id & env
 */
export async function getProjectConfig (id: string, env: Env): Promise<ProjectConfig> {
  const path = Util.configPath(id, env)
  const ref = fireStore.doc(path)
  try {
    const config = await queryFirestore(ref)
    if (!config) {
      return Promise.reject(new Error(`No config exists for "${id}" at "${path}"`))
    }
    return cleanConfig(config)
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Firebase get() call to retrieve the "configs" documents.
 */
export async function getProjectConfigs (category: Category, limit: number): Promise<ProjectConfig[]> {
  const ref = fireStore.collection('configs').orderBy(`platforms.${category.platform}`)
    .where('blacklist', '==', false)
    .where('fork', '==', false)
    .orderBy('stars', 'desc')
    .orderBy('description')
    .limit(limit)
  try {
    const configs = await queryFirestore(ref)
    for (let config of configs) {
      config = cleanConfig(config)
    }
    return configs
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Firebase get() call to retrieve a "content" OR "content-staging" document.
 */
export async function getProjectContent (id: string, env: Env): Promise<PageContent> {
  const path = Util.contentPath(id, env)
  const ref = fireStore.doc(path)
  try {
    const content = await queryFirestore(ref)
    return content
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Firebase get() call to retrieve the "pages" (i.e. "subpages") documents for a project.
 */
export async function getSubpage (id: string, env: Env, pageId: string): Promise<PageContent> {
  const repoContentRef = fireStore.doc(Util.contentPath(id, env))
  if (!pageId.endsWith('.md')) {
    pageId += '.md'
  }
  const pageContentRef = repoContentRef.collection('pages').doc(pageId)
  try {
    const pageContent = await queryFirestore(pageContentRef)
    return pageContent
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Firebase get() call to retrieve x-amount of recent "releases" documents.
 */
export async function getRecentReleases (amount: number): Promise<RepoRelease> {
  const ref = fireStore.collection('releases').orderBy('created_at', 'desc')
    .limit(amount)
  try {
    const releases = await queryFirestore(ref)
    for (let release of releases) {
      release = cleanRelease(release)
    }
    return releases
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Get categories by platform.
 */
export function getCategories (platform: String | null = null): Category[] {
  if (platform) {
    return [ALL_CATEGORIES.find(x => x.platform === platform)!]
  }
  return ALL_CATEGORIES
}

/**
 * Clean Timestamps
 * Firebase Timestamps in Nuxt lead to a `WARN Cannot stringify arbitrary non-POJOs Timestamp (repeated 153 times)` warning.
 * This leads to the fact, that we cannot call toDate() on the Timestamp later on in code.
 * Therefore, we toDate() all timestamps here.
 */
function cleanRelease (release: any): RepoRelease {
  release.created_at = release.created_at.toDate()
  return release
}

function cleanConfig (config: any): ProjectConfig {
  config.last_updated = new Date(config.last_updated)
  config.last_fetched = config.last_fetched.toDate()
  return config
}

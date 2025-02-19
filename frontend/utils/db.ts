import { initializeApp } from 'firebase/app';
import { doc, getFirestore, getDoc, collection, orderBy, query, where, limit as limitTo, getDocs } from 'firebase/firestore/lite';

import type { PageContent, ProjectConfig, RepoRelease } from '../../shared/types';
import type { Category } from '@/types/app'
import firebaseConfig from '../../shared/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);

// TODO get this from ../shared
export enum Env {
  STAGING = "staging",
  PROD = "prod",
}

export class Util {

  static contentPath(id: string, env: Env = Env.PROD) {
    if (env == Env.STAGING) {
      return `/content-staging/${Util.normalizeId(id)}`;
    } else {
      return `/content/${Util.normalizeId(id)}`;
    }
  }

  static configPath(id: string, env: Env = Env.PROD) {
    if (env == Env.STAGING) {
      return `/configs-staging/${Util.normalizeId(id)}`;
    } else {
      return `/configs/${Util.normalizeId(id)}`;
    }
  }

  /**
   * Make sure all IDs have the same casing, etc.f
   */
  static normalizeId(id: string): string {
    return id.toLowerCase();
  }

  /**
   * Convert a path with slashes to a slug.
   */
  static pathToSlug(path: string): string {
    return this.normalizeId(path.replace(/\//g, "::"));
  }

  /**
   * Parse a project ID slug into {owner,repo,path}.
   */
  static parseProjectId(id: string) {
    const sections = id.split("::");

    if (sections.length < 2) {
      throw `Invalid project id: ${id}`;
    }

    const owner = sections[0];
    const repo = sections[1];

    let path = undefined;
    if (sections.length > 2) {
      const pathSections = sections.slice(2, sections.length);
      path = pathSections.join("/");
    }

    return {
      owner,
      repo,
      path
    };
  }
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
export async function getProjectConfig (id: string, env: Env): Promise<ProjectConfig|null> {
  const path = Util.configPath(id, env)
  const ref = doc(firestore, path)
  try {
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return cleanConfig({
      ...snapshot.data(),
      id: snapshot.id,
      ref: snapshot.ref.toString(),
    })
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Firebase get() call to retrieve the "configs" documents.
 */
export async function getProjectConfigs(category: Category, limit: number): Promise<ProjectConfig[]> {
  try {
    const snapshot = await getDocs(
        query(
            collection(firestore, "configs"),
            orderBy(`platforms.${category.platform}`),
            where('blacklist', '==', false),
            where('fork', '==', false),
            orderBy('stars', 'desc'),
            orderBy('description'),
            limitTo(limit),
        )
    );
    return snapshot.docs.map(it =>
      cleanConfig({
        ...it.data(),
        id: it.id,
        ref: it.ref.toString(),
      })
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Firebase get() call to retrieve a "content" OR "content-staging" document.
 */
export async function getProjectContent (id: string, env: Env): Promise<PageContent|null> {
  const path = Util.contentPath(id, env)
  const ref = doc(firestore, path)
  try {
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null
    return {
      ...snapshot.data(),
      id: snapshot.id,
      ref: snapshot.ref.toString()
    } as PageContent;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Firebase get() call to retrieve the "pages" (i.e. "subpages") documents for a project.
 */
export async function getSubpage(id: string, env: Env, pageId: string): Promise<PageContent|null> {
  const repoContentRef = doc(firestore, Util.contentPath(id, env))
  if (!pageId.endsWith('.md')) {
    pageId += '.md'
  }
  const pageContentRef = doc(collection(repoContentRef, 'pages'), pageId);
  try {
    const snapshot = await getDoc(pageContentRef);
    if (!snapshot.exists()) return null;
    return {
      ...snapshot.data(),
      id: snapshot.id,
      ref: snapshot.ref.toString()
    } as PageContent;
  } catch (e) {
    console.error(e);
    return null
  }
}

/**
 * Firebase get() call to retrieve x-amount of recent "releases" documents.
 */
export async function getRecentReleases (amount: number): Promise<RepoRelease[]> {
  const ref = query(
    collection(firestore, 'releases'),
    orderBy('created_at', 'desc'),
    limitTo(amount),
  );
  try {
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(it => cleanRelease({
      ...it.data(),
      id: it.id,
      ref: it.ref.toString(),
    }));
  } catch (e) {
    console.error(e);
    return []
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

export function calculatePageTitle(pageContent: PageContent, projectConfig: ProjectConfig, repo: string): string {
  // Choose the page name depending on available info:
  // Option 0 - title of the header section
  // Option 1 - the name from the config.
  // Option 2 - the repo name
  if (pageContent.header.name) {
      return pageContent.header.name
  } else if (projectConfig.name) {
      return projectConfig.name
  } else {
      return repo
  }
}

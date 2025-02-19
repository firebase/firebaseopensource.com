import { collection, getDocs } from 'firebase/firestore/lite'
import { firestore } from './utils/db'

/**
 * Converts an id into a path.
 */
function getPath(id: string) {
  return id.replace(/::/g, '/').replace('.md', '')
}

/**
 * Gets all routes for the website for generating the sitemap.xml
 */
export default async function () {
  // don't load routes if not in production
  if (process.env.NODE_ENV !== 'production') {
    return []
  }
  console.info('ℹ️ Getting all routes for sitemap & prerendering...')
  // Firebase has to be instantiated here additionally to @nuxtjs/firebase,
  // because at this point we cannot access this.$fireDb yet.

  const pages = [
    '/',
    '/platform/ios',
    '/platform/android',
    '/platform/web',
    '/platform/games',
    '/platform/admin',
  ]

  const ref = collection(firestore, 'content')

  let snapshot
  try {
    snapshot = await getDocs(ref)
  }
  catch (e) {
    console.error(e)
    throw new Error('Could not load routes for sitemap.xml')
  }

  await Promise.all(snapshot.docs.map(async (snapshot) => {
    const repoPath = `/projects/${getPath(snapshot.id)}`
    pages.push(repoPath)
    const subpagesRef = collection(snapshot.ref, 'pages')
    try {
      const subpages = await getDocs(subpagesRef)
      for (const subpage of subpages.docs) {
        pages.push(`${repoPath}/${getPath(subpage.id)}`)
      }
    }
    catch (e) {
      console.error(e)
      throw new Error('Could not load routes for sitemap.xml')
    }
  }))

  console.info('ℹ️ Done getting routes.')
  console.info('Rendering the following pages: ')
  for (const page of pages) {
    console.info('  - ' + page)
  }

  return pages
}

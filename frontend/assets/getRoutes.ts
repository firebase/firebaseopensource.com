
import firebase from 'firebase/app'
import 'firebase/firestore'
import { queryFirestore } from 'firewings'
import firebaseConfig from '../../shared/firebaseConfig'

/**
 * Converts an id into a path.
 */
function getPath (id: string) {
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
  if (!firebase.apps.length) {
    const config = firebaseConfig
    firebase.initializeApp(config)
  }
  const fireStore = firebase.firestore()

  const pages = [
    '/',
    'platform/ios',
    'platform/android',
    'platform/web',
    'platform/games',
    'platform/admin'
  ]

  const ref = fireStore.collection('content')

  let content
  try {
    content = await queryFirestore(ref)
  } catch (e) {
    console.error(e)
    throw new Error('Could not load routes for sitemap.xml')
  }

  // Add project links
  for (const page of content) {
    const repoPath = `projects/${getPath(page.id)}`
    pages.push(repoPath)
    const subpagesRef = fireStore.doc(page.path).collection('pages')
    try {
      const subpages = await queryFirestore(subpagesRef)
      for (const subpage of subpages) {
        pages.push(`${repoPath}/${getPath(subpage.id)}`)
      }
    } catch (e) {
      console.error(e)
      throw new Error('Could not load routes for sitemap.xml')
    }
  }
  console.info('ℹ️ Done getting routes.')
  console.info('Rendering the following pages: ');
  for (const page of pages) {
    console.info('  - ' + page);
  }

  return pages
}

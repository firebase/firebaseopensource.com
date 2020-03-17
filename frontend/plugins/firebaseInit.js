import { _setupFirestore } from '~/assets/dbUtils'

/**
 * The @nuxtjs/firebase plugin ini app.$fireStore before this plugin is called.
 * In this plugin, we simply setupFirestore in the dbUtils.ts helper, by passing the
 * Firestoe instance via this method.
 */
export default ({ app }) => {
  _setupFirestore(app.$fireStore)
}

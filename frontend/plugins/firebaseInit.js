import { _setupFirestore } from '~/assets/firebaseUtils'

export default ({ app }) => {
  _setupFirestore(app.$fireStore)
}

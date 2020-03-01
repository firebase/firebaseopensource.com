import { _setupFirestore } from '@/assets/js/firebaseUtils'

export default ({ app }) => {
  _setupFirestore(app.$fireStore)
}

import { _setupFirestore } from '~/assets/dbUtils'

export default ({ app }) => {
  _setupFirestore(app.$fireStore)
}

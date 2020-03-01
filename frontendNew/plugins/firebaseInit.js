import { _setupFirestore } from '@/assets/js/firebaseUtils'

export default ({ app }) => {
  console.log('JHIER')
  _setupFirestore(app.$fireStore)
}

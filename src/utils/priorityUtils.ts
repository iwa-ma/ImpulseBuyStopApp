import { Alert } from 'react-native'
import { db, auth } from 'config'
import { FirebaseError } from 'firebase/app'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { type priorityType } from 'types/priorityType'

/** 優先度タイプの更新関数の型定義 */
type PriorityTypeSetter = (types: priorityType[]) => void

/** 優先度タイプを取得する関数 */
export async function getPriorityType(setPriorityType: PriorityTypeSetter): Promise<void> {
  if (!auth.currentUser) return

  try {
    const ref = collection(db, 'priorityType')
    const q = query(ref, where('disabled', '==', false))
    const querySnapshot = await getDocs(q)

    const priorityTypes = querySnapshot.docs
      .map(doc => {
        const { name, disabled, id } = doc.data()
        return !disabled ? { id, name } : null
      })
      .filter((item): item is priorityType => item !== null)

    setPriorityType(priorityTypes)
  } catch (error) {
    console.error('Priority type fetch error:', error)
    const message = error instanceof FirebaseError
      ? error.message
      : String(error)
    Alert.alert('優先度の取得に失敗しました', message)
  }
}

/** 優先度コードから優先度名を取得する関数 */
export function getPriorityName(priorityTypes: priorityType[], id: number): string {
  if (!priorityTypes.length) return ''

  const priority = priorityTypes.find(type => type.id === id)
  return priority?.name ?? ''
}

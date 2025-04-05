import { Alert } from 'react-native'
import { type Dispatch } from 'react'
import { auth, db } from 'config'
import { doc, setDoc, Timestamp, deleteDoc, getDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { deleteUser } from 'firebase/auth'
import { useUnsubscribe } from 'app/UnsubscribeContext'
import { DeleteUsers } from 'types/deleteUsers'
import Button from 'components/Button'

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** ダイアログ表示制御 */
  setDialogVisible: Dispatch<React.SetStateAction<boolean>>
}

/**
 * 退会ボタン押下時の処理
 *
 * @param props ダイアログ表示制御
 * @returns {JSX.Element}
 */
const ButtonCancelMembershipSending = (props: Props): JSX.Element => {
  const { setDialogVisible } = props
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()

  /** 削除ユーザー履歴の登録 */
  const regCancelMember = async (): Promise<void> => {
    if (!auth.currentUser?.email) return

    const data: DeleteUsers = {
      UID: auth.currentUser.uid,
      id: auth.currentUser.email,
      createdAt: Timestamp.fromDate(new Date())
    }

    try {
      const ref = doc(db, `deleteUsers/${auth.currentUser.uid}`)
      await setDoc(ref, data)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

  /**ユーザー削除処理 */
  const handleDeleteUser = async (): Promise<void> => {
    if (!auth.currentUser) return

    try {
      await deleteUser(auth.currentUser)
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (auth.currentUser) {
          try {
            // 削除処理に失敗した場合、ログイン中ユーザーのuidを指定して削除ユーザー履歴を削除
            await deleteDoc(doc(db, 'deleteUsers', auth.currentUser.uid))
          } catch (deleteError) {
            Alert.alert('予期せぬエラーが発生しました\n' + deleteError)
          }
        }

        if (error.message === 'auth/requires-recent-login') {
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

  // 退会処理送信
  const handleCancelMemberSending = async () => {
    if (!auth.currentUser) return

    try {
      // 削除ユーザー履歴登録処理
      await regCancelMember()
      const docRef = doc(db, 'deleteUsers', auth.currentUser.uid)
      const result = await getDoc(docRef)
      // 削除ユーザー履歴の登録実行※削除ユーザー履歴が登録されていない場合は実行しない
      // 削除ユーザー履歴登録失敗のエラーはregCancelMember()関数が表示
      if (result.exists()) {
        if (unsubscribe) unsubscribe()
        await handleDeleteUser()
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

  return (
    <Button
      label="はい"
      disabled={false}
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: 1
      }}
      onPress={handleCancelMemberSending}
    />
  )
}

export default ButtonCancelMembershipSending

import { Alert } from 'react-native'
import { type Dispatch } from 'react'
import { auth } from 'config'
import { verifyBeforeUpdateEmail, sendPasswordResetEmail } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { modalModeType } from 'types/accountSettingModalMode'
import Button from 'components/Button'

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  modalMode: modalModeType
  /** メールアドレス入力値 */
  emailInput: string,
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

/**
 * メール送信ボタン押下時の処理
 *
 * @param props メール送信ボタン押下時の処理
 * @returns {JSX.Element}
 */
const ButtonEmailSending = (props: Props):JSX.Element => {
  const { modalMode, emailInput, setDialogVisible } = props

  // パスワード再設定メール送信処理
  const handlePasswordEmailSending = async (email: string): Promise<void> => {
    if (!email) return

    try {
      await sendPasswordResetEmail(auth, email)
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('無効なメールアドレスが入力されました')
          return
        }
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

   // 登録メールアドレス変更送信処理
  const handleEmailSending = async (email: string): Promise<void> => {
    // 未ログインまたは、新しいメールアドレスが未入力の場合、以降の処理を実行しない
    if (!auth.currentUser || email === ''){ return }

    try {
      await verifyBeforeUpdateEmail(auth.currentUser, email)
      // 送信成功後、完了ダイアログを表示
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-new-email') {
          Alert.alert('無効なメールアドレスが入力されました')
          return
        }
        if (error.code === 'auth/requires-recent-login') {
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

  const handlePress = () => {
    if (modalMode === 'eMail') {
      handleEmailSending(emailInput)
    } else {
      handlePasswordEmailSending(emailInput)
    }
  }

  const isDisabled = emailInput.length === 0

  return (
    <Button
      label="送信"
      disabled={isDisabled}
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: emailInput.length === 0 ? 0.7 : 1
      }}
      onPress={handlePress}
    />
  )
}

export default ButtonEmailSending

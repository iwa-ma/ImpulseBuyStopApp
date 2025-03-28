import { Alert } from 'react-native'
import Button from '../Button'
import { auth } from '../../config'
import { verifyBeforeUpdateEmail,sendPasswordResetEmail }from 'firebase/auth'
import { type Dispatch} from 'react'
import { modalModeType } from '../../../types/accountSettingModalMode'
import { FirebaseError } from 'firebase/app'

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
  const { modalMode,emailInput, setDialogVisible } = props

  const handlePress = () => {
    if (modalMode === 'eMail') {
      handleEmailSending(emailInput)
    } else {
      handlePassWordEmailSending(emailInput)
    }
  }

  // パスワード再設定メール送信処理
  const handlePassWordEmailSending = async (email: string): Promise<void> => {
    // メールアドレスが未入力の場合、以降の処理を実行しない
    if (email === ''){ return }

    try {
      await sendPasswordResetEmail(auth, email)
      // 送信成功後、完了ダイアログを表示
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { code, message }: { code: string, message: string } = error

        // 無効なメールアドレス指定時
        if(code === 'auth/invalid-email' ){
          Alert.alert('無効なメールアドレスが入力されました')
          return
        }

        // 登録メールアドレス変更失敗でアラートを画面に表示
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  // 登録メールアドレス変更送信処理
  const handleEmailSending = async (email: string): Promise<void> => {
    // 未ログインまたは、新しいメールアドレスが未入力の場合、以降の処理を実行しない
    if (!auth.currentUser || email === ''){ return }

    try {
      // 確認メール送信
      await verifyBeforeUpdateEmail(auth.currentUser, email)
      // 送信成功後、完了ダイアログを表示
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { code, message }: { code: string, message: string } = error
        // 無効なメールアドレス指定時
        if(code === 'auth/invalid-new-email' ){
          Alert.alert('無効なメールアドレスが入力されました')
          return
        }

        // 最後にログインから長期間経過
        if(code === 'auth/requires-recent-login' ){
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }

        // 登録メールアドレス変更失敗でアラートを画面に表示
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  return (
    <Button
      label='送信'
      disabled={ emailInput.length === 0 ? true : false }
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: emailInput.length === 0 ? 0.7 : 1
      }}
      onPress={() => {handlePress()}}
    />
  )
}

export default ButtonEmailSending

import { Alert } from 'react-native'
import Button from '../Button'
import { auth } from '../../config'
import { verifyBeforeUpdateEmail }from 'firebase/auth'
import { type Dispatch} from 'react'

interface Props {
  /** メールアドレス入力値 */
  emailInput: string,
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

const ButtonEmailSending = (props: Props):JSX.Element => {
  const { emailInput, setDialogVisible } = props

  // 登録メールアドレス変更送信処理
  const handleEmailSending = (email: string):void => {
    // 未ログインまたは、新しいメールアドレスが未入力の場合、以降の処理を実行しない
    if (!auth.currentUser || email === ''){ return }

    // 確認メールの言語設定を日本語に変更
    auth.languageCode = 'ja'

    // 確認メール送信
    verifyBeforeUpdateEmail(auth.currentUser, email).then(() => {
        // 送信成功後、完了ダイアログを表示
        setDialogVisible(true)
      }).catch((error) => {
        const { code, message }: { code: string, message: string } = error
        //  無効なメールアドレス指定時
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
      }
    )
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
      onPress={() => {
      handleEmailSending(emailInput)
      }}
    />
  )
}

export default ButtonEmailSending

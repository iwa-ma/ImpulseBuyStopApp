import {
  View,StyleSheet, Text,Modal, Alert
 } from 'react-native'
import { type Dispatch,useState, useEffect} from 'react'
import { auth } from '../config'
import { verifyBeforeUpdateEmail, signOut }from 'firebase/auth'
import Button from './Button'
import Dialog from "react-native-dialog"
import { router } from 'expo-router'
import { useUnsubscribe } from '../app/UnsubscribeContext'
import { modalModeType } from '../app/auth/accountSetting'
import  TextInputEmail  from './AccountSetting/TextInputEmail'

interface Props {
  /** モーダル開閉状態(真の時開く) */
  modalVisible: boolean,
  /** モーダル開閉状態変更用関数 */
  setModalVisible: Dispatch<React.SetStateAction<boolean>>
  /** モーダルの表示情報種別 */
  modalMode: modalModeType
}

const accountSettingModal = (props: Props):JSX.Element => {
  // モーダル開閉制御
  const { modalVisible, setModalVisible, modalMode } = props
  // メールアドレス入力制御
  const [ emailInput, setInputEmail ] = useState('')
  // ダイアログ表示制御
  const [ dialogVisible, setDialogVisible ] = useState(false)
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()

  // モーダルタイトル
  const [ modalTitle, setModalTitle ] = useState('')
  const [ modalText, setModalText ] = useState('')

  function modalInit():void {
    // タイトル、説明文設定
    if ( modalMode == 'eMail' ){
      setModalTitle('登録メールアドレス変更')
      setModalText('変更すると新しいメールアドレスに確認メールが送信されます。')
    }

    if ( modalMode == 'passWord' ){
      setModalTitle('パスワード変更')
      setModalText('パスワードは半角英数字記号8文字以上入力して下さい。')
    }
    if ( modalMode == 'cancelMembership' ){ setModalTitle('退会')}
  }


  // サインアウト処理
  const handleSignOut = (): void => {
    signOut(auth)
      .then(() => {
        if (unsubscribe) unsubscribe()
        // モーダルを閉じる、スタック(リスト画面 → アカウント設定画面へ遷移履歴)を削除
        router.dismissAll()
        // ログイン画面に書き換え
        router.replace('/auth/log_in')
      }).
      catch(() => {
        Alert.alert('ログアウトに失敗しました')
      })
  }

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

  useEffect( () => {
    setModalVisible(props.modalVisible)
    // モーダルの状態が変わる時は、毎回Emailアドレスを初期化する
    setInputEmail('')
  },[props.modalVisible])

  // モーダル種別の変更を検知して初期化処理実行
  useEffect( () => {
    modalInit()
  },[modalMode])

  return (
    <Modal
      visible={modalVisible}
      transparent={true} //背景透明に
    >
      {/* 確認メール送信完了ダイアログ */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>確認メールを送信しました。</Dialog.Title>
        <Dialog.Description>
          確認メールから確認処理を行う事で、設定変更が完了します。
        </Dialog.Description>
        <Dialog.Button label="OK"
          onPress={()=> { handleSignOut()}
          } />
      </Dialog.Container>

      {/* モーダル背景 */}
      <View style={styles.modalContainer}>
        {/* UI表示部分 */}
        <View style={{
            height:300,
            backgroundColor:'white',
            paddingVertical: 14,
            paddingHorizontal: 14
          }
        }>
          {/* モーダルタイトル */}
          <Text style={styles.modalTitleFontType}>{ modalTitle }</Text>

          {/* モーダル説明テキスト */}
          <Text style={styles.modalContentsFontType}>{ modalText }</Text>

          {/* メールアドレス入力欄(登録メールアドレス変更時に表示) */}
          { modalMode == 'eMail' &&
            <TextInputEmail emailInput={emailInput} setInputEmail={setInputEmail}  />
          }

          <View style={styles.modalButtonWrap}>
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
            }}/>
            <Button
              label='キャンセル'
              buttonStyle={{
                backgroundColor: '#FF6633'
              }}
              onPress={() => {
                setModalVisible(false)
              }}/>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000080',
    opacity: 1
  },
  modalTitleFontType: {
    paddingBottom: 14,
    textAlign:'center',
    fontSize: 28,
    fontWeight: 'normal',
    fontFamily: 'Meiryo'
  },
  modalContentsFontType:{
    paddingBottom: 14,
    fontSize: 19,
    fontWeight: 'normal',
    backgroundColor:'white'
  },
  modalTextWrap:{
    flex: 1/3,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  modalButtonWrap: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  }
})

export default accountSettingModal

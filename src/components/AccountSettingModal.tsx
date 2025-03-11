import {
  View,StyleSheet, Text,
  Modal, TextInput, Alert
 } from 'react-native'
import { type Dispatch,useState, useEffect} from 'react'
import { auth } from '../config'
import { verifyBeforeUpdateEmail, signOut }from 'firebase/auth'
import Button from './Button'
import Dialog from "react-native-dialog"
import { router } from 'expo-router'
import { useUnsubscribe } from '../app/UnsubscribeContext'
interface Props {
  /** モーダル開閉状態(真の時開く) */
  modalVisible: boolean,
  /** モーダル開閉状態変更用関数 */
  setModalVisible: Dispatch<React.SetStateAction<boolean>>
}

const accountSettingModal = (props: Props):JSX.Element => {
  // モーダル開閉制御
  const { modalVisible, setModalVisible } = props
  // メールアドレス入力制御
  const [ emailInput, setInputEmail ] = useState('')
  // ダイアログ表示制御
  const [ dialogVisible, setDialogVisible ] = useState(false)
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()

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

  const handleSendingButton = (email: string):void => {
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

  useEffect( () => {
    console.log('accountSettingModal emailInput:'+emailInput)
  },[emailInput])

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
          <Text style={styles.modalTitleFontType}>登録メールアドレス変更</Text>

          <Text style={styles.modalContentsFontType}>変更すると新しいメールアドレスに確認メールが送信されます。</Text>

          <TextInput
            style={styles.modalInput}
            value={emailInput}
            onChangeText={(text) => {setInputEmail(text)}}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='Email Address'
            textContentType='emailAddress'
          />

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
                handleSendingButton(emailInput)
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
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 24
  }
})

export default accountSettingModal

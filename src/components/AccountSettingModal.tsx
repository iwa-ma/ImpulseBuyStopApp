import { View, StyleSheet, Text, Modal, Alert } from 'react-native'
import { type Dispatch,useState, useEffect} from 'react'
import { auth } from '../config'
import { signOut }from 'firebase/auth'
import Button from './Button'
import Dialog from "react-native-dialog"
import { router } from 'expo-router'
import { useUnsubscribe } from '../app/UnsubscribeContext'
import { modalModeType } from '../app/auth/accountSetting'
import TextInputEmail from './AccountSetting/TextInputEmail'
import TextInputPassWord from './AccountSetting/TextInputPassWord'
import ButtonEmailSending from './AccountSetting/ButtonEmailSending'
import ButtonPasswordSending from './AccountSetting/ButtonPasswordSending'

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
  // パスワード入力制御
  const [ passWordInput, setPassWordInput ] = useState({
    actve: '',
    new: '',
    confirm: ''
  })

  // ダイアログ表示制御
  const [ dialogVisible, setDialogVisible ] = useState(false)
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()

  // モーダルタイトル
  const [ modalTitle, setModalTitle ] = useState('')
  // モーダルテキスト
  const [ modalText, setModalText ] = useState('')

  // ダイアログタイトル
  const [ dialogTitle, setDialogTitle ] = useState('')
  // ダイアログテキスト
  const [ dialogText, setDialogText ] = useState('')

  function modalInit():void {
    // タイトル、説明文設定
    if ( modalMode == 'eMail' ){
      setModalTitle('登録メールアドレス変更')
      setModalText('変更すると新しいメールアドレスに確認メールが送信されます。')
      setDialogTitle('確認メールを送信しました。')
      setDialogText('確認メールから確認処理を行う事で、設定変更が完了します。')
    }

    if ( modalMode == 'passWord' ){
      setModalTitle('パスワード変更')
      setModalText('パスワードは半角英数字記号6文字以上入力して下さい。')
      setDialogTitle('パスワード変更が完了しました。')
      setDialogText('新しいパスワードで再ログインして下さい。')
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

  useEffect( () => {
    setModalVisible(props.modalVisible)
    // モーダルの状態が変わる時は、毎回Emailアドレスを初期化する
    setInputEmail('')

    // モーダルの状態が変わる時は、毎回パスワード入力値を初期化する
    setPassWordInput({ ...passWordInput, actve: '', new: '', confirm:'' })
  },[props.modalVisible])

  // モーダル種別の変更を検知して初期化処理実行
  useEffect( () => {
    modalInit()
  },[modalMode])

  // パスワード変更の入力検知
  useEffect( () => {
    console.log('passWordInput'+JSON.stringify(passWordInput))
  },[passWordInput])

  return (
    <Modal
      visible={modalVisible}
      transparent={true} //背景透明に
    >
      {/* 完了ダイアログ */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>{dialogTitle}</Dialog.Title>
        <Dialog.Description>{dialogText}</Dialog.Description>
        <Dialog.Button label="OK"
          onPress={()=> { handleSignOut()}
          } />
      </Dialog.Container>

      {/* モーダル背景 */}
      <View style={styles.modalContainer}>
        {/* UI表示部分 モーダル種別を基に高さを変更する */}
        <View style={{
            height: (modalMode == 'passWord' ? 450: 300),
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

          {/* パスワード入力欄(パスワード変更時に表示) */}
          { modalMode == 'passWord' &&
            <TextInputPassWord passWordInput={passWordInput} setPassWordInput={setPassWordInput} />
          }

          <View style={styles.modalButtonWrap}>
            {/* 送信ボタン（登録メールアドレス変更） */}
            { modalMode == 'eMail' &&
              <ButtonEmailSending emailInput={emailInput} setDialogVisible={setDialogVisible} />
            }

            {/* 送信ボタン（パスワード変更） */}
            { modalMode == 'passWord' &&
              <ButtonPasswordSending passWordInput={passWordInput} setDialogVisible={setDialogVisible} />
            }

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

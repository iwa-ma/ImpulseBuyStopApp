import { View, StyleSheet, Text, Modal, Alert } from 'react-native'
import Dialog from "react-native-dialog"
import { useReducer, useEffect, type Dispatch } from 'react'
import { auth } from 'config'
import { FirebaseError } from 'firebase/app'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { useUnsubscribe } from 'app/UnsubscribeContext'
import { EditPassWordType } from 'types/editPassWordType'
import { modalModeType } from 'types/accountSettingModalMode'
import Button from 'components/Button'
import TextInputEmail from 'components/AccountSetting/TextInputEmail'
import TextInputPassWord from 'components/AccountSetting/TextInputPassWord'
import ButtonEmailSending from 'components/AccountSetting/ButtonEmailSending'
import ButtonPasswordSending from 'components/AccountSetting/ButtonPasswordSending'
import ButtonCancelMembershipSending from 'components/AccountSetting/ButtonCancelMembershipSending'

// スタイル定数
const STYLES = {
  modal: {
    container: {
      flex: 1,
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
      backgroundColor: '#00000080',
      opacity: 1
    },
    content: {
      backgroundColor: 'white',
      paddingVertical: 14,
      paddingHorizontal: 14
    },
    title: {
      paddingBottom: 10,
      textAlign: 'center' as const,
      fontSize: 28,
      fontWeight: 'normal' as const,
      fontFamily: 'Meiryo'
    },
    text: {
      paddingBottom: 10,
      fontSize: 19,
      fontWeight: 'normal' as const,
      backgroundColor: 'white',
      lineHeight: 38
    },
    buttonWrap: {
      flexDirection: 'row' as const,
      marginLeft: 'auto' as const,
      marginRight: 'auto' as const,
      marginTop: 'auto' as const,
      marginBottom: 'auto' as const
    }
  }
}

/** モーダルの状態管理 */
type ModalState = {
  /** メールアドレス入力値 */
  emailInput: string
  /** パスワード入力値 */
  passWordInput: EditPassWordType
  /** 完了ダイアログ表示状態 */
  dialogVisible: boolean
  /** モーダルタイトル */
  modalTitle: string
  /** モーダル説明テキスト */
  modalText: string
  /** 完了ダイアログタイトル */
  dialogTitle: string
  /** 完了ダイアログ説明テキスト */
  dialogText: string
}

/** モーダルの状態変更 */
type ModalAction =
  | { type: 'SET_EMAIL_INPUT'; payload: string }
  | { type: 'SET_PASSWORD_INPUT'; payload: EditPassWordType }
  | { type: 'SET_DIALOG_VISIBLE'; payload: boolean }
  | { type: 'SET_MODAL_TITLE'; payload: string }
  | { type: 'SET_MODAL_TEXT'; payload: string }
  | { type: 'SET_DIALOG_TITLE'; payload: string }
  | { type: 'SET_DIALOG_TEXT'; payload: string }
  | { type: 'INITIALIZE_MODAL'; payload: modalModeType }

/** モーダルの初期状態 */
const initialState: ModalState = {
  emailInput: '',
  passWordInput: { new: '', confirm: '' },
  dialogVisible: false,
  modalTitle: '',
  modalText: '',
  dialogTitle: '',
  dialogText: ''
}

/** モーダルの状態変更リデューサー  */
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'SET_EMAIL_INPUT':
      return { ...state, emailInput: action.payload }
    case 'SET_PASSWORD_INPUT':
      return { ...state, passWordInput: action.payload }
    case 'SET_DIALOG_VISIBLE':
      return { ...state, dialogVisible: action.payload }
    case 'SET_MODAL_TITLE':
      return { ...state, modalTitle: action.payload }
    case 'SET_MODAL_TEXT':
      return { ...state, modalText: action.payload }
    case 'SET_DIALOG_TITLE':
      return { ...state, dialogTitle: action.payload }
    case 'SET_DIALOG_TEXT':
      return { ...state, dialogText: action.payload }
    case 'INITIALIZE_MODAL': {
      const mode = action.payload
      const modalConfigs = {
        eMail: {
          modalTitle: '登録メールアドレス変更',
          modalText: '変更すると新しいメールアドレスに確認メールが送信されます。',
          dialogTitle: '確認メールを送信しました。',
          dialogText: '確認メールから確認処理を行う事で、設定変更が完了します。'
        },
        passWord: {
          modalTitle: 'パスワード変更',
          modalText: 'パスワードは半角英数字記号6文字以上入力して下さい。',
          dialogTitle: 'パスワード変更が完了しました。',
          dialogText: '新しいパスワードで再ログインして下さい。'
        },
        passWordReset: {
          modalTitle: 'パスワード再設定',
          modalText: 'パスワード変更画面のURLをメールでお送りいたします。\nご登録されているメールアドレスを入力して送信してください。',
          dialogTitle: 'URLの送信が完了しました。',
          dialogText: 'メールに送らせて頂いたURLから再設定を行って下さい。'
        },
        cancelMembership: {
          modalTitle: '退会',
          modalText: '退会すると登録データが消去されます。\nよろしいですか？',
          dialogTitle: '退会処理が完了しました。',
          dialogText: 'またのご利用よろしくお願いいたします。'
        }
      } as const
      return { ...state, ...modalConfigs[mode as keyof typeof modalConfigs] }
    }
    default:
      return state
  }
}

/** accountSetting.tsxから受け取るprops型を定義 */
interface Props {
  /** モーダル開閉状態(真の時開く) */
  modalVisible: boolean,
  /** モーダル開閉状態変更用関数 */
  setModalVisible: Dispatch<React.SetStateAction<boolean>>
  /** モーダルの表示情報種別 */
  modalMode: modalModeType
}

/**
 * アカウント設定モーダル
 *
 * @param props
 * @returns {JSX.Element}
 */
const AccountSettingModal = (props: Props):JSX.Element => {
  // モーダル開閉制御
  const { modalVisible, setModalVisible, modalMode } = props
  // モーダルの状態管理
  const [state, dispatch] = useReducer(modalReducer, initialState)
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()

  // 完了ダイアログでOKボタンタッチ処理
  const onPressDialog = (): void => {
    // パスワード再設定の場合は、サインアウトを実行せずに、ダイアログとモーダルを閉じる
    if(modalMode == 'passWordReset') {
      dispatch({ type: 'SET_DIALOG_VISIBLE', payload: false })
      setModalVisible(false)
      return
    }else{
      handleSignOut()
    }
  }

  // サインアウト処理
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth)
      if (unsubscribe) unsubscribe()
      // モーダルを閉じる、スタック(リスト画面 → アカウント設定画面へ遷移履歴)を削除
      router.dismissAll()
      // ログイン画面に書き換え
      router.replace('/auth/log-in')
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { message }: { message: string } = error
        Alert.alert(message)
      } else {
        Alert.alert('ログアウトに失敗しました\n'+error)
      }
    }
  }

  useEffect(() => {
    setModalVisible(props.modalVisible)
    // モーダルの状態が変わる時は、毎回Emailアドレスを初期化する
    dispatch({ type: 'SET_EMAIL_INPUT', payload: '' })
    // モーダルの状態が変わる時は、毎回パスワード入力値を初期化する
    dispatch({ type: 'SET_PASSWORD_INPUT', payload: { new: '', confirm: '' } })
  }, [props.modalVisible])

  // モーダル種別の変更を検知して初期化処理実行
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_MODAL', payload: modalMode })
  }, [modalMode])

  const modalHeight = (modalMode === 'passWord' || modalMode === 'passWordReset') ? 415 : 300
  const modalMarginBottom = (modalMode === 'passWord' || modalMode === 'passWordReset') ? 200 : 300

  return (
    <Modal
      visible={modalVisible}
      transparent={true} //背景透明に
    >
      {/* 完了ダイアログ */}
      <Dialog.Container visible={state.dialogVisible}>
        <Dialog.Title>{state.dialogTitle}</Dialog.Title>
        <Dialog.Description>{state.dialogText}</Dialog.Description>
        <Dialog.Button label="OK"
          onPress={()=> { onPressDialog()}
          } />
      </Dialog.Container>

      {/* モーダル背景 */}
      <View style={styles.modalContainer}>
        {/* UI表示部分 モーダル種別を基に高さを変更する */}
        <View style={[styles.modalContent, { height: modalHeight, marginBottom: modalMarginBottom }]}>
          {/* モーダルタイトル */}
          <Text style={styles.modalTitle}>{state.modalTitle}</Text>

          {/* モーダル説明テキスト */}
          <Text style={styles.modalText}>{state.modalText}</Text>

          {/* メールアドレス入力欄(登録メールアドレス変更時に表示) */}
          { (modalMode == 'eMail' || modalMode == 'passWordReset') &&
            <TextInputEmail
              emailInput={state.emailInput}
              setInputEmail={(value: string | ((prevState: string) => string)) => {
                const newValue = typeof value === 'function' ? value(state.emailInput) : value
                dispatch({ type: 'SET_EMAIL_INPUT', payload: newValue })
              }}
            />
          }

          {/* パスワード入力欄(パスワード変更時に表示) */}
          { modalMode == 'passWord' &&
            <TextInputPassWord
              passWordInput={state.passWordInput}
              setPassWordInput={(value: EditPassWordType | ((prevState: EditPassWordType) => EditPassWordType)) => {
                const newValue = typeof value === 'function' ? value(state.passWordInput) : value
                dispatch({ type: 'SET_PASSWORD_INPUT', payload: newValue })
              }}
            />
          }

          <View style={styles.modalButtonWrap}>
            {/* 送信ボタン（登録メールアドレス変更、パスワード再設定） */}
            { (modalMode == 'eMail' || modalMode == 'passWordReset') &&
              <ButtonEmailSending
                modalMode={modalMode}
                emailInput={state.emailInput}
                setDialogVisible={(value: boolean | ((prevState: boolean) => boolean)) => {
                  const newValue = typeof value === 'function' ? value(state.dialogVisible) : value
                  dispatch({ type: 'SET_DIALOG_VISIBLE', payload: newValue })
                }}
              />
            }

            {/* 送信ボタン（パスワード変更） */}
            { modalMode == 'passWord' &&
              <ButtonPasswordSending
                passWordInput={state.passWordInput}
                setDialogVisible={(value: boolean | ((prevState: boolean) => boolean)) => {
                  const newValue = typeof value === 'function' ? value(state.dialogVisible) : value
                  dispatch({ type: 'SET_DIALOG_VISIBLE', payload: newValue })
                }}
              />
            }

            {/* はいボタン（退会） */}
            { modalMode == 'cancelMembership' &&
              <ButtonCancelMembershipSending
                setDialogVisible={(value: boolean | ((prevState: boolean) => boolean)) => {
                  const newValue = typeof value === 'function' ? value(state.dialogVisible) : value
                  dispatch({ type: 'SET_DIALOG_VISIBLE', payload: newValue })
                }}
              />
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
  modalContainer: STYLES.modal.container,
  modalContent: STYLES.modal.content,
  modalTitle: STYLES.modal.title,
  modalText: STYLES.modal.text,
  modalButtonWrap: STYLES.modal.buttonWrap
})

export default AccountSettingModal

import {
  View, Text, TextInput, Alert,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { Link, router } from 'expo-router'
import { useReducer } from 'react'
import { auth } from 'config'
import { signInWithEmailAndPassword, getAuth, signInAnonymously } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import CustomIcon from 'components/icon'
import Button from 'components/Button'
import AccountSettingModal from 'components/AccountSettingModal'

/** ログイン画面の状態 */
type LoginState = {
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** パスワード表示状態 */
  isSecure: boolean
  /** パスワード再設定モーダル表示状態 */
  modalVisible: boolean
}

/** ログイン画面のアクション */
type LoginAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_MODAL_VISIBLE'; payload: boolean }
  | { type: 'TOGGLE_SECURE' }

/** ログイン画面の初期状態 */
const initialState: LoginState = {
  email: '',
  password: '',
  modalVisible: false,
  isSecure: true
}

/** ログイン画面のリデューサー */
const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'SET_MODAL_VISIBLE':
      return { ...state, modalVisible: action.payload }
    case 'TOGGLE_SECURE':
      return { ...state, isSecure: !state.isSecure }
    default:
      return state
  }
}

/**
 * ログインボタンクリック動作
 *
 * @param email
 * @param password
 */
const handleSubmitPress = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.emailVerified) {
      Alert.alert('メールアドレスが確認されていません。有効期限が切れている場合は、再登録して下さい。')
      return
    }

    // ログイン成功時はリスト画面に遷移
    router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'false' }})
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code } = error

      switch (code) {
        case 'auth/user-not-found':
          Alert.alert('メールアドレスまたはパスワードが違います')
          break
        case 'auth/too-many-requests':
          Alert.alert('ログイン試行回数が多すぎます。しばらく時間をおいて再度お試しください。')
          break
        case 'auth/network-request-failed':
          Alert.alert('ネットワークエラーが発生しました。インターネット接続を確認してください。')
          break
        default:
          Alert.alert('ログインに失敗しました')
      }
    } else {
      Alert.alert('予期せぬエラーが発生しました')
    }
  }
}

/** お試し体験モードリンククリック動作 */
const handleAnonymously = async (): Promise<void> => {
  const auth = getAuth()
  try {
    const userCredential = await signInAnonymously(auth)
    if(userCredential.user.uid){
      // ログイン処理に成功でリスト画面に書き換え、anonymousパラメーターに'true'を設定
      router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'true' }})
    }else{
      Alert.alert('ログインに失敗しました')
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code, message } = error
      if(code === 'auth/operation-not-allowed'){
        Alert.alert('ログインに失敗しました')
      }else{
        // ログイン失敗でアラートを画面に表示
        Alert.alert(message)
      }
    } else {
      Alert.alert('予期せぬエラーが発生しました\n'+error)
    }
  }
}

/**
 * ログイン画面
 *
 * @returns {JSX.Element}
 */
const LogIn = (): JSX.Element => {
  const [state, dispatch] = useReducer(loginReducer, initialState)

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={state.email}
            onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='メールアドレスを入力してください'
            textContentType='emailAddress'
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={state.password}
            onChangeText={(text) => dispatch({ type: 'SET_PASSWORD', payload: text })}
            autoCapitalize='none'
            secureTextEntry={state.isSecure}
            placeholder='パスワードを入力してください'
            textContentType='password'
          />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => dispatch({ type: 'TOGGLE_SECURE' })}
          >
            <CustomIcon
              name={state.isSecure ? 'eye' : 'eye-blocked'}
              size={24}
              color='#000000'
            />
          </TouchableOpacity>
        </View>

        <Button label='ログイン'
          disabled={state.email === '' || state.password === ''}
          buttonStyle={{ marginBottom: 24, opacity: state.email === '' || state.password === '' ? 0.5 : 1 }}
          onPress={() => {handleSubmitPress(state.email, state.password)}}
        />
        <View>
          <Text style={styles.footerText}>未登録の場合はこちら</Text>

          <Text>
            <Link href='/auth/sign_up' asChild replace>
              <TouchableOpacity>
                  <Text style={styles.footerLink}>1.ユーザー登録する！</Text>
              </TouchableOpacity>
            </Link>
          </Text>

          <Text>
            <TouchableOpacity onPress={() => { handleAnonymously() }}>
              <Text style={styles.footerLink}>
                2.お試し体験モードで操作する！
              </Text>
            </TouchableOpacity>
          </Text>

          <Text style={styles.footerText}>パスワードを忘れてしまった方</Text>
          <Text>
            <TouchableOpacity onPress={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true })}>
              <Text style={styles.footerLink}>
                3.パスワード再設定
              </Text>
            </TouchableOpacity>
          </Text>

          {/* パスワード再設定用モーダル */}
          <AccountSettingModal
            modalVisible={state.modalVisible}
            modalMode='passWordReset'
            setModalVisible={(value: boolean | ((prevState: boolean) => boolean)) => {
              const newValue = typeof value === 'function' ? value(state.modalVisible) : value
              dispatch({ type: 'SET_MODAL_VISIBLE', payload: newValue })
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    marginBottom: 24
  },
  input: {
    flex: 1,
    height: 48,
    padding: 8,
    fontSize: 16

  },
  visibilityToggle: {
    padding: 8
  },
  footerText:{
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    color: '#000000'
  },
  footerLink:{
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3',
    paddingBottom: 32
  }
})

export default LogIn

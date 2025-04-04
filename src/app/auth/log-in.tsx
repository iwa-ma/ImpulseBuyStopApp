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

// スタイル定数
const COLORS = {
  background: '#F0F4F8',
  border: '#DDDDDD',
  white: '#FFFFFF',
  link: '#467FD3',
  black: '#000000'
}

const FONT_SIZES = {
  title: 24,
  input: 16,
  footer: 14
}

const SPACING = {
  padding: {
    vertical: 24,
    horizontal: 27
  },
  margin: {
    bottom: 24
  }
}

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

// 入力フィールドコンポーネント
const InputField = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  textContentType,
  isSecure,
  onToggleSecure
}: {
  /** 入力値 */
  value: string
  /** 入力値変更時の処理 */
  onChangeText: (text: string) => void
  /** プレースホルダー */
  placeholder: string
  /** パスワード表示状態 */
  secureTextEntry?: boolean
  /** キーボードタイプ */
  keyboardType?: 'email-address' | 'default'
  /** 自動大文字化 */
  autoCapitalize?: 'none' | 'sentences'
  /** テキストコンテンツタイプ */
  textContentType?: 'emailAddress' | 'password'
  /** パスワード表示状態 */
  isSecure?: boolean
  /** パスワード表示状態変更時の処理 */
  onToggleSecure?: () => void
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      textContentType={textContentType}
    />
    {onToggleSecure && (
      <TouchableOpacity
        style={styles.visibilityToggle}
        onPress={onToggleSecure}
      >
        <CustomIcon
          name={isSecure ? 'eye' : 'eye-blocked'}
          size={24}
          color={COLORS.black}
        />
      </TouchableOpacity>
    )}
  </View>
)

// フッターリンクコンポーネント
const FooterLink = ({ text, onPress, href }: { text: string; onPress?: () => void; href?: string }) => (
  <Text>
    {href ? (
      <Link href={href} asChild replace>
        <TouchableOpacity>
          <Text style={styles.footerLink}>{text}</Text>
        </TouchableOpacity>
      </Link>
    ) : (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.footerLink}>{text}</Text>
      </TouchableOpacity>
    )}
  </Text>
)

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

        <InputField
          value={state.email}
          onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
          placeholder="メールアドレスを入力してください"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />

        <InputField
          value={state.password}
          onChangeText={(text) => dispatch({ type: 'SET_PASSWORD', payload: text })}
          placeholder="パスワードを入力してください"
          secureTextEntry={state.isSecure}
          autoCapitalize="none"
          textContentType="password"
          isSecure={state.isSecure}
          onToggleSecure={() => dispatch({ type: 'TOGGLE_SECURE' })}
        />

        <Button
          label="ログイン"
          disabled={!state.email || !state.password}
          buttonStyle={{
            marginBottom: SPACING.margin.bottom,
            opacity: !state.email || !state.password ? 0.5 : 1
          }}
          onPress={() => handleSubmitPress(state.email, state.password)}
        />

        <View>
          <Text style={styles.footerText}>未登録の場合はこちら</Text>
          <FooterLink
            text="1.ユーザー登録する！"
            href="/auth/sign_up"
          />
          <FooterLink
            text="2.お試し体験モードで操作する！"
            onPress={handleAnonymously}
          />

          <Text style={styles.footerText}>パスワードを忘れてしまった方</Text>
          <FooterLink
            text="3.パスワード再設定"
            onPress={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true })}
          />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  inner: {
    paddingVertical: SPACING.padding.vertical,
    paddingHorizontal: SPACING.padding.horizontal
  },
  title: {
    fontSize: FONT_SIZES.title,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.margin.bottom
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.margin.bottom
  },
  input: {
    flex: 1,
    height: 48,
    padding: 8,
    fontSize: FONT_SIZES.input
  },
  visibilityToggle: {
    padding: 8
  },
  footerText: {
    fontSize: FONT_SIZES.footer,
    lineHeight: 24,
    marginRight: 8,
    color: COLORS.black
  },
  footerLink: {
    fontSize: FONT_SIZES.footer,
    lineHeight: 24,
    color: COLORS.link,
    paddingBottom: 32
  }
})

export default LogIn

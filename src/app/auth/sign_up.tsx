import {
    View, Text, TextInput, Alert,
    TouchableOpacity, StyleSheet, Modal
} from 'react-native'
import { Link, router } from 'expo-router'
import { useReducer } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { WebView } from 'react-native-webview'
import { FirebaseError } from 'firebase/app'
import { auth } from 'config'
import Button from 'components/Button'
import Checkbox from 'expo-checkbox'

/** サインアップ画面の状態 */
type SignUpState = {
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** 利用規約同意状態 */
  isAgreed: boolean
  /** 利用規約モーダル表示状態 */
  isTermsModalVisible: boolean
  /** セキュリティポリシーモーダル表示状態 */
  isSecurityModalVisible: boolean
}

/** サインアップ画面のアクション */
type SignUpAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_IS_AGREED'; payload: boolean }
  | { type: 'SET_TERMS_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_SECURITY_MODAL_VISIBLE'; payload: boolean }

/** サインアップ画面の初期状態 */
const initialState: SignUpState = {
  email: '',
  password: '',
  isAgreed: false,
  isTermsModalVisible: false,
  isSecurityModalVisible: false
}

/** サインアップ画面の状態変更リデューサー */
const signUpReducer = (state: SignUpState, action: SignUpAction): SignUpState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'SET_IS_AGREED':
      return { ...state, isAgreed: action.payload }
    case 'SET_TERMS_MODAL_VISIBLE':
      return { ...state, isTermsModalVisible: action.payload }
    case 'SET_SECURITY_MODAL_VISIBLE':
      return { ...state, isSecurityModalVisible: action.payload }
    default:
      return state
  }
}

/**
 * サインアップボタン押下時の処理
 *
 * @param email メールアドレス
 * @param password パスワード
 */
const handleSubmitPress = async (email: string, password: string): Promise<void> => {
  try {
    // 会員登録
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if(userCredential){
      const user = userCredential.user
      sendEmailVerification(user).then(() => {
        Alert.alert('確認メールを送信しました。メールを確認してください。')
        router.replace({ pathname: '/auth/log-in'})
      })
    }else{
      Alert.alert('登録に失敗しました')
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code, message } = error
      // 登録済みメールアドレスの処理
      if (code === 'auth/email-already-in-use') {
        if (!auth.currentUser) {
          Alert.alert('登録済みのメールアドレスです')
          return
        }
        // メール未確認の場合
        if (!auth.currentUser.emailVerified) {
          await sendEmailVerification(auth.currentUser)
          Alert.alert('確認メールを再送信しました。メールを確認してください。')
          router.replace({ pathname: '/auth/log-in'})
          return
        }
        // メール確認済みの場合
        Alert.alert('登録済みのメールアドレスです')
        return
      }
      // 登録に失敗でアラートを画面に表示
      Alert.alert(message)
    } else {
      Alert.alert('予期せぬエラーが発生しました\n'+error)
    }
  }
}

/**
 * サインアップ画面
 *
 * @returns {JSX.Element}
 */
const SignUp = (): JSX.Element => {
    const [state, dispatch] = useReducer(signUpReducer, initialState)

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>サインアップ</Text>
                <TextInput
                  style={styles.input}
                  value={state.email}
                  onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
                  autoCapitalize='none'
                  keyboardType='email-address'
                  placeholder='メールアドレスを入力してください'
                  textContentType='emailAddress'
                />
                <TextInput
                  style={styles.input}
                  value={state.password}
                  onChangeText={(text) => dispatch({ type: 'SET_PASSWORD', payload: text })}
                  autoCapitalize='none'
                  secureTextEntry
                  placeholder='パスワードを入力してください'
                  textContentType='password'
                />

                <View style={styles.agreementContainer}>
                    <Checkbox
                        value={state.isAgreed}
                        onValueChange={(value) => dispatch({ type: 'SET_IS_AGREED', payload: value })}
                        color={state.isAgreed ? '#467FD3' : undefined}
                    />
                    <TouchableOpacity onPress={() => dispatch({ type: 'SET_TERMS_MODAL_VISIBLE', payload: true })}>
                        <Text style={[styles.agreementText, styles.linkText]}>
                            利用規約
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch({ type: 'SET_SECURITY_MODAL_VISIBLE', payload: true })}>
                        <Text style={[styles.agreementText, styles.linkText]}>
                            セキュリティポリシー
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.agreementText}>
                        に同意する
                    </Text>
                </View>

                <Button label='サインアップ'
                  disabled={state.email === '' || state.password === '' || !state.isAgreed}
                  buttonStyle={{ marginBottom: 24, opacity: state.email === '' || state.password === '' || !state.isAgreed ? 0.5 : 1 }}
                  onPress={() => { handleSubmitPress(state.email ,state.password) }}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>すでに登録されている場合 → </Text>
                    <Link href='auth/log-in' asChild replace>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>ログイン</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.isTermsModalVisible}
                onRequestClose={() => dispatch({ type: 'SET_TERMS_MODAL_VISIBLE', payload: false })}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>利用規約</Text>
                            <TouchableOpacity
                                onPress={() => dispatch({ type: 'SET_TERMS_MODAL_VISIBLE', payload: false })}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>閉じる</Text>
                            </TouchableOpacity>
                        </View>
                        <WebView
                            source={{ uri: 'https://fishy-flame-bf2.notion.site/1c5350886e3880ec929cdd3545bf13b2' }}
                            style={styles.webview}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.isSecurityModalVisible}
                onRequestClose={() => dispatch({ type: 'SET_SECURITY_MODAL_VISIBLE', payload: false })}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>セキュリティポリシー</Text>
                            <TouchableOpacity
                                onPress={() => dispatch({ type: 'SET_SECURITY_MODAL_VISIBLE', payload: false })}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>閉じる</Text>
                            </TouchableOpacity>
                        </View>
                        <WebView
                            source={{ uri: 'https://www.notion.so/1c5350886e38806daa29e5b5b2f5262b' }}
                            style={styles.webview}
                        />
                    </View>
                </View>
            </Modal>
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
    input: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        height: 48,
        padding: 8,
        fontSize: 16,
        marginBottom: 24
    },
    footer:{
        flexDirection: 'row'
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
        color: '#467FD3'
    },
    agreementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    agreementText: {
        marginLeft: 8,
        fontSize: 14,
        lineHeight: 24,
        color: '#000000'
    },
    linkText: {
        color: '#467FD3',
        textDecorationLine: 'underline'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000'
    },
    closeButton: {
        padding: 8
    },
    closeButtonText: {
        color: '#467FD3',
        fontSize: 16
    },
    webview: {
        flex: 1
    }
})

export default SignUp

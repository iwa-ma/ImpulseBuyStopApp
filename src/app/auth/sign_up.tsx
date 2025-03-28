import {
    View, Text, TextInput, Alert,
    TouchableOpacity, StyleSheet
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '../../config'
import Button from '../../components/Button'

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
    if(userCredential.user.uid){
        // 登録に成功でリスト画面に書き換え
        router.replace('/ImpulseBuyStop/list')
    }else{
      Alert.alert('登録に失敗しました')
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code, message } = error
      // 登録済みメールアドレス
      if (code === 'auth/email-already-in-use') {
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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>サインアップ</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {setEmail(text)}}
                  autoCapitalize='none'
                  keyboardType='email-address'
                  placeholder='メールアドレスを入力してください'
                  textContentType='emailAddress'
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {setPassword(text)}}
                  autoCapitalize='none'
                  secureTextEntry
                  placeholder='パスワードを入力してください'
                  textContentType='password'
                />
                <Button label='サインアップ'
                  disabled={email === '' || password === ''}
                  buttonStyle={{ marginBottom: 24, opacity: email === '' || password === '' ? 0.5 : 1 }}
                  onPress={() => { handleSubmitPress(email ,password) }}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>すでに登録されている場合 → </Text>
                    <Link href='auth/log_in' asChild replace>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>ログイン</Text>
                        </TouchableOpacity>
                    </Link>
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
    }
})

export default SignUp

import {
    View, TextInput, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'
import { db, auth } from '../../config'

const handlePress = (bodyText: string): void => {
  // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
  if (!auth.currentUser) {return}

  const ref = collection(db, `users/${auth.currentUser.uid}/items`)

  addDoc(ref,{
    bodyText,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then((docRef) =>{
      console.log('success', docRef.id)
      router.back()
    })
    .catch((error) => {
      console.log(error)
    }
    )
}

// 新規作成画面

const Create = ():JSX.Element => {
  const [bodyText, setbodyText] = useState('')

  return (
    <KeyboardAvoidingView style={styles.container}>
    {/* iOSで発生するキーボードと投稿ボタンの表示バグ対応の為、KeyboardAvoidingViewは修正版を使用 */}

      <View style={styles.inputContainer}>
        {/* multiline iOSで上揃えにする為に必要 */}
        <TextInput
          multiline
          style={styles.input}
          value={bodyText}
          onChangeText={(newText) => { setbodyText(newText)}}
          autoFocus
        />
      </View>
      <CircleButton onPress={() => handlePress(bodyText)}>
        <Icon name='check' size={40} color='#ffffff' />
      </CircleButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24
    }
})

export default Create

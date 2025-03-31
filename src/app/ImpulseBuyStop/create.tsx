import { Alert } from 'react-native'
import { View, TextInput, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { collection, addDoc, Timestamp, FirestoreError } from 'firebase/firestore'
import { useState } from 'react'
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'
import PriorityPicker from '../../components/PriorityPicker'
import { BuyItem } from '../.../../../../types/buyItem'
import { db, auth } from '../../config'

/**
 * 新規登録ボタン押下時の処理
 *
 * @param bodyText 登録データ
 * @param priorityCode 優先度コード
 */
const handlePress = async (bodyText: string, priorityCode :number): Promise<void> => {
  // 登録データが未入力の場合エラーを表示して処理終了
  if (!bodyText){
    Alert.alert('登録データが未入力です')
    return
  }

  // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
  if (!auth.currentUser) {return}

  const ref = collection(db, `buyItem/${auth.currentUser.uid}/items`)

  // 受け取った引数を基に登録データを生成
  const data: BuyItem = {
    bodyText: bodyText,
    updatedAt: Timestamp.fromDate(new Date()),
    priority: priorityCode
  }

  try {
    // apiを使用して登録処理を行い、成功後一覧に戻る
    const docRef = await addDoc(ref, data)
    if(docRef.id){
      Alert.alert('新規登録が完了しました')
      router.back()
    }
  } catch (error: unknown) {
    if (error instanceof FirestoreError) {
      const { code, message } = error
      // 新規登録権限が無い場合
      if(code === 'permission-denied' ){
        Alert.alert('新規登録処理に失敗しました\n'+'新規登録権限が無いユーザーです。')
        return
      }

      Alert.alert('新規登録処理に失敗しました\n'+message)
    } else {
      Alert.alert('予期せぬエラーが発生しました\n'+error)
    }
  }
}

/**
 * 新規作成画面
 *
 * @returns {JSX.Element}
 */
const Create = ():JSX.Element => {
  const [ bodyText, setbodyText ] = useState<string>('')
  // 優先度コードに初期値として1(高)を設定
  const [ priorityCode, setPriorityCode ] = useState<number>(1)

  return (
    <KeyboardAvoidingView style={styles.container}>
    {/* iOSで発生するキーボードと投稿ボタンの表示バグ対応の為、KeyboardAvoidingViewは修正版を使用 */}

      {/* multiline iOSで上揃えにする為に必要 */}
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          style={styles.input}
          value={bodyText}
          onChangeText={(newText) => { setbodyText(newText)}}
          autoFocus
        />
        {/* 優先度選択Picker */}
        <PriorityPicker priorityCode={priorityCode} setPriorityCode={setPriorityCode}/>
      </View>

      {/* 新規登録ボタン */}
      <CircleButton onPress={() => handlePress(bodyText,priorityCode)}>
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

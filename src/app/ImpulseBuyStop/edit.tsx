import {
    View, TextInput, StyleSheet,
    Alert
} from 'react-native'
import { router,useLocalSearchParams  } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'
import PriorityPicker from '../../components/PriorityPicker'
import { auth, db } from '../../config'
import { BuyItem } from '../.../../../../types/buyItem'

// 登録ボタンタッチ処理
const handlePress = (id: string, bodyText: string, priorityCode : number): void => {
  if (!auth.currentUser) { return}
  const ref = doc(db, `users/${auth.currentUser.uid}/items`, id)

  // 受け取った引数を基に登録データを生成
  const data: BuyItem = {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date()),
    priority: priorityCode
  }

  // apiを使用して登録処理を行い、成功後、詳細表示画面に戻る
  setDoc(ref, data)
    .then(() =>{
      router.back()
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('更新に失敗しました')
    })
}

// 編集画面
const Edit = ():JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [bodyText, setBodyText] = useState('')
  // 優先度コードに初期値として1(高)を設定
  const [priorityCode, setPriorityCode] = useState<number>(1)

  useEffect(() => {
    if(!auth.currentUser){return}
    const ref = doc(db, `users/${auth.currentUser.uid}/items`, id)
    getDoc(ref)
      .then((docRef) =>{
        // Firestore データに型指定を適用
        const data = docRef.data() as BuyItem | undefined // データがない場合に `undefined` を考慮
        if (data) {
          // データが存在する場合、登録内容、優先度を初期値として設定
          setBodyText(data.bodyText)
          setPriorityCode(data.priority)
        }else{
          // TODO:データが存在しない場合のエラー処理追加
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },[])

  return (
    <KeyboardAvoidingView style={styles.container} >
    {/* iOSで発生するキーボードと投稿ボタンの表示バグ対応の為、KeyboardAvoidingViewは修正版を使用 */}

      <View style={styles.inputContainer}>
        {/* multiline iOSで上揃えにする為に必要 */}
        <TextInput
          multiline
          style={styles.input}
          value={bodyText}
          onChangeText={(text) => {setBodyText(text)}}
          autoFocus
        />
        {/* 優先度選択Picker */}
        <PriorityPicker priorityCode={priorityCode} setPriorityCode={setPriorityCode}/>
      </View>
      <CircleButton onPress={() => {handlePress(id, bodyText, priorityCode)}}>
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
    flex: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 32,
    paddingHorizontal: 27
  }
})

export default Edit

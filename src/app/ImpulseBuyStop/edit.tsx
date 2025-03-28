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
import { FirebaseError } from "firebase/app"

/**
 * 編集ボタン押下時の処理
 *
 * @param id 編集対象のID
 * @param bodyText 編集データ
 * @param priorityCode 優先度コード
 */
const handlePress = async (id: string, bodyText: string, priorityCode : number): Promise<void> => {
  try {
    // 登録データが未入力の場合エラーを表示して処理終了
    if (!bodyText){
      Alert.alert('登録データが未入力です')
      return
    }

    if (!auth.currentUser) { return}

    const ref = doc(db, `users/${auth.currentUser.uid}/items`, id)

    // 受け取った引数を基に登録データを生成
    const data: BuyItem = {
      bodyText,
      updatedAt: Timestamp.fromDate(new Date()),
      priority: priorityCode
    }

    // apiを使用して登録処理を行い、成功後、詳細表示画面に戻る
    await setDoc(ref, data)
    Alert.alert('編集完了しました')
    router.back()
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code, message } = error
      // 更新権限が無い場合
      if(code === 'permission-denied' ){
        Alert.alert('編集処理に失敗しました\n'+'編集権限が無いユーザーです。')
        return
      }

      Alert.alert('編集処理に失敗しました\n'+message)
    } else {
      Alert.alert('予期せぬエラーが発生しました\n'+error)
    }
  }
}

/**
 * 編集画面
 *
 * @returns {JSX.Element}
 */
const Edit = ():JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [bodyText, setBodyText] = useState('')
  // 優先度コードに初期値として1(高)を設定
  const [priorityCode, setPriorityCode] = useState<number>(1)

  useEffect(() => {
    try {
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
            Alert.alert('データが見つかりません')
            router.back()
          }
        })
        .catch((error) => {
          console.error('データの取得に失敗しました:', error)
          Alert.alert('データの取得に失敗しました')
          router.back()
        })
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { code, message } = error

        if(code === 'permission-denied' ){
          Alert.alert('データの取得に失敗しました\n'+'参照権限が無いユーザーです。')
          return
        }

        Alert.alert('データの取得に失敗しました\n'+message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
      router.back()
    }
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

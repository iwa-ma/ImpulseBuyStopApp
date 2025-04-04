import { View, Text, ScrollView, StyleSheet, Alert} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect} from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { auth, db } from 'config'
import { getpriorityType, getpriorityName } from 'utils/priorityUtils'
import { type priorityType} from 'types/priorityType'
import { type BuyItem } from 'types/buyItem'
import CircleButton from 'components/CircleButton'
import Icon from 'components/icon'

/**
 * 編集アイコン選択動作
 *
 * @param id 選択されたリストアイテムのid
 * @param anonymous 匿名ログイン状態
 */
const handlePress = (id: string,anonymous: string): void => {
  if(anonymous === 'true'){
    Alert.alert('お試し体験モード中はデータ編集できません。','キャンセルを選択して下さい',[
      {
        text:'キャンセル'
      }
    ])
    return
  }

  router.push({ pathname: 'ImpulseBuyStop/edit', params: { id: id}})
}

/**
 * 詳細画面
 *
 * @returns {JSX.Element}
 */
const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const anonymous = useLocalSearchParams<{anonymous:string}>().anonymous
  const [ priorityType , setPriorityType] = useState<priorityType[]>([])

  let docPath = ''
  if(anonymous === 'true'){
    // docPathにサンプルデータのパスを指定
    docPath = 'buyItem/sample9999/items'
  }else{
    // docPathにログイン中ユーザーのパスを指定
    docPath = `buyItem/${auth.currentUser?.uid}/items`
  }

  const [item, setItems] = useState<BuyItem | null>(null)
  useEffect( () => {
    if (!auth.currentUser){return}
    const ref = doc(db, docPath, id)
    try {
      const unsubscrive = onSnapshot(ref, (itemDoc) => {
        // Firestoreからデータを型付けして取得
        const data = itemDoc.data()
        if (data) {
          const buyItem: BuyItem = {
            bodyText: data.bodyText,
            updatedAt: data.updatedAt,
            priority: data.priority
          }
          setItems(buyItem)
        }else{
          Alert.alert('詳細表示データの取得に失敗しました','もう一度開いて発生する場合は運営に問い合わせお願いいたします。',[
            {
              text:'OK'
            }
          ])
        }
      })

      return unsubscrive
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert('詳細表示データの取得に失敗しました', 'もう一度開いて発生する場合は運営に問い合わせお願いいたします。' + error, [
          {
            text: 'OK'
          }
        ])
      }else{
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  },[])

  useEffect( () => {
    (async () =>{
      try {
        await getpriorityType({setPriorityType})
      } catch (error) {
        Alert.alert('エラーが発生しました', '優先度の取得中にエラーが発生しました。' + error, [
          {
            text: 'OK'
          }
        ])
      }
    })()
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item?.bodyText}</Text>
        <Text style={styles.itemDate}>{item?.updatedAt.toDate().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })}</Text>
      </View>
      <ScrollView style={styles.itemBody}>
        <Text style={styles.itemBodyText}>
          {item?.bodyText}
        </Text>
      </ScrollView>

      {/* 優先度 */}
      <View style={styles.itemPriorityText}>
        <Text>優先度:{item?.priority ? getpriorityName(priorityType,item?.priority) : null}</Text>
      </View>

      <CircleButton onPress={() => {handlePress(id,anonymous)}} style={{top:60,bottom: 'auto'}}>
        <Icon name='pencil' size={40} color='#FFFFFF' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#FFFFFF'
  },
  itemHeader: {
    backgroundColor: '#0E75FC',
    height: 96,
    justifyContent: 'center',
    paddingVertical: 24, //縦方向
    paddingHorizontal: 19 //横方向
  },
  itemTitle: {
    color: '#ffffff',
    fontSize:20,
    lineHeight:32,
    fontWeight: 'bold'
  },
  itemDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16
  },
  itemBody :{
    paddingHorizontal: 27
  },
  itemBodyText: {
    paddingVertical: 32,
    fontSize: 16,
    lineHeight: 24,
    color:'#000000'
  },
  itemPriorityText: {
    paddingBottom:16,
    paddingLeft:16
  }
})

export default Detail

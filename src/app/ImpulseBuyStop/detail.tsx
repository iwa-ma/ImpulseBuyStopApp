import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { auth, db } from 'config'
import { getpriorityType, getpriorityName } from 'utils/priorityUtils'
import { type priorityType } from 'types/priorityType'
import { type BuyItem } from 'types/buyItem'
import CircleButton from 'components/CircleButton'
import Icon from 'components/icon'

// スタイル定数
const COLORS = {
  white: '#FFFFFF',
  blue: '#0E75FC',
  black: '#000000'
}

const FONT_SIZES = {
  title: 20,
  date: 12,
  body: 16
}

const LINE_HEIGHTS = {
  title: 32,
  date: 16,
  body: 24
}

const SPACING = {
  padding: {
    vertical: {
      header: 24,
      body: 32
    },
    horizontal: {
      header: 19,
      body: 27,
      priority: 16
    }
  }
}

// ヘッダーコンポーネント
const ItemHeader = ({ title, date }: { title?: string; date?: string }) => (
  <View style={styles.itemHeader}>
    <Text style={styles.itemTitle} numberOfLines={1}>{title}</Text>
    <Text style={styles.itemDate}>{date}</Text>
  </View>
)

// 本文コンポーネント
const ItemBody = ({ text }: { text?: string }) => (
  <ScrollView style={styles.itemBody}>
    <Text style={styles.itemBodyText}>{text}</Text>
  </ScrollView>
)

// 優先度コンポーネント
const ItemPriority = ({ priority, priorityTypes }: { priority?: number; priorityTypes: priorityType[] }) => (
  <View style={styles.itemPriorityText}>
    <Text>優先度:{priority ? getpriorityName(priorityTypes, priority) : null}</Text>
  </View>
)

/**
 * 編集アイコン選択動作
 *
 * @param id 選択されたリストアイテムのid
 * @param anonymous 匿名ログイン状態
 */
const handlePress = (id: string, anonymous: string): void => {
  if (anonymous === 'true') {
    Alert.alert(
      'お試し体験モード中はデータ編集できません。',
      'キャンセルを選択して下さい',
      [{ text: 'キャンセル' }]
    )
    return
  }

  router.push({ pathname: 'ImpulseBuyStop/edit', params: { id } })
}

/**
 * 詳細画面
 */
const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const anonymous = useLocalSearchParams<{ anonymous: string }>().anonymous
  const [priorityType, setPriorityType] = useState<priorityType[]>([])
  const [item, setItems] = useState<BuyItem | null>(null)

  const docPath = anonymous === 'true'
    ? 'buyItem/sample9999/items'
    : `buyItem/${auth.currentUser?.uid}/items`

  useEffect(() => {
    if (!auth.currentUser) return

    const ref = doc(db, docPath, id)
    try {
      const unsubscribe = onSnapshot(ref, (itemDoc) => {
        const data = itemDoc.data()
        if (data) {
          const buyItem: BuyItem = {
            bodyText: data.bodyText,
            updatedAt: data.updatedAt,
            priority: data.priority
          }
          setItems(buyItem)
        } else {
          Alert.alert(
            '詳細表示データの取得に失敗しました',
            'もう一度開いて発生する場合は運営に問い合わせお願いいたします。',
            [{ text: 'OK' }]
          )
        }
      })

      return unsubscribe
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert(
          '詳細表示データの取得に失敗しました',
          'もう一度開いて発生する場合は運営に問い合わせお願いいたします。' + error,
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        await getpriorityType({ setPriorityType })
      } catch (error) {
        Alert.alert(
          'エラーが発生しました',
          '優先度の取得中にエラーが発生しました。' + error,
          [{ text: 'OK' }]
        )
      }
    })()
  }, [])

  const formattedDate = item?.updatedAt.toDate().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <View style={styles.container}>
      <ItemHeader title={item?.bodyText} date={formattedDate} />
      <ItemBody text={item?.bodyText} />
      <ItemPriority priority={item?.priority} priorityTypes={priorityType} />

      <CircleButton onPress={() => handlePress(id, anonymous)} style={{ top: 60, bottom: 'auto' }}>
        <Icon name="pencil" size={40} color={COLORS.white} />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  itemHeader: {
    backgroundColor: COLORS.blue,
    height: 96,
    justifyContent: 'center',
    paddingVertical: SPACING.padding.vertical.header,
    paddingHorizontal: SPACING.padding.horizontal.header
  },
  itemTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.title,
    lineHeight: LINE_HEIGHTS.title,
    fontWeight: 'bold'
  },
  itemDate: {
    color: COLORS.white,
    fontSize: FONT_SIZES.date,
    lineHeight: LINE_HEIGHTS.date
  },
  itemBody: {
    paddingHorizontal: SPACING.padding.horizontal.body
  },
  itemBodyText: {
    paddingVertical: SPACING.padding.vertical.body,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    color: COLORS.black
  },
  itemPriorityText: {
    paddingBottom: SPACING.padding.horizontal.priority,
    paddingLeft: SPACING.padding.horizontal.priority
  }
})

export default Detail

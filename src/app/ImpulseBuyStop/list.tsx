import {
  View, StyleSheet, FlatList,
  Text, Alert, ActivityIndicator
} from 'react-native'
import { router, useNavigation, useLocalSearchParams } from 'expo-router'
import { useEffect, useReducer } from 'react'
import { FirebaseError } from 'firebase/app'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
import { db, auth } from 'config'
import { useUnsubscribe } from 'app/UnsubscribeContext'
import ListSort from 'app/ImpulseBuyStop/listSort'
import { type priorityType } from 'types/priorityType'
import { OutPutBuyItem } from 'types/outPutBuyItem'
import { type SortType, OrderByDirection } from 'types/list'
import { getpriorityType, getpriorityName } from 'utils/priorityUtils'
import BuyListItem from 'components/BuyListItem'
import CircleButton from 'components/CircleButton'
import CustomIcon from 'components/icon'
import PopupMenu from 'components/PopupMenu'

// スタイル定数
const COLORS = {
  white: '#ffffff'
}

const FONT_SIZES = {
  noData: 24
}

const SPACING = {
  //const styles の警告を出さないために、as constを追加
  margin: {
    auto: 'auto' as const
  }
}

// ローディングインジケータコンポーネント
const LoadingIndicator = () => (
  <ActivityIndicator size={120} style={styles.loadingWrap} />
)

// データなしメッセージコンポーネント
const NoDataMessage = () => (
  <Text style={styles.nodetaWrap}>
    <Text style={styles.nodetaTextStyle}>表示するデータがありません。</Text>
    <FontAwesomeIcon size={24} icon={faComment} />
  </Text>
)

/**
 * 新規追加アイコン選択動作
 *
 * @param anonymous 匿名ログイン状態
   */
const handlePress = (anonymous: string): void => {
  if (!auth.currentUser) return

  if (anonymous === 'true') {
    Alert.alert(
      'お試し体験モード中はデータ追加できません。',
      'キャンセルを選択して下さい',
      [{ text: 'キャンセル' }]
    )
    return
  }

  router.push('/ImpulseBuyStop/create')
}

/**
 * リストの表示処理
 * @items リスト表示データ
 * @anonymous 匿名ログイン状態
 */
const buyList = (items: OutPutBuyItem[] | null, anonymous: string): JSX.Element => {
  if (!items) {
    return <LoadingIndicator />
  }

  if (items.length === 0) {
    return <NoDataMessage />
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <BuyListItem key={item.id} buyItem={item} anonymous={anonymous} />
      )}
    />
  )
}

/** リスト画面の状態 */
type ListState = {
  /** リスト表示データ */
  items: OutPutBuyItem[] | null
  /** 優先度名リスト */
  priorityType: priorityType[]
  /** ソートタイプ */
  sortType: SortType
  /** ソート順 */
  sortOrder: OrderByDirection
}

/** リスト画面のアクション */
type ListAction =
  | { type: 'SET_ITEMS'; payload: OutPutBuyItem[] | null }
  | { type: 'SET_PRIORITY_TYPE'; payload: priorityType[] }
  | { type: 'SET_SORT_TYPE'; payload: SortType }
  | { type: 'SET_SORT_ORDER'; payload: OrderByDirection }

/** リスト画面の初期状態 */
const initialState: ListState = {
  items: null,
  priorityType: [],
  sortType: 'updatedAt',
  sortOrder: 'desc'
}

/** リスト画面の状態変更リデューサー */
const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'SET_PRIORITY_TYPE':
      return { ...state, priorityType: action.payload }
    case 'SET_SORT_TYPE':
      return { ...state, sortType: action.payload }
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload }
    default:
      return state
  }
}

/**
 * リスト画面
 *
 * @returns {JSX.Element}
 */
const List = (): JSX.Element => {
  const anonymous = useLocalSearchParams<{ anonymous: string }>().anonymous
  const [state, dispatch] = useReducer(listReducer, initialState)
  const navigation = useNavigation()
  const { setUnsubscribe } = useUnsubscribe()

  // ヘッダーにポップアップメニュー表示処理
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <PopupMenu />
    })
  }, [])

  useEffect(() => {
    (async () => {
      await getpriorityType({
        setPriorityType: (value: priorityType[] | ((prevState: priorityType[]) => priorityType[])) => {
          const types = typeof value === 'function' ? value([]) : value
          dispatch({ type: 'SET_PRIORITY_TYPE', payload: types })
        }
      })
    })()
  }, [])

  // リストデータ取得処理
  useEffect(() => {
    if (!auth.currentUser) return

    dispatch({ type: 'SET_ITEMS', payload: null })

    const collectionPath = anonymous === 'true'
      ? 'buyItem/sample9999/items'
      : `buyItem/${auth.currentUser.uid}/items`

    const ref = collection(db, collectionPath)
    const q = query(ref, orderBy(state.sortType, state.sortOrder))

    // ドキュメントを取得して、出力用の配列を生成(リアルタイムリスナーで監視)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const tempItems: OutPutBuyItem[] = []
        snapshot.forEach((doc) => {
          // Firestoreからデータを型付けして取得
          const data = doc.data()
          if (data) {
            // 出力用配列に追加
            // 優先度をgetpriorityName関数で変換(code → 優先度名)
            const buyItem: OutPutBuyItem = {
              id: doc.id, // idはコレクション要素として不可していないので、ドキュメントオブジェクトから取得する
              bodyText: data.bodyText,
              updatedAt: data.updatedAt,
              priority: getpriorityName(state.priorityType, data.priority)
            }
            tempItems.push(buyItem)
          }
        })

        // 出力用の配列を更新
        dispatch({ type: 'SET_ITEMS', payload: tempItems })
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          const { message } = error
          Alert.alert(
            'エラーが発生しました',
            'データの取得中にエラーが発生しました。もう一度お試しください。' + message
          )
        } else {
          Alert.alert(
            'エラーが発生しました',
            'データの取得中にエラーが発生しました。もう一度お試しください。'
          )
        }
        dispatch({ type: 'SET_ITEMS', payload: [] })
      }
    })

    setUnsubscribe(() => unsubscribe)

    // コンポーネントアンマウント時、onSnapshotの監視を終了させる
    return unsubscribe
  }, [state.priorityType, state.sortType, state.sortOrder])

  return (
    <View style={styles.container}>
      {/* リストソートUI */}
      <ListSort
        itemsSortType={state.sortType}
        itemsSortOrder={state.sortOrder}
        setItemsSortType={(type) => dispatch({ type: 'SET_SORT_TYPE', payload: type })}
        setItemsSortOrder={(order) => dispatch({ type: 'SET_SORT_ORDER', payload: order })}
      />

      {/* リスト表示 */}
      {buyList(state.items, anonymous)}

      <CircleButton onPress={() => handlePress(anonymous)}>
        <CustomIcon name="plus" size={40} color={COLORS.white} />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  nodetaWrap: {
    marginLeft: SPACING.margin.auto,
    marginRight: SPACING.margin.auto,
    marginTop: SPACING.margin.auto,
    marginBottom: SPACING.margin.auto
  },
  loadingWrap: {
    marginLeft: SPACING.margin.auto,
    marginRight: SPACING.margin.auto,
    marginTop: SPACING.margin.auto,
    marginBottom: SPACING.margin.auto
  },
  nodetaTextStyle: {
    fontSize: FONT_SIZES.noData
  }
})

export default List

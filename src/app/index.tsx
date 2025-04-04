import { Redirect, router} from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from 'config'

/**
 * インデックス画面
 *
 * @returns {JSX.Element}
 */
const Index = ():JSX.Element => {
  useEffect(()=>{
    // ログイン状態をチェックしてユーザーが取得できたらリスト画面に書き換え、取得できない場合はログイン画面に遷移
    onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) return

      router.replace({
        pathname: '/ImpulseBuyStop/list',
        params: { anonymous: user.isAnonymous ? 'true' : 'false' }
      })
    })

  },[])
  return <Redirect href='./auth/log-in' />
}

export default Index

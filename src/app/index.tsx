import { Redirect, router} from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from '../config'

const Index = ():JSX.Element => {
  useEffect(()=>{
    // ログイン状態をチェックしてユーザーが取得できたらリスト画面に書き換え、取得できない場合はログイン画面に遷移
    onAuthStateChanged(auth, (user) =>{
      if ( user !== null ) {
        {
          // 匿名ログイン状態によってパラメーターの値を変更
          if(user.isAnonymous){
            router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'true' }})
          }else{
            router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'false' }})
          }
        }
      }
    })

  },[])
  return <Redirect href='./auth/log_in' />
}

export default Index

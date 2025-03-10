import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UnsubscribeContextType {
  unsubscribe: (() => void) | null;
  setUnsubscribe: (unsubscribe: () => void) => void;
}

// unsubscribeの型を定義して、コンテキストオブジェクトを作成（初期値undefined）
const UnsubscribeContext = createContext<UnsubscribeContextType | undefined>(undefined)

// unsubscribeフック(UnsubscribeContextのコンテキストを取得)
export const useUnsubscribe = (): UnsubscribeContextType => {
  const context = useContext(UnsubscribeContext)
  if (!context) {
    throw new Error('useUnsubscribe must be used within a UnsubscribeProvider')
  }
  return context
}

// Providerコンポーネント
export const UnsubscribeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null)

  return (
    // 配下のコンポーネントにunsubscribe, setUnsubscribeを渡す
    <UnsubscribeContext.Provider value={{ unsubscribe, setUnsubscribe }}>
      {children}
    </UnsubscribeContext.Provider>
  )
}

export default useUnsubscribe

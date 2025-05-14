import { useState, useCallback, createContext, useContext, useEffect } from 'react'

// 创建上下文以便在整个应用中共享连接状态
const ConnectionContext = createContext({
  connectionType: 'primary',
  setConnectionType: () => {},
  lastError: null,
  resetConnection: () => {}
})

export function ConnectionProvider({ children }) {
  const [connectionType, setConnectionType] = useState('primary')
  const [lastError, setLastError] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)
  
  // 重置连接到主后端
  const resetConnection = useCallback(() => {
    setConnectionType('primary')
    setLastError(null)
    setLastChecked(new Date())
  }, [])
  
  // 处理 API 调用失败，切换到备用数据库
  const handleFailure = useCallback((error) => {
    setLastError(error)
    setLastChecked(new Date())
    if (connectionType !== 'supabase') {
      console.log('主后端连接失败，切换到 Supabase 备用数据库', error)
      setConnectionType('supabase')
    }
  }, [connectionType])
  
  const value = {
    connectionType,
    setConnectionType,
    lastError,
    lastChecked,
    resetConnection,
    handleFailure
  }
  
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnectionManager() {
  return useContext(ConnectionContext)
}

// 用于包装 API 调用的工具函数
export function withFallback(primaryFn, supabaseFn) {
  const { connectionType, handleFailure, resetConnection } = useConnectionManager()
  
  return async (...args) => {
    try {
      // 尝试使用主后端
      if (connectionType === 'primary') {
        const result = await primaryFn(...args)
        return result
      }
      
      // 如果当前在使用 Supabase，则尝试使用它
      const result = await supabaseFn(...args)
      return result
    } catch (error) {
      // 如果是使用主后端时出错，则切换到 Supabase
      if (connectionType === 'primary') {
        handleFailure(error)
        // 递归调用自身，这次将使用 Supabase
        return withFallback(primaryFn, supabaseFn)(...args)
      }
      
      // 如果 Supabase 也失败，则直接抛出错误
      throw error
    }
  }
}
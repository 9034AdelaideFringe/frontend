import { useState, useEffect } from 'react'
import { useConnectionManager } from './connectionManager'

// 导入主要 API 服务
import * as primaryAuthService from './authService'
import * as primaryEventService from './eventService'

// 导入备用 Supabase 服务
import * as supabaseAuthService from './fallback/supabaseAuthService'
import * as supabaseEventService from './fallback/supabaseEventService'

/**
 * 创建自动切换的服务适配器
 */
export function useAuthService() {
  const { connectionType, handleFailure } = useConnectionManager()
  
  // 创建包装后的认证服务方法
  const login = async (credentials) => {
    try {
      if (connectionType === 'primary') {
        return await primaryAuthService.login(credentials)
      } else {
        return await supabaseAuthService.login(credentials)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        // 切换后重试
        return supabaseAuthService.login(credentials)
      }
      throw error
    }
  }
  
  // 同样包装其他方法...
  const logout = async () => {
    try {
      if (connectionType === 'primary') {
        return await primaryAuthService.logout()
      } else {
        return await supabaseAuthService.logout()
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseAuthService.logout()
      }
      throw error
    }
  }
  
  const isAuthenticated = () => {
    // 身份验证状态通常存储在本地，不需要回退逻辑
    return connectionType === 'primary' 
      ? primaryAuthService.isAuthenticated() 
      : supabaseAuthService.isAuthenticated()
  }
  
  const getCurrentUser = () => {
    // 同样，用户数据通常在本地存储
    return connectionType === 'primary' 
      ? primaryAuthService.getCurrentUser() 
      : supabaseAuthService.getCurrentUser()
  }
  
  const register = async (userData) => {
    try {
      if (connectionType === 'primary') {
        return await primaryAuthService.register(userData)
      } else {
        return await supabaseAuthService.register(userData)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseAuthService.register(userData)
      }
      throw error
    }
  }
  
  // 返回完整的服务对象
  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    register
  }
}

/**
 * 创建自动切换的事件服务适配器
 */
export function useEventService() {
  const { connectionType, handleFailure } = useConnectionManager()
  
  // 创建包装后的事件服务方法
  const getAllEvents = async () => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.getAllEvents()
      } else {
        return await supabaseEventService.getAllEvents()
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.getAllEvents()
      }
      throw error
    }
  }
  
  const getEventById = async (id) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.getEventById(id)
      } else {
        return await supabaseEventService.getEventById(id)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.getEventById(id)
      }
      throw error
    }
  }
  
  const createEvent = async (eventData) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.createEvent(eventData)
      } else {
        return await supabaseEventService.createEvent(eventData)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.createEvent(eventData)
      }
      throw error
    }
  }
  
  const getFeaturedEvents = async (limit) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.getFeaturedEvents(limit)
      } else {
        return await supabaseEventService.getFeaturedEvents(limit)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.getFeaturedEvents(limit)
      }
      throw error
    }
  }
  
  const updateEvent = async (id, eventData) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.updateEvent(id, eventData)
      } else {
        return await supabaseEventService.updateEvent(id, eventData)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.updateEvent(id, eventData)
      }
      throw error
    }
  }
  
  const deleteEvent = async (id) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.deleteEvent(id)
      } else {
        return await supabaseEventService.deleteEvent(id)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.deleteEvent(id)
      }
      throw error
    }
  }
  
  const uploadImage = async (file) => {
    try {
      if (connectionType === 'primary') {
        return await primaryEventService.uploadImage(file)
      } else {
        return await supabaseEventService.uploadImage(file)
      }
    } catch (error) {
      if (connectionType === 'primary') {
        handleFailure(error)
        return supabaseEventService.uploadImage(file)
      }
      throw error
    }
  }
  
  // 返回完整的服务对象
  return {
    getAllEvents,
    getEventById,
    createEvent,
    getFeaturedEvents,
    updateEvent,
    deleteEvent,
    uploadImage,
    mapEventData: connectionType === 'primary' 
      ? primaryEventService.mapEventData 
      : supabaseEventService.mapEventData,
    prepareEventDataForApi: connectionType === 'primary'
      ? primaryEventService.prepareEventDataForApi
      : supabaseEventService.prepareEventDataForApi
  }
}
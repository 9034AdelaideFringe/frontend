import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = 'https://fmnkgmeebdshrelzrfrx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbmtnbWVlYmRzaHJlbHpyZnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTM0NzksImV4cCI6MjA2Mjc2OTQ3OX0.9TqOAoUJZLJAlEAZuIkxSeVLQ49dkbe0vtWe3cmJv6Q'

// 创建 Supabase 客户端实例
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
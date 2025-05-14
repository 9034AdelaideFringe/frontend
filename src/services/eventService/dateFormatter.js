/**
 * 格式化日期范围
 * @param {string} start - 开始日期时间
 * @param {string} end - 结束日期时间
 * @returns {string} 格式化的日期范围
 */
export const formatDateRange = (start, end) => {
  if (!start) return 'Date TBA';
  
  const startDate = new Date(start);
  // 以YYYY-MM-DD格式显示日期
  const formattedStart = startDate.toISOString().split('T')[0];
  
  if (!end) return formattedStart;
  
  const endDate = new Date(end);
  const formattedEnd = endDate.toISOString().split('T')[0];
  
  // 如果开始和结束日期相同，只显示一个日期
  if (formattedStart === formattedEnd) {
    return formattedStart;
  }
  
  // 否则显示日期范围
  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * 格式化时间范围
 * @param {string} start - 开始日期时间
 * @param {string} end - 结束日期时间
 * @returns {string} 格式化的时间范围
 */
export const formatTimeRange = (start, end) => {
  if (!start) return 'Time TBA';
  
  const startDate = new Date(start);
  // 以HH:MM格式显示时间
  const startTime = startDate.toTimeString().substring(0, 5);
  
  if (!end) return startTime;
  
  const endDate = new Date(end);
  const endTime = endDate.toTimeString().substring(0, 5);
  
  // 显示时间范围
  return `${startTime} - ${endTime}`;
};
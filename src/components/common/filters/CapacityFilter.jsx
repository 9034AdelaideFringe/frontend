import React from 'react';
// 假设所有筛选器共享同一个 CSS 模块
import styles from './Filters.module.css';

/**
 * 用于筛选 capacity > 0 的活动的组件
 * @param {object} props
 * @param {boolean} props.showCapacityOnly - 当前是否只显示 capacity > 0 的活动
 * @param {function} props.onToggle - 切换筛选状态的回调函数
 * @param {boolean} [props.disabled=false] - 是否禁用按钮
 */
const CapacityFilter = ({ showCapacityOnly, onToggle, disabled = false }) => {
  return (
    // 使用与 FilterBar 中其他筛选器一致的容器样式
    <div className={styles.filter}>
      {/* 按钮文本根据当前状态切换 */}
      <button
        className={`${styles.filterButton} ${showCapacityOnly ? styles.activeFilter : ''}`} // 可以添加 activeFilter 样式
        onClick={onToggle}
        disabled={disabled} // 使用传入的 disabled 属性
      >
        {showCapacityOnly ? 'Show All Events' : 'Show Events available'}
      </button>
    </div>
  );
};

export default CapacityFilter;
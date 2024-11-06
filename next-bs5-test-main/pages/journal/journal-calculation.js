import React, { useMemo } from 'react';

export default function JournalCalculation({ selectedItems }) {
  // 計算總熱量（僅在 selectedItems 更新時計算）
  const totalCalories = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const calories = parseInt(item.calories, 10); // 假設熱量為數字開頭
      return total + (isNaN(calories) ? 0 : calories);
    }, 0);
  }, [selectedItems]); // 依賴於 selectedItems，只有在 selectedItems 改變時才重新計算

  return (
    <div style={{margin:"0px", border:"0px", padding:"0px"}}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>項目名稱</th>
            <th style={{ textAlign: 'right' }}>熱量 (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <tr
                key={index}
                style={{
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f8ff')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td
                  style={{
                    wordBreak: 'break-word', // 換行處理
                    maxWidth: '160px', // 控制單元格寬度
                  }}
                >
                  {item.name}
                </td>
                <td style={{ textAlign: 'right' }}>{item.calories}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">尚未選擇任何項目</td>
            </tr>
          )}
          <tr>
            <th className="py-2">總熱量</th>
            <th style={{ textAlign: 'right' }}>{totalCalories} kcal</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import React, { useState } from 'react';

const CinemaSeatSystem = () => {
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [isGenerated, setIsGenerated] = useState(false);

  // 生成座位布局
  const generateSeats = () => {
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    
    if (!numRows || !numCols || numRows <= 0 || numCols <= 0) {
      alert('请输入有效的行数和列数');
      return;
    }
    
    if (numRows > 26) {
      alert('行数不能超过26行（A-Z）');
      return;
    }
    
    if (numCols > 50) {
      alert('列数不能超过50列');
      return;
    }

    const layout = [];
    for (let row = 0; row < numRows; row++) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...
      for (let col = 1; col <= numCols; col++) {
        rowSeats.push({
          id: `${rowLetter}${col}`,
          row: rowLetter,
          col: col,
          available: true
        });
      }
      layout.push(rowSeats);
    }
    
    setSeatLayout(layout);
    setSelectedSeats(new Set());
    setIsGenerated(true);
  };

  // 座位点击处理
  const handleSeatClick = (seatId) => {
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  // 获取座位状态样式
  const getSeatStyle = (seatId) => {
    if (selectedSeats.has(seatId)) {
      return 'bg-red-500 text-white border-red-600';
    }
    return 'bg-green-100 text-gray-800 border-green-300 hover:bg-green-200';
  };

  // 重置系统
  const resetSystem = () => {
    setRows('');
    setCols('');
    setSeatLayout([]);
    setSelectedSeats(new Set());
    setIsGenerated(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎬 影院座位管理系统</h1>
        <p className="text-gray-600">输入数字和字母组合生成座位布局</p>
      </div>

      {/* 输入区域 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              行数 (字母 A-Z, 最多26行)
            </label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              placeholder="输入行数"
              min="1"
              max="26"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerated}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              列数 (数字 1-50)
            </label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              placeholder="输入列数"
              min="1"
              max="50"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerated}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateSeats}
              disabled={isGenerated}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              生成座位
            </button>
            
            {isGenerated && (
              <button
                onClick={resetSystem}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                重新设置
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 座位布局 */}
      {isGenerated && (
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-lg text-lg font-semibold">
              🎬 银幕 SCREEN 🎬
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-center mb-2">
                  {/* 行标识 */}
                  <div className="w-8 text-center font-bold text-gray-700 mr-4">
                    {row[0].row}
                  </div>
                  
                  {/* 座位 */}
                  <div className="flex gap-1">
                    {row.map((seat, colIndex) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        className={`w-8 h-8 border-2 rounded text-xs font-semibold transition-all duration-200 ${getSeatStyle(seat.id)}`}
                        title={`座位 ${seat.id}`}
                      >
                        {seat.col}
                      </button>
                    ))}
                  </div>
                  
                  {/* 行标识（右侧） */}
                  <div className="w-8 text-center font-bold text-gray-700 ml-4">
                    {row[0].row}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 图例和已选座位 */}
      {isGenerated && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 图例 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">座位状态图例</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-sm text-gray-700">可选座位</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 border-2 border-red-600 rounded"></div>
                  <span className="text-sm text-gray-700">已选座位</span>
                </div>
              </div>
            </div>
            
            {/* 已选座位 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                已选座位 ({selectedSeats.size}个)
              </h3>
              <div className="min-h-[60px] p-3 bg-white border border-gray-200 rounded">
                {selectedSeats.size > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedSeats).sort().map(seatId => (
                      <span
                        key={seatId}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {seatId}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">请点击座位进行选择</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaSeatSystem;
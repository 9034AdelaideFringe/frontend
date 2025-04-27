// 生成额外的票务数据，以提供更丰富的分析数据
const generateAdditionalTickets = () => {
  const venues = [
    'Adelaide Arts Centre',
    'Adelaide Botanic Garden', 
    'Adelaide Museum of Modern Art',
    'Royal Theatre',
    'Laugh Factory Club',
    'Adelaide Convention Centre',
    'Elder Park',
    'Royal Adelaide Show',
    'Adelaide Festival Centre',
    'Lion Arts Factory',
    'Adelaide Oval',
    'Thebarton Theatre'
  ];
  
  const eventNames = [
    'Circus Performance',
    'Jazz Festival',
    'Contemporary Art Exhibition',
    'Theatre Performance "Nightfall"',
    'Comedy Night',
    'Dance Festival',
    'Digital Art Showcase', 
    'Classical Music Concert',
    'Street Food Festival',
    'Poetry Slam',
    'International Film Festival',
    'Magic Show Extravaganza'
  ];
  
  const ticketTypes = [
    'Standard',
    'VIP Package',
    'Student Entry',
    'Premium Seating',
    'Family Pack',
    'Early Bird',
    'Guided Tour',
    'Standard Entry',
    'Front Row Seats',
    'Group Discount',
    'Child (5-16)',
    'Concession'
  ];
  
  const additionalTickets = [];
  
  // 为每个场馆生成更多的票据，以便获得更加丰富的数据
  for (let i = 0; i < 60; i++) {
    const venueIndex = Math.floor(Math.random() * venues.length);
    const eventIndex = Math.floor(Math.random() * eventNames.length);
    const ticketTypeIndex = Math.floor(Math.random() * ticketTypes.length);
    const eventId = (eventIndex + 1).toString();
    
    // 生成随机日期
    const generateDate = () => {
      // 生成过去一年内的日期，确保有足够的历史数据
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 365);
      const date = new Date();
      date.setDate(now.getDate() - daysAgo);
      return date;
    };
    
    // 生成未来日期
    const generateFutureDate = (fromDate) => {
      const date = new Date(fromDate);
      const daysAhead = Math.floor(Math.random() * 90) + 5;
      date.setDate(date.getDate() + daysAhead);
      return date;
    };
    
    const purchaseDate = generateDate();
    const eventDate = generateFutureDate(purchaseDate);
    const lastRefundDate = new Date(eventDate);
    lastRefundDate.setDate(eventDate.getDate() - 7); // 活动前7天可退款
    
    // 确定票务状态
    const determineStatus = () => {
      const now = new Date();
      if (eventDate < now) {
        return Math.random() > 0.3 ? 'used' : 'expired';
      }
      
      return Math.random() > 0.1 ? 'active' : 'cancelled'; // 10%的退款率
    };
    
    const status = determineStatus();
    
    // 创建扫描日期 (如果票已使用)
    let scanDate = null;
    if (status === 'used') {
      const scanDateTime = new Date(eventDate);
      scanDateTime.setHours(Math.floor(Math.random() * 3) + 17); // 5PM-8PM
      scanDateTime.setMinutes(Math.floor(Math.random() * 60));
      scanDate = scanDateTime.toISOString();
    }
    
    // 生成随机数量和价格
    const quantity = Math.floor(Math.random() * 5) + 1;
    const pricePerTicket = Math.floor(Math.random() * 90) + 10; // $10-$100
    
    additionalTickets.push({
      id: `ticket-${2000 + i}`,
      eventId,
      eventName: `${eventNames[eventIndex]}`,
      date: eventDate.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
      venue: venues[venueIndex],
      ticketType: ticketTypes[ticketTypeIndex],
      quantity,
      pricePerTicket,
      totalPrice: pricePerTicket * quantity,
      purchaseDate: purchaseDate.toISOString().split('T')[0],
      status,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-${2000 + i}`,
      expiryDate: eventDate.toISOString().split('T')[0],
      lastRefundDate: lastRefundDate.toISOString().split('T')[0],
      scanDate,
      orderId: `order-${6000 + Math.floor(i/2)}` // 平均每个订单2张票
    });
  }
  
  return additionalTickets;
};

// 基础票据数据
export const mockUserTickets = [
  {
    id: 'ticket-1001',
    eventId: '1',
    eventName: 'Circus Performance',
    date: '2025-03-10',
    time: '19:30',
    venue: 'Adelaide Arts Centre',
    ticketType: 'Standard',
    quantity: 2,
    pricePerTicket: 40.00,
    totalPrice: 80.00,
    purchaseDate: '2025-01-15',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1001',
    expiryDate: '2025-03-10',
    lastRefundDate: '2025-03-03',
    orderId: 'order-5001'
  },
  {
    id: 'ticket-1002',
    eventId: '3',
    eventName: 'Contemporary Art Exhibition',
    date: '2025-03-05',
    time: '10:00 - 18:00',
    venue: 'Adelaide Museum of Modern Art',
    ticketType: 'Guided Tour',
    quantity: 1,
    pricePerTicket: 40.00,
    totalPrice: 40.00,
    purchaseDate: '2025-01-20',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1002',
    expiryDate: '2025-03-05',
    lastRefundDate: '2025-02-26',
    orderId: 'order-5002'
  },
  {
    id: 'ticket-1003',
    eventId: '2',
    eventName: 'Jazz Festival',
    date: '2025-03-15',
    time: '18:00',
    venue: 'Adelaide Botanic Garden',
    ticketType: 'VIP Package',
    quantity: 3,
    pricePerTicket: 95.00,
    totalPrice: 285.00,
    purchaseDate: '2024-12-10',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1003',
    expiryDate: '2025-03-15',
    lastRefundDate: '2025-03-08',
    orderId: 'order-5003'
  },
  {
    id: 'ticket-1004',
    eventId: '6',
    eventName: 'Comedy Night',
    date: '2025-01-18',
    time: '20:00',
    venue: 'Laugh Factory Club',
    ticketType: 'Standard Entry',
    quantity: 2,
    pricePerTicket: 30.00,
    totalPrice: 60.00,
    purchaseDate: '2024-12-20',
    status: 'used',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1004',
    expiryDate: '2025-01-18',
    lastRefundDate: '2025-01-11',
    scanDate: '2025-01-18T19:45:30',
    orderId: 'order-5004'
  },
  {
    id: 'ticket-1005',
    eventId: '4',
    eventName: 'Theatre Performance "Nightfall"',
    date: '2024-12-15',
    time: '19:00',
    venue: 'Royal Theatre',
    ticketType: 'Premium Seating',
    quantity: 4,
    pricePerTicket: 85.00,
    totalPrice: 340.00,
    purchaseDate: '2024-11-05',
    status: 'used',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1005',
    expiryDate: '2024-12-15',
    lastRefundDate: '2024-12-08',
    scanDate: '2024-12-15T18:50:22',
    orderId: 'order-5005'
  },
  {
    id: 'ticket-1006',
    eventId: '5',
    eventName: 'Dance Festival',
    date: '2025-04-20',
    time: '16:00',
    venue: 'Adelaide Convention Centre',
    ticketType: 'Family Pack',
    quantity: 1,
    pricePerTicket: 90.00,
    totalPrice: 90.00,
    purchaseDate: '2025-01-25',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket-1006',
    expiryDate: '2025-04-20',
    lastRefundDate: '2025-04-13',
    orderId: 'order-5006'
  },
  // 添加更多模拟数据以丰富分析
  ...generateAdditionalTickets()
];

// 导出单独的函数来获取票务数据
export const getAllTicketsData = () => mockUserTickets;
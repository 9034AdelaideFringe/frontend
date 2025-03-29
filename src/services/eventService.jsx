// Mock event data
const events = [
  {
    id: '1',
    title: 'Circus Performance',
    abstract: 'World-class acrobatic troupe brings thrilling circus performances including aerial acts, magic shows and more.',
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'This is a visual feast not to be missed! The world-class acrobatic troupe will present a series of thrilling circus performances, including aerial acts, magic shows, and clown performances. Suitable for the whole family, guaranteed to leave you amazed!',
    date: '2025-03-10',
    time: '19:30',
    venue: 'Adelaide Arts Centre',
    price: '40-120'
  },
  {
    id: '2',
    title: 'Jazz Festival',
    abstract: 'A collection of jazz masters from around the world bringing an auditory feast.',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'This jazz festival brings together jazz masters from around the world for an unforgettable auditory feast. Whether you\'re a seasoned jazz enthusiast or a newcomer, you\'ll find performances to enjoy. Live band performances and improvisation will let you experience the charm of jazz music!',
    date: '2025-03-15',
    time: '18:00',
    venue: 'Adelaide Botanic Garden',
    price: '55-95'
  },
  {
    id: '3',
    title: 'Contemporary Art Exhibition',
    abstract: 'Showcasing avant-garde works from local and international artists exploring modern social issues.',
    image: 'https://images.unsplash.com/photo-1594796582908-71d3b16c8afd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'This contemporary art exhibition showcases avant-garde works by local and international artists with themes centered around exploring various issues in modern society. The exhibition includes installations, multimedia works, paintings, and sculptures. There\'s a special interactive area where visitors can participate in artistic creation.',
    date: '2025-03-01 - 2025-03-20',
    time: '10:00 - 18:00',
    venue: 'Adelaide Museum of Modern Art',
    price: '25'
  },
  {
    id: '4',
    title: 'Theatre Performance "Nightfall"',
    abstract: 'Award-winning theatre company presents a moving drama about family and memory.',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'An award-winning theatre company presents a moving drama about family and memory. The story depicts how a family faces loss and reconnection. The cast includes several internationally renowned actors, and the stage design is innovative and unique, providing audiences with both visual and emotional impacts.',
    date: '2025-03-08',
    time: '19:00',
    venue: 'Royal Theatre',
    price: '35-85'
  },
  {
    id: '5',
    title: 'Street Food Festival',
    abstract: 'Taste foods from around the world and experience different cultural culinary journeys.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'At this street food festival, you can taste foods from around the world and experience a culinary journey through different cultures. With over 50 stalls offering various foods, beverages, and desserts. There will also be live music performances and cooking demonstrations to enhance your enjoyment while savoring delicious food.',
    date: '2025-03-12 - 2025-03-14',
    time: '11:00 - 22:00',
    venue: 'Victoria Square',
    price: 'Free entry, food costs vary'
  },
  {
    id: '6',
    title: 'Comedy Night',
    abstract: 'A night of non-stop laughter with performances by several famous stand-up comedians.',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'Get ready to laugh all night long! This comedy night will feature several famous stand-up comedians taking turns to deliver their latest and funniest routines. From satirical commentaries on current events to amusing anecdotes about daily life, there will be continuous laughter guaranteed to make your stomach hurt from laughing.',
    date: '2025-03-18',
    time: '20:00',
    venue: 'Laugh Factory Club',
    price: '30'
  }
];

// Get all events
export const getAllEvents = () => {
  return Promise.resolve(events);
};

// Get featured events (here simply returning the first 3 as an example)
export const getFeaturedEvents = () => {
  return Promise.resolve(events.slice(0, 3));
};

// Get a single event by ID
export const getEventById = (id) => {
  const event = events.find(event => event.id === id);
  if (event) {
    return Promise.resolve(event);
  }
  return Promise.reject(new Error('Event not found'));
};
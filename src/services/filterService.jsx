// Extract unique venues from events array
export const extractVenues = (events) => {
  const venuesSet = new Set(events.map(event => event.venue));
  return Array.from(venuesSet);
};

// Parse price string to get min and max values
export const parsePriceRange = (priceString) => {
  // Handle "Free entry" case
  if (priceString.toLowerCase().includes('free')) {
    return { min: 0, max: 0 };
  }
  
  // Extract numbers from string like "40-120" or "$35-85"
  const numbers = priceString.match(/\d+/g);
  if (!numbers || numbers.length === 0) return { min: 0, max: 0 };
  
  if (numbers.length === 1) {
    // Single price like "30"
    return { min: parseInt(numbers[0]), max: parseInt(numbers[0]) };
  } else {
    // Range like "40-120"
    return { min: parseInt(numbers[0]), max: parseInt(numbers[1]) };
  }
};

// Filter events by various criteria
export const filterEvents = (events, filters) => {
  const { searchTerm, selectedVenues, startDate, endDate, minPrice, maxPrice } = filters;
  
  return events.filter(event => {
    // Text search filtering
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Venue filtering
    const matchesVenue = selectedVenues.length === 0 || 
      selectedVenues.includes(event.venue);
    
    // Date filtering
    let matchesDate = true;
    if (startDate || endDate) {
      const eventDate = new Date(event.date.split(' - ')[0]); // Take first date if range
      if (startDate && new Date(startDate) > eventDate) matchesDate = false;
      if (endDate && new Date(endDate) < eventDate) matchesDate = false;
    }
    
    // Price filtering
    let matchesPrice = true;
    if (minPrice > 0 || maxPrice < Infinity) {
      const priceRange = parsePriceRange(event.price);
      if (minPrice > priceRange.max || maxPrice < priceRange.min) matchesPrice = false;
    }
    
    return matchesSearch && matchesVenue && matchesDate && matchesPrice;
  });
};
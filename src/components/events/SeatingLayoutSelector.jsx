import React, { useState, useEffect } from 'react';
import styles from './SeatingLayoutSelector.module.css'; // Create a corresponding CSS module
// Remove the import for addToCart
// import { addToCart } from '../../services/cartService'; // Assuming addToCart is in cartService

// Add onAddToCart to the props
const SeatingLayoutSelector = ({ eventId, category, ticketTypes, onAddToCart }) => {
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [vipTicketTypeId, setVipTicketTypeId] = useState(null);
  const [standardTicketTypeId, setStandardTicketTypeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  console.log('[SeatingLayoutSelector] Component rendered with props:', { eventId, category, ticketTypes, onAddToCart: typeof onAddToCart }); // Log props on render

  useEffect(() => {
    console.log('[SeatingLayoutSelector] useEffect triggered.'); // Log useEffect start

    if (!category || !ticketTypes || ticketTypes.length === 0) {
      console.log('[SeatingLayoutSelector] Missing category or ticketTypes.'); // Log missing data
      setError("Seating layout or ticket information is missing.");
      setLoading(false);
      return;
    }

    // Find VIP and Standard ticket types based on name
    const vipType = ticketTypes.find(type => type.name && type.name.toLowerCase().includes('vip'));
    // Find standard type: either includes 'standard' or is not VIP
    const standardType = ticketTypes.find(type => type.name && (type.name.toLowerCase().includes('standard') || (vipType && type.ticket_type_id !== vipType.ticket_type_id)));

    console.log('[SeatingLayoutSelector] Found ticket types:', { vipType, standardType }); // Log found ticket types

    if (!vipType || !standardType) {
        console.log('[SeatingLayoutSelector] Could not find both VIP and Standard ticket types.'); // Log ticket type error
        setError("Could not find both VIP and Standard ticket types based on names.");
        setLoading(false);
        return;
    }

    setVipTicketTypeId(vipType.ticket_type_id || vipType.id); // Use ticket_type_id or id
    setStandardTicketTypeId(standardType.ticket_type_id || standardType.id); // Use ticket_type_id or id
    console.log('[SeatingLayoutSelector] Set ticket type IDs:', { vipTicketTypeId: (vipType.ticket_type_id || vipType.id), standardTicketTypeId: (standardType.ticket_type_id || standardType.id) }); // Log set IDs


    // Parse category string (e.g., "4F+2") -> 4 rows, 'F' columns, 2 VIP rows
    const categoryMatch = category.match(/^(\d+)([a-zA-Z])(?:\+(\d+))?$/); // Regex to capture rows, column letter, and optional VIP rows

    console.log('[SeatingLayoutSelector] Category match result:', categoryMatch); // Log category match result

    if (!categoryMatch) {
        console.log('[SeatingLayoutSelector] Invalid category format.'); // Log invalid format error
        setError("Invalid category format. Expected format like '4F' or '7J+2'.");
        setLoading(false);
        return;
    }

    const numRows = parseInt(categoryMatch[1], 10);
    const colLetter = categoryMatch[2].toUpperCase();
    const numCols = colLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    const numVipRows = categoryMatch[3] ? parseInt(categoryMatch[3], 10) : 0; // Default to 0 VIP rows if +Number is missing

    console.log('[SeatingLayoutSelector] Parsed category:', { numRows, colLetter, numCols, numVipRows }); // Log parsed category values


    if (isNaN(numRows) || numRows <= 0 || isNaN(numCols) || numCols <= 0) {
        console.log('[SeatingLayoutSelector] Invalid row or column values.'); // Log invalid values error
        setError("Invalid row or column values from category.");
        setLoading(false);
        return;
    }

     if (numVipRows < 0 || numVipRows > numRows) {
         console.warn(`[SeatingLayoutSelector] Invalid number of VIP rows (${numVipRows}) specified in category "${category}". Must be between 0 and ${numRows}. Defaulting to 0 VIP rows.`);
         // Optionally set an error or just use 0, let's use 0 and warn
         // setError(`Invalid number of VIP rows (${numVipRows}).`);
         // setLoading(false);
         // return;
     }


    const layout = [];
    for (let row = 0; row < numRows; row++) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...
      const isVipRow = row < numVipRows; // Determine if this is a VIP row based on parsed number

      for (let col = 1; col <= numCols; col++) {
        rowSeats.push({
          id: `${rowLetter}${col}`,
          row: rowLetter,
          col: col,
          available: true, // Assuming all seats are available initially from category string
          isVip: isVipRow,
          // We don't have per-seat availability from this category string,
          // so we assume all seats in the layout are potentially available.
          // Actual availability check would happen when adding to cart or fetching ticketTypes
          // if ticketTypes included seat-specific availability.
        });
      }
      layout.push(rowSeats);
    }

    console.log('[SeatingLayoutSelector] Generated seat layout:', layout); // Log generated layout
    setSeatLayout(layout);
    setLoading(false);
    console.log('[SeatingLayoutSelector] Finished useEffect, loading set to false.'); // Log useEffect end

  }, [category, ticketTypes]); // Re-run if category or ticketTypes change

  const handleSeatClick = (seatId) => {
    console.log('[SeatingLayoutSelector] Seat clicked:', seatId); // Log seat click
    // Find the seat object to check availability (if we had per-seat availability)
    // For now, assuming all seats in the layout are selectable unless marked otherwise
    // let clickedSeat = null;
    // for (const row of seatLayout) {
    //     clickedSeat = row.find(seat => seat.id === seatId);
    //     if (clickedSeat && !clickedSeat.available) {
    //         return; // Cannot select unavailable seats
    //     }
    // }

    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
    console.log('[SeatingLayoutSelector] Updated selected seats:', Array.from(newSelected)); // Log updated selection
  };

  const getSeatStyle = (seat) => {
    if (selectedSeats.has(seat.id)) {
      return styles.selectedSeat;
    }
    if (seat.isVip) { // Use the isVip property set during layout generation
      return styles.vipSeat;
    }
    // Add a style for unavailable seats if needed (requires per-seat availability data)
    // if (!seat.available) {
    //   return styles.unavailableSeat;
    // }
    return styles.standardSeat;
  };

  const handleBuyTickets = async () => {
    console.log('[SeatingLayoutSelector] Buy Tickets clicked.'); // Log button click
    if (selectedSeats.size === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (!eventId) {
        alert("Event ID is missing.");
        return;
    }

    if (!vipTicketTypeId || !standardTicketTypeId) {
        alert("Ticket type information is not available.");
        return;
    }

    setIsAddingToCart(true);
    const itemsToAdd = [];

    selectedSeats.forEach(seatId => {
        // Find the corresponding seat object to determine if it's VIP
        let selectedSeat = null;
        for (const row of seatLayout) {
            selectedSeat = row.find(seat => seat.id === seatId);
            if (selectedSeat) break;
        }

        if (selectedSeat) {
             itemsToAdd.push({
                eventId: eventId,
                // Use the ticket type ID based on the seat's isVip property
                ticketTypeId: selectedSeat.isVip ? vipTicketTypeId : standardTicketTypeId,
                quantity: 1, // Always add quantity 1 for each selected seat
                seat: seatId, // Include the specific seat ID
            });
        } else {
            console.error("[SeatingLayoutSelector] Could not find seat object for selected seat ID:", seatId); // Added context to log
            // This should ideally not happen if seatId comes from seatLayout
        }
    });

    console.log("[SeatingLayoutSelector] Preparing items to add to cart:", itemsToAdd); // Added context to log

    if (itemsToAdd.length === 0) {
         alert("No valid seats selected to add to cart.");
         setIsAddingToCart(false);
         return;
    }

    // Call the onAddToCart prop passed from the parent (EventDetailPage)
    if (onAddToCart) {
        console.log("[SeatingLayoutSelector] Calling onAddToCart prop."); // Log calling prop
        await onAddToCart(itemsToAdd); // Pass the items to the parent's handler
    } else {
        console.error("[SeatingLayoutSelector] onAddToCart prop is not provided."); // Log missing prop
        alert("Add to cart functionality is not available.");
    }

    // The parent's onAddToCart handler should handle setting isAddingToCart back to false
    // and clearing selectedSeats after successful addition.
    // For now, we'll keep the state updates here for simplicity, but ideally
    // the parent would manage the loading/success state after the callback.
    // setIsAddingToCart(false); // Moved to parent's handler
    // setSelectedSeats(new Set()); // Moved to parent's handler

  };

  // Keep the state updates here for now, but consider moving them to the parent
  // after the onAddToCart callback resolves.
  useEffect(() => {
      if (!isAddingToCart && selectedSeats.size > 0) {
          // This effect could be used to clear selection after parent's handler finishes
          // but requires a state update from the parent.
      }
  }, [isAddingToCart, selectedSeats]);


  if (loading) {
    console.log('[SeatingLayoutSelector] Rendering loading state...'); // Log loading state
    return <div>Loading seating layout...</div>;
  }

  if (error) {
    console.log('[SeatingLayoutSelector] Rendering error state:', error); // Log error state
    return <div className={styles.error}>{error}</div>;
  }

   // Check if there are any rows/seats to display after parsing
   // Corrected check for empty layout
  if (seatLayout.length === 0 || (seatLayout.length > 0 && seatLayout[0].length === 0)) {
      console.log('[SeatingLayoutSelector] Rendering no seating layout message.'); // Log no layout message
      return <div className={styles.noSeating}>No seating layout information available for this event.</div>;
  }


  return (
    <div className={styles.seatingContainer}>
      <h2 className={styles.sectionTitle}>Select Your Seats</h2>

      <div className={styles.screen}>Screen</div>

      <div className={styles.seatGrid}>
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.seatRow}>
            {/* Use rowLetter from the first seat in the row */}
            <div className={styles.rowLabel}>{row[0].row}</div>
            <div className={styles.seats}>
              {row.map((seat) => (
                <button
                  key={seat.id}
                  className={`${styles.seat} ${getSeatStyle(seat)}`}
                  onClick={() => handleSeatClick(seat.id)}
                  // Disable if adding to cart. Availability check would go here if we had the data.
                  disabled={isAddingToCart}
                  title={`Seat ${seat.id}${seat.isVip ? ' (VIP)' : ''}`}
                >
                  {/* Display column number */}
                  {seat.col}
                </button>
              ))}
            </div>
             {/* Use rowLetter from the first seat in the row */}
            <div className={styles.rowLabel}>{row[0].row}</div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
          <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.standardSeat} ${styles.legendBox}`}></div>
              <span>Standard Seat</span>
          </div>
          <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.vipSeat} ${styles.legendBox}`}></div>
              <span>VIP Seat</span> {/* Updated legend text */}
          </div>
          <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.selectedSeat} ${styles.legendBox}`}></div>
              <span>Selected Seat</span>
          </div>
          {/* Add legend for unavailable seats if implemented */}
          {/* <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.unavailableSeat} ${styles.legendBox}`}></div>
              <span>Unavailable</span>
          </div> */}
      </div>


      <div className={styles.selectedSeatsSummary}>
        Selected Seats ({selectedSeats.size}):{' '}
        {selectedSeats.size > 0
          ? Array.from(selectedSeats).sort((a, b) => {
              // Custom sort for seat IDs (e.g., A1, A10, B1)
              const [rowA, colA] = [a.charAt(0), parseInt(a.slice(1), 10)];
              const [rowB, colB] = [b.charAt(0), parseInt(b.slice(1), 10)];
              if (rowA !== rowB) {
                  return rowA.localeCompare(rowB);
              }
              return colA - colB;
            }).join(', ')
          : 'None'}
      </div>

      <button
        className={styles.buyButton}
        onClick={handleBuyTickets}
        disabled={selectedSeats.size === 0 || isAddingToCart}
      >
        {isAddingToCart ? 'Adding to Cart...' : `Buy Tickets (${selectedSeats.size})`}
      </button>
    </div>
  );
};

export default SeatingLayoutSelector;
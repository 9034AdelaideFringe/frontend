import React, { useState, useEffect } from 'react';
import styles from './SeatingLayoutSelector.module.css'; // Create a corresponding CSS module
// Remove the import for addToCart
// import { addToCart } from '../../services/cartService'; // Assuming addToCart is in cartService

// Add occupiedSeats to the props
const SeatingLayoutSelector = ({ eventId, category, ticketTypes, occupiedSeats, onAddToCart }) => {
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [vipTicketTypeId, setVipTicketTypeId] = useState(null);
  const [standardTicketTypeId, setStandardTicketTypeId] = useState(null);
  const [loading, setLoading] = useState(true); // Keep internal loading state for layout generation
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // State to prevent double clicks

  console.log('[SeatingLayoutSelector] Component rendered with props:', { eventId, category, ticketTypes, occupiedSeats: occupiedSeats ? occupiedSeats.length : 0, onAddToCart: typeof onAddToCart }); // Log props on render

  useEffect(() => {
    console.log('[SeatingLayoutSelector] useEffect triggered.'); // Log useEffect start

    // This effect is responsible for generating the seat layout based on category, ticket types, AND occupied seats.
    // It should run whenever any of these props change.

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
    setStandardTicketTypeId(standardType.ticket_type_id || standardType.id);
    console.log('[SeatingLayoutSelector] Set ticket type IDs:', { vipTicketTypeId: (vipType.ticket_type_id || vipType.id), standardTicketTypeId: (standardType.ticket_type_id || standardType.id) });


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
    // Create a Set of occupied seat IDs for quick lookup
    // Ensure occupiedSeats is an array before mapping
    const occupiedSeatIds = new Set(Array.isArray(occupiedSeats) ? occupiedSeats.map(seat => seat.seat) : []);
    console.log('[SeatingLayoutSelector] Occupied seat IDs:', Array.from(occupiedSeatIds)); // Log occupied IDs


    for (let row = 0; row < numRows; row++) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...
      const isVipRow = row < numVipRows; // Determine if this is a VIP row based on parsed number

      for (let col = 1; col <= numCols; col++) {
        const seatId = `${rowLetter}${col}`;
        // --- New: Check if the seat is occupied ---
        const isOccupied = occupiedSeatIds.has(seatId);
        // --- End New ---

        rowSeats.push({
          id: seatId,
          row: rowLetter,
          col: col,
          // --- New: Set availability based on occupied status ---
          available: !isOccupied,
          // --- End New ---
          isVip: isVipRow,
        });
      }
      layout.push(rowSeats);
    }

    console.log('[SeatingLayoutSelector] Generated seat layout:', layout); // Log generated layout
    setSeatLayout(layout);
    setLoading(false); // Set internal loading to false after layout generation
    console.log('[SeatingLayoutSelector] Finished useEffect, internal loading set to false.'); // Log useEffect end

  }, [category, ticketTypes, occupiedSeats]); // --- New: Add occupiedSeats to dependency array ---

  // Effect to clear selected seats if they become occupied (optional, but good UX)
  // If a selected seat becomes occupied by another user, this clears it from selection.
  useEffect(() => {
      // Ensure occupiedSeats is an array before mapping
      const occupiedSeatIds = new Set(Array.isArray(occupiedSeats) ? occupiedSeats.map(seat => seat.seat) : []);
      const newSelected = new Set(selectedSeats);
      let selectionChanged = false;
      selectedSeats.forEach(seatId => {
          if (occupiedSeatIds.has(seatId)) {
              newSelected.delete(seatId);
              selectionChanged = true;
          }
      });
      if (selectionChanged) {
          setSelectedSeats(newSelected);
          console.log('[SeatingLayoutSelector] Cleared selected seats that became occupied.'); // Log cleared seats
      }
  }, [occupiedSeats, selectedSeats]); // Depend on occupiedSeats and selectedSeats


  const handleSeatClick = (seatId) => {
    console.log('[SeatingLayoutSelector] Seat clicked:', seatId); // Log seat click

    // --- New: Find the seat object to check availability ---
    let clickedSeat = null;
    for (const row of seatLayout) {
        clickedSeat = row.find(seat => seat.id === seatId);
        if (clickedSeat) break;
    }

    // Prevent clicking if the seat object wasn't found (shouldn't happen) or if it's not available
    if (!clickedSeat || !clickedSeat.available) {
        console.log('[SeatingLayoutSelector] Seat is unavailable or not found, ignoring click.'); // Log unavailable click
        return; // Cannot select unavailable seats
    }
    // --- End New ---


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
    // --- New: Check if seat is unavailable first ---
    if (!seat.available) {
        return styles.unavailableSeat;
    }
    // --- End New ---

    if (selectedSeats.has(seat.id)) {
      return styles.selectedSeat;
    }
    if (seat.isVip) { // Use the isVip property set during layout generation
      return styles.vipSeat;
    }
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
        // Find the corresponding seat object to determine if it's VIP and available
        let selectedSeat = null;
        for (const row of seatLayout) {
            selectedSeat = row.find(seat => seat.id === seatId);
            if (selectedSeat) break;
        }

        if (selectedSeat) {
             // --- New: Double check if the seat is available before adding to cart ---
             if (!selectedSeat.available) {
                 console.warn(`[SeatingLayoutSelector] Attempted to add unavailable seat ${seatId} to cart.`);
                 // Optionally alert the user or skip this seat
                 // alert(`Seat ${seatId} is no longer available.`);
                 return; // Skip this seat
             }
             // --- End New ---

             itemsToAdd.push({
                eventId: eventId,
                // Use the ticket type ID based on the seat's isVip property
                ticketTypeId: selectedSeat.isVip ? vipTicketTypeId : standardTicketTypeId,
                quantity: 1, // Always add quantity 1 for each selected seat
                seat: seatId, // Include the specific seat ID
            });
        } else {
            console.error("[SeatingLayoutSelector] Could not find seat object for selected seat ID:", seatId);
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
        // The parent's onAddToCart handler is responsible for setting isAddingToCart back to false
        // and potentially re-fetching occupied seats and clearing selectedSeats.
        onAddToCart(itemsToAdd)
            .catch(error => {
                 // Catch any errors from the parent's handler if needed, though parent should handle its own errors
                 console.error("[SeatingLayoutSelector] Error from parent onAddToCart:", error);
                 // The parent's finally block should handle setting isAddingToCart(false)
            });
    } else {
        console.error("[SeatingLayoutSelector] onAddToCart prop is not provided."); // Log missing prop
        alert("Add to cart functionality is not available.");
        setIsAddingToCart(false); // Ensure state is reset even if prop is missing
    }

    // Clearing selected seats is now handled in the parent's handleAddToCart after successful API call
    // setSelectedSeats(new Set());

  };


  // Check if there are any rows/seats to display after parsing
   // Corrected check for empty layout
  if (!loading && (seatLayout.length === 0 || (seatLayout.length > 0 && seatLayout[0].length === 0))) {
      console.log('[SeatingLayoutSelector] Rendering no seating layout message.'); // Log no layout message
      // Only show this message if not loading and layout is empty
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
                  // Disable if adding to cart OR if the seat is not available
                  disabled={isAddingToCart || !seat.available} // --- New: Disable if not available ---
                  title={`Seat ${seat.id}${seat.isVip ? ' (VIP)' : ''}${!seat.available ? ' (Occupied)' : ''}`} // --- New: Add occupied status to title ---
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
          {/* --- New: Add legend for unavailable seats --- */}
          <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.unavailableSeat} ${styles.legendBox}`}></div>
              <span>Occupied</span> {/* Changed text to Occupied */}
          </div>
          {/* --- End New --- */}
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
        disabled={selectedSeats.size === 0 || isAddingToCart} // Disable if no seats selected or adding to cart
      >
        {isAddingToCart ? 'Adding to Cart...' : `Add Selected Seats to Cart (${selectedSeats.size})`} {/* Change button text while adding */}
      </button>
    </div>
  );
};

export default SeatingLayoutSelector;
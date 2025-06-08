import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { addToCart } from "../services/cartService";
import { getTicketTypesByEventIdAPI } from '../services/ticketTypeService';
// Import the new function to get occupied seats
import { getOccupiedSeatsByEventIdAPI } from '../services/ticketService/operations/query'; // Adjust path if needed

import SeatingLayoutSelector from "../components/events/SeatingLayoutSelector"; // Import the new component
import styles from "./EventDetailPage.module.css";
import { getRandomDefaultImageUrl } from '../utils/defaultImages'; // 导入新创建的函数


const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  // Add state for occupied seats
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false); // State to manage adding to cart status

  console.log('[EventDetailPage] Component mounted or updated for ID:', id); // Log component mount/update

  useEffect(() => {
    console.log('[EventDetailPage] useEffect triggered for ID:', id); // Log useEffect start

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // Fetch event details
            console.log('[EventDetailPage] Fetching event details with getEventById...');
            const eventDataResponse = await getEventById(id);
            console.log('[EventDetailPage] getEventById success:', eventDataResponse);

            let eventData;
            if (Array.isArray(eventDataResponse)) {
              eventData = eventDataResponse[0];
            } else if (
              eventDataResponse &&
              eventDataResponse.data &&
              Array.isArray(eventDataResponse.data) &&
              eventDataResponse.data.length > 0
            ) {
              eventData = eventDataResponse.data[0];
            } else if (eventDataResponse && (eventDataResponse.event_id || eventDataResponse.id)) {
              eventData = eventDataResponse;
            } else {
              console.error('[EventDetailPage] Invalid event data format received:', eventDataResponse);
              throw new Error("Invalid event data format");
            }

            console.log('[EventDetailPage] Processed event data:', eventData);
            setEvent(eventData);

            // Fetch ticket types separately
            console.log('[EventDetailPage] Fetching ticket types with getTicketTypesByEventIdAPI...');
            const ticketTypesData = await getTicketTypesByEventIdAPI(id);
            console.log('[EventDetailPage] getTicketTypesByEventIdAPI success:', ticketTypesData);

            if (Array.isArray(ticketTypesData)) {
                 setTicketTypes(ticketTypesData);
            } else if (ticketTypesData && Array.isArray(ticketTypesData.data)) {
                 setTicketTypes(ticketTypesData.data);
            }
            else {
                 console.warn('[EventDetailPage] getTicketTypesByEventIdAPI returned non-array data:', ticketTypesData);
                 setTicketTypes([]);
            }

            // --- New: Fetch occupied seats ---
            console.log('[EventDetailPage] Fetching occupied seats with getOccupiedSeatsByEventIdAPI...');
            const occupiedSeatsData = await getOccupiedSeatsByEventIdAPI(id);
            console.log('[EventDetailPage] getOccupiedSeatsByEventIdAPI success:', occupiedSeatsData);

             if (Array.isArray(occupiedSeatsData)) {
                 setOccupiedSeats(occupiedSeatsData);
            } else if (occupiedSeatsData && Array.isArray(occupiedSeatsData.data)) {
                 // Handle potential nested data structure from API
                 setOccupiedSeats(occupiedSeatsData.data);
            }
            else {
                 console.warn('[EventDetailPage] getOccupiedSeatsByEventIdAPI returned non-array data:', occupiedSeatsData);
                 setOccupiedSeats([]); // Default to empty array on unexpected format
            }
            // --- End New ---


        } catch (err) {
            console.error('[EventDetailPage] Error fetching data:', err);
            setError(err.message || 'Failed to load event details or ticket types.');
        } finally {
            setLoading(false);
        }
    };

    fetchData();

  }, [id]); // Re-run effect if ID changes

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        return localDate.toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateString;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date(`2000-01-01T${hours}:${minutes}:00`);
      return date.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return timeString;
    }
  };

  const getEventImageUrl = (imagePath) => {
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    if (!IMAGE_BASE_URL) {
        console.error("[EventDetailPage] VITE_API_BASE_URL is not defined.");
        return getRandomDefaultImageUrl();
    }
    if (!imagePath || typeof imagePath !== "string") {
      return getRandomDefaultImageUrl();
    }
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\//, "");
    if (!cleanPath) {
      return getRandomDefaultImageUrl();
    }
    const baseUrl = IMAGE_BASE_URL.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const finalPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
    return `${baseUrl}/${finalPath}`;
  };

    const getSeatLayoutUrl = (imagePath) => {
        const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        if (!imagePath || typeof imagePath !== "string") {
            return "";
        }
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }
        const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\//, "");
        if (!cleanPath) {
             return "";
        }
        const baseUrl = IMAGE_BASE_URL ? (IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL) : '';
        const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
        return baseUrl ? `${baseUrl}/${finalPath}` : "";
    };


  const getLowestPrice = (ticketTypes) => {
    if (!ticketTypes || ticketTypes.length === 0) {
      return "N/A";
    }
    const prices = ticketTypes
      .map((ticket) => parseFloat(ticket.price))
      .filter((price) => !isNaN(price) && price > 0);
    if (prices.length === 0) return "Free";
    const lowestPrice = Math.min(...prices).toFixed(2);
    return `$${lowestPrice}`;
  };

  const handleAddToCart = async (itemsToAdd) => {
      console.log('[EventDetailPage] handleAddToCart called with items:', itemsToAdd);
      setIsAddingToCart(true);
      try {
          await Promise.all(itemsToAdd.map(item => addToCart(item)));
          alert("Selected seats added to cart!");
          // --- New: Re-fetch occupied seats after adding to cart ---
          console.log('[EventDetailPage] Successfully added to cart, re-fetching occupied seats...');
          const updatedOccupiedSeats = await getOccupiedSeatsByEventIdAPI(id);
          setOccupiedSeats(updatedOccupiedSeats);
          console.log('[EventDetailPage] Re-fetched occupied seats:', updatedOccupiedSeats);
          // --- End New ---

      } catch (err) {
          console.error("[EventDetailPage] Failed to add seats to cart:", err);
          alert("Failed to add seats to cart: " + (err.message || 'Unknown error'));
      } finally {
          setIsAddingToCart(false);
      }
  };


  if (loading) {
    console.log('[EventDetailPage] Rendering loading state...');
    return <div className={styles.loading}>Loading event details...</div>;
  }

  if (error) {
    console.log('[EventDetailPage] Rendering error state:', error);
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!event) {
     console.log('[EventDetailPage] Rendering not found state...');
    return <div className={styles.notFound}>Event not found.</div>;
  }

  const eventTitle = event.title || "Untitled Event";
  const eventImage = event.image || "";
  const eventVenue = event.venue || "";
  const eventDate = event.date || "";
  const eventTime = event.time || "";
  const eventEndTime = event.end_time || "";
  const eventStatus = event.status || "INACTIVE";
  const eventVenueLayout =
    event.venueseatinglayout || event.venueSeatingLayout || "";
  const eventDescription =
    event.short_description ||
    event.description ||
    event.des ||
    "No description available";

  const displayDate =
    eventDate === "Date TBA" ? eventDate : formatDate(eventDate);
  const displayTime =
    eventTime === "Time TBA" ? eventTime : formatTime(eventTime);
  const priceDisplay =
    ticketTypes.length > 0
      ? `From ${getLowestPrice(ticketTypes)}`
      : event.price
      ? `$${parseFloat(event.price).toFixed(2)}`
      : "Price not specified";

  const eventCategory = event.category || "";

  console.log('[EventDetailPage] Rendering main content.');
  console.log('[EventDetailPage] Seating Selector conditions:');
  console.log('  eventStatus === "ACTIVE":', eventStatus === "ACTIVE");
  console.log('  eventCategory:', eventCategory);
  console.log('  ticketTypes.length:', ticketTypes.length);
  console.log('  occupiedSeats.length:', occupiedSeats.length); // Log occupied seats count


  // Helper function to format time in a shorter "Hpm" or "H:MMpm" format
  const formatTimeShort = (timeString) => {
    if (!timeString) return "Time not specified";
    if (timeString === "Time TBA") return "Time TBA";

    try {
        const [hours, minutes] = timeString.split(':');
        // Use a fixed date for Date object to avoid date-related issues
        const date = new Date(`2000-01-01T${hours}:${minutes}:00`);

        // Use toLocaleTimeString to handle locale differences and AM/PM
        const formatted = date.toLocaleTimeString("en-AU", {
            hour: "numeric", // Use numeric hour (1-12)
            minute: "2-digit", // Keep 2-digit minutes
            hour12: true,
        });

        // Example formatted: "4:00 PM", "8:30 AM", "12:00 PM"
        // We want "4pm", "8:30am", "12pm"

        const [timePart, ampm] = formatted.split(' ');
        const [h, m] = timePart.split(':');

        let shortTime = h;
        // Only include minutes if they are not '00'
        if (m !== '00') {
            shortTime += `:${m}`;
        }
        // Append lowercase am/pm
        shortTime += ampm.toLowerCase();

        return shortTime;

    } catch (e) {
        console.error("Error formatting time short:", e);
        return timeString; // Return original string on error
    }
  };

  // Format start and end times for display
  const formattedStartTimeShort = formatTimeShort(eventTime);
  const formattedEndTimeShort = formatTimeShort(eventEndTime);

  // Construct the combined time display string
  let timeDisplayString = formattedStartTimeShort;
  if (eventTime !== "Time TBA" && eventEndTime && eventEndTime !== "Time TBA") {
      timeDisplayString = `${formattedStartTimeShort} - ${formattedEndTimeShort}`;
  } else if (eventEndTime && eventEndTime !== "Time TBA") {
       // If only end time is available (unlikely but handle)
       timeDisplayString = `Ends ${formattedEndTimeShort}`;
  }


  return (
    <div className={styles.eventDetailPage}>
      <div className={styles.eventHeader}>
        <h1 className={styles.eventTitle}>{eventTitle}</h1>
        <div className={styles.eventMeta}>
          <div className={styles.metaItem}>
            <i className="icon-calendar"></i> {displayDate}
          </div>
          {/* Combined Time Display */}
          <div className={styles.metaItem}>
            <i className="icon-clock"></i> {timeDisplayString}
          </div>
          <div className={styles.metaItem}>
            <i className="icon-location"></i> Venue: {eventVenue || "Location TBA"}
          </div>
          <div className={styles.metaItem}>
            <i className="icon-tag"></i> {priceDisplay}
          </div>
          {event.capacity && ( // Only show capacity if it exists
            <div className={styles.metaItem}>
              <i className="icon-users"></i> Capacity: {event.capacity} people
            </div>
          )}
          {eventStatus && (
            <div
              className={`${styles.statusTag} ${
                styles[eventStatus.toLowerCase()]
              }`}
            >
              {eventStatus}
            </div>
          )}
        </div>
      </div>

      <div className={styles.eventContent}>
        <div className={styles.imageSection}>
          <img
            src={getEventImageUrl(eventImage)}
            alt={eventTitle}
            className={styles.eventImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getRandomDefaultImageUrl();
            }}
          />
                  <div className={styles.eventDescription}>
            <h2>Event Description</h2>
            <div className={styles.descriptionText}>{eventDescription}</div>
          </div>
        </div>

        <div className={styles.infoSection}>


          {/* Display ticket type information (Optional, as seating selector replaces this) */}
          {/* You might remove this section if the seating layout is the primary way to see ticket info */}
          {/* Keeping this section might still be useful to show price/description per ticket type */}
          {ticketTypes.length > 0 && (
            <div className={styles.ticketTypesSection}>
              <h2>Ticket Information</h2> {/* Changed title */}
              <div className={styles.ticketTypesList}>
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.ticket_type_id || ticket.id || `ticket-${index}-${ticket.name}`}
                    className={styles.ticketTypeCard}
                  >
                    <div className={styles.ticketTypeHeader}>
                      <h3>{ticket.name}</h3>
                      <span className={styles.ticketPrice}>
                        {parseFloat(ticket.price) > 0
                          ? `$${parseFloat(ticket.price).toFixed(2)}`
                          : "Free"}
                      </span>
                    </div>
                    {/* Display description */}
                     {ticket.description && (
                      <p className={styles.ticketDescription}>
                        {ticket.description}
                      </p>
                    )}
                    {/* Display available quantity */}
                    {ticket.available_quantity !== undefined && (
                         <p className={styles.ticketAvailability}>
                            Available: {ticket.available_quantity}
                         </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seating Layout Selector Component */}
      {/* Render if event is active and has category and ticket types */}
      {eventStatus === "ACTIVE" && eventCategory && ticketTypes.length > 0 && (
          <> {/* Use a fragment to wrap the component and log */}
            {console.log('[EventDetailPage] Rendering SeatingLayoutSelector...')} {/* Log before rendering */}
            <SeatingLayoutSelector
                eventId={event.event_id || event.id} // Pass event ID
                category={eventCategory} // Pass the category string
                ticketTypes={ticketTypes} // Pass the ticket types array
                occupiedSeats={occupiedSeats} // --- New: Pass occupied seats ---
                onAddToCart={handleAddToCart} // Pass the handler function
            />
          </>
      )}
       {/* Display message if event is not active or no ticket types/category */}
       {eventStatus !== "ACTIVE" && (
           <div className={styles.unavailableMessage}>
               Tickets are not available for purchase for this event.
           </div>
       )}
        {eventStatus === "ACTIVE" && (!eventCategory || ticketTypes.length === 0) && (
           <div className={styles.unavailableMessage}>
               Seating information or ticket types are not available for this event.
           </div>
       )}
    </div>
  );
};

export default EventDetailPage;
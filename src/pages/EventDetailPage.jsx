import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { addToCart } from "../services/cartService";
import { getTicketTypesByEventIdAPI } from '../services/ticketTypeService';
import SeatingLayoutSelector from "../components/events/SeatingLayoutSelector"; // Import the new component
import styles from "./EventDetailPage.module.css";
import { getRandomDefaultImageUrl } from '../utils/defaultImages'; // 导入新创建的函数


const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  // Add state for ticket types
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [showTicketSelector, setShowTicketSelector] = useState(false); // No longer needed
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
            console.log('[EventDetailPage] Fetching event details with getEventById...'); // Log event fetch start
            const eventDataResponse = await getEventById(id);
            console.log('[EventDetailPage] getEventById success:', eventDataResponse); // Log successful event fetch

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
              console.error('[EventDetailPage] Invalid event data format received:', eventDataResponse); // Log invalid format
              throw new Error("Invalid event data format");
            }

            console.log('[EventDetailPage] Processed event data:', eventData); // Log processed event data
            setEvent(eventData);

            // Fetch ticket types separately
            console.log('[EventDetailPage] Fetching ticket types with getTicketTypesByEventIdAPI...'); // Log ticket types fetch start
            const ticketTypesData = await getTicketTypesByEventIdAPI(id);
            console.log('[EventDetailPage] getTicketTypesByEventIdAPI success:', ticketTypesData); // Log successful ticket types fetch

            // Ensure ticketTypesData is an array
            if (Array.isArray(ticketTypesData)) {
                 setTicketTypes(ticketTypesData);
            } else if (ticketTypesData && Array.isArray(ticketTypesData.data)) {
                 // Handle potential nested data structure from API
                 setTicketTypes(ticketTypesData.data);
            }
            else {
                 console.warn('[EventDetailPage] getTicketTypesByEventIdAPI returned non-array data:', ticketTypesData); // Warn about unexpected format
                 setTicketTypes([]); // Default to empty array on unexpected format
            }


        } catch (err) {
            console.error('[EventDetailPage] Error fetching data:', err); // Log fetch error
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
      // Handle direct date string format: "YYYY-MM-DD"
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day); // Month is 0-indexed

        return localDate.toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // If we can't parse it as a date, return the original string
      return dateString;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Return original string on error
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";
    // Assuming timeString is in "HH:MM" or "HH:MM:SS" format
    try {
      const [hours, minutes] = timeString.split(':');
      // Create a Date object using a fixed date to avoid date-related issues
      const date = new Date(`2000-01-01T${hours}:${minutes}:00`);


      return date.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return timeString; // Return original string on error
    }
  };


  // Helper function to get image URL
  const getEventImageUrl = (imagePath) => {
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use the base URL from env

    // Add a check for IMAGE_BASE_URL being defined
    if (!IMAGE_BASE_URL) {
        console.error("[EventDetailPage] VITE_API_BASE_URL is not defined in environment variables."); // Added context to log
        // Return a random default image URL if the base URL is missing
        return getRandomDefaultImageUrl(); // 使用随机默认图片
    }

    if (!imagePath || typeof imagePath !== "string") {
      // console.warn("Invalid image path:", imagePath);
      // Return a random default image URL
      return getRandomDefaultImageUrl(); // 使用随机默认图片
    }

    // If it's already a full URL, return it
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }


    // Remove leading "./" or "/" if present
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\//, "");

    if (!cleanPath) {
      return getRandomDefaultImageUrl(); // 使用随机默认图片
    }

    // Ensure base URL doesn't have a trailing slash and cleanPath doesn't have a leading slash
    const baseUrl = IMAGE_BASE_URL.endsWith("/")
      ? IMAGE_BASE_URL.slice(0, -1)
      : IMAGE_BASE_URL;
    const finalPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;

    return `${baseUrl}/${finalPath}`; // Construct the full URL
  };

    // Helper function to get seat layout image URL (保持不变，除非你也想对布局图使用随机默认图)
    const getSeatLayoutUrl = (imagePath) => {
        const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use the base URL from env


        if (!imagePath || typeof imagePath !== "string") {
            // console.warn("Invalid seat layout image path:", imagePath);
            return ""; // Return empty string if no valid path
        }

         // If it's already a full URL, return it
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }


        // Remove leading './' or '/' if present
        const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\//, "");

        if (!cleanPath) {
             return ""; // Return empty string if path is empty after cleaning
        }
        const baseUrl = IMAGE_BASE_URL ? (IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL) : '';
        const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

        // Only construct URL if baseUrl is available
        return baseUrl ? `${baseUrl}/${finalPath}` : ""; // Construct the full URL or return empty if base URL is missing
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

  // Define the handleAddToCart function in the parent component
  const handleAddToCart = async (itemsToAdd) => {
      console.log('[EventDetailPage] handleAddToCart called with items:', itemsToAdd); // Log received items
      setIsAddingToCart(true); // Set loading state

      try {

          await Promise.all(itemsToAdd.map(item => addToCart(item)));

          alert("Selected seats added to cart!");


      } catch (err) {
          console.error("[EventDetailPage] Failed to add seats to cart:", err); // Log error
          alert("Failed to add seats to cart: " + (err.message || 'Unknown error'));
      } finally {
          setIsAddingToCart(false); // Reset loading state
      }
  };


  if (loading) {
    console.log('[EventDetailPage] Rendering loading state...'); // Log loading state
    return <div className={styles.loading}>Loading event details...</div>;
  }

  if (error) {
    console.log('[EventDetailPage] Rendering error state:', error); // Log error state
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!event) {
     console.log('[EventDetailPage] Rendering not found state...'); // Log not found state
    return <div className={styles.notFound}>Event not found.</div>;
  }

  // Destructure event properties with fallbacks
  const eventTitle = event.title || "Untitled Event";
  const eventImage = event.image || "";
  const eventVenue = event.venue || "";
  const eventDate = event.date || "";
  const eventTime = event.time || "";
  const eventEndTime = event.end_time || "";

  const eventStatus = event.status || "INACTIVE";
  const eventVenueLayout =
    event.venueseatinglayout || event.venueSeatingLayout || "";

  // Event description - retain all possible field names
  const eventDescription =
    event.short_description ||
    event.description ||
    event.des ||
    "No description available";

  // Format for display
  const displayDate =
    eventDate === "Date TBA" ? eventDate : formatDate(eventDate);
  const displayTime =
    eventTime === "Time TBA" ? eventTime : formatTime(eventTime);
  const priceDisplay =
    ticketTypes.length > 0
      ? `From ${getLowestPrice(ticketTypes)}`
      : event.price // Fallback to event.price if no ticketTypes
      ? `$${parseFloat(event.price).toFixed(2)}` // Format event.price if it exists
      : "Price not specified";

  // Get category for seating layout
  const eventCategory = event.category || "";

  console.log('[EventDetailPage] Rendering main content.'); // Log main content render
  console.log('[EventDetailPage] Seating Selector conditions:'); // Log seating selector conditions
  console.log('  eventStatus === "ACTIVE":', eventStatus === "ACTIVE");
  console.log('  eventCategory:', eventCategory);
  console.log('  ticketTypes.length:', ticketTypes.length);


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
          <div className={styles.metaItem}>
            <i className="icon-users"></i> Capacity: {event.capacity ? `${event.capacity} people` : "Capacity TBA"}
          </div>
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


      {/* No longer needed */}
      {/* {eventStatus === "ACTIVE" && ticketTypes.length > 0 && (
        <div className={styles.buyButtonContainer}>
          <button
            className={styles.buyButton}
            onClick={() => setShowTicketSelector(true)}
          >
            Buy Tickets
          </button>
        </div>
      )} */}

      {/* No longer needed */}
      {/* {showTicketSelector && (
        <TicketSelector
          event={event}
          ticketTypes={ticketTypes}
          onClose={() => setShowTicketSelector(false)}
          onAddToCart={handleAddToCart}
        />
      )} */}
    </div>
  );
};

export default EventDetailPage;
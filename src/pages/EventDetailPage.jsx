import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { addToCart } from "../services/cartService"; // 导入更新后的 addToCart
import TicketSelector from "./TicketSelector";
import SeatingLayoutSelector from "../components/events/SeatingLayoutSelector"; // Import the new component
import styles from "./EventDetailPage.module.css";
// 导入随机默认图片函数
import { getRandomDefaultImageUrl } from '../utils/defaultImages'; // 导入新创建的函数


const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTicketSelector, setShowTicketSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getEventById(id)
      .then((data) => {
        // Handle different response formats
        let eventData;
        if (Array.isArray(data)) {
          eventData = data[0];
        } else if (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          eventData = data.data[0];
        } else if (data && (data.event_id || data.id)) {
          eventData = data;
        } else {
          throw new Error("Invalid event data format");
        }

        setEvent(eventData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    try {
      // Handle direct date string format: "2022-02-02"
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-AU", {
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
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));

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
        console.error("VITE_API_BASE_URL is not defined in environment variables.");
        // Return a random default image URL if the base URL is missing
        return getRandomDefaultImageUrl(); // 使用随机默认图片
    }

    if (!imagePath || typeof imagePath !== "string") {
      // console.warn("Invalid image path:", imagePath);
      // Return a random default image URL
      return getRandomDefaultImageUrl(); // 使用随机默认图片
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

        // Add a check for IMAGE_BASE_URL being defined
         if (!IMAGE_BASE_URL) {
            console.error("VITE_API_BASE_URL is not defined in environment variables.");
            return ""; // Return empty string if the base URL is missing
        }


        if (!imagePath || typeof imagePath !== "string") {
            // console.warn("Invalid seat layout image path:", imagePath);
            return ""; // Return empty string if no valid path
        }

        // Remove leading './' or '/' if present
        const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\//, "");

        if (!cleanPath) {
             return ""; // Return empty string if path is empty after cleaning
        }

        // Ensure base URL doesn't have a trailing slash and cleanPath doesn't have a leading slash
        const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

        return `${baseUrl}/${finalPath}`; // Construct the full URL
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

  // No longer needed
  // const handleAddToCart = (cartItems) => {
  //   // cartItems 是 TicketSelector 准备的项目数组 [{ eventId, ticketTypeId, quantity, ... }]
  //   // 我们的 addToCart API 假设一次添加一个项目，所以需要遍历调用
  //   console.log("尝试将项目添加到购物车:", cartItems);
  //   Promise.all(cartItems.map((item) => addToCart(item))) // 调用更新后的 addToCart
  //     .then(() => {
  //       alert("Tickets added to cart!");
  //       setShowTicketSelector(false);
  //       // 添加成功后，可以考虑刷新购物车 UI 或导航到购物车页面
  //       // navigate('/user/cart'); // 可选：导航到购物车页面
  //     })
  //     .catch((err) => {
  //       alert("Failed to add to cart: " + (err.message || '未知错误'));
  //       console.error("添加购物车失败:", err);
  //     });
  // };

  if (loading) {
    return <div className={styles.loading}>Loading event details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!event) {
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

  // Ticket types
  const ticketTypes = event.ticketTypes || [];

  // Calculate price display
  const priceDisplay =
    ticketTypes.length > 0
      ? `From ${getLowestPrice(ticketTypes)}`
      : event.price
      ? event.price
      : "Price not specified";

  // Get category for seating layout (still useful for display, but not for layout generation in the new component)
  const eventCategory = event.category || "";


  return (
    <div className={styles.eventDetailPage}>
      <div className={styles.eventHeader}>
        <h1 className={styles.eventTitle}>{eventTitle}</h1>
        <div className={styles.eventMeta}>
          <div className={styles.metaItem}>
            <i className="icon-calendar"></i> {displayDate}
          </div>
          <div className={styles.metaItem}>
            <i className="icon-clock"></i> {displayTime}
          </div>
          <div className={styles.metaItem}>
            <i className="icon-location"></i> {eventVenue || "Location TBA"}
          </div>
          {eventCategory && (
            <div className={styles.metaItem}>
              <i className="icon-tag"></i> {eventCategory}
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
              // 使用随机默认图片，如果图片加载失败
              e.target.src = getRandomDefaultImageUrl();
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.eventDescription}>
            <h2>Event Description</h2>
            <div className={styles.descriptionText}>{eventDescription}</div>
          </div>

          <div className={styles.eventDetails}>
            <h2>Event Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>{displayDate}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Time</span>
                <span className={styles.detailValue}>{displayTime}</span>
              </div>

              {eventEndTime && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>End Time</span>
                  <span className={styles.detailValue}>
                    {/* Assuming eventEndTime is also a time string, adjust if it's a full date */}
                    {formatTime(eventEndTime)}
                  </span>
                </div>
              )}


              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Venue</span>
                <span className={styles.detailValue}>
                  {eventVenue || "TBA"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Price</span>
                <span className={styles.detailValue}>{priceDisplay}</span>
              </div>
              {event.capacity && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capacity</span>
                  <span className={styles.detailValue}>
                    {event.capacity} people
                  </span>
                </div>
              )}
              {eventCategory && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>{eventCategory}</span>
                </div>
              )}
            </div>
          </div>

          {/* Display ticket type information (Optional, as seating selector replaces this) */}
          {/* You might remove this section if the seating layout is the primary way to see ticket info */}
          {ticketTypes.length > 0 && (
            <div className={styles.ticketTypesSection}>
              <h2>Ticket Information (by Type)</h2> {/* Changed title */}
              <div className={styles.ticketTypesList}>
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.id || `ticket-${index}-${ticket.name}`}
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
                    {/* Display description (seat number) if it exists */}
                     {ticket.description && (
                      <p className={styles.ticketDescription}>
                        Seat: {ticket.description}
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

          {/* Display venue seating layout image if available */}
          {eventVenueLayout && (
            <div className={styles.venueLayout}>
              <h3>Venue Seating Layout Image (Reference)</h3> {/* Changed title */}
              <img
                src={getSeatLayoutUrl(eventVenueLayout)}
                alt="Venue Seating Layout"
                className={styles.layoutImage}
                onClick={() =>
                  window.open(getSeatLayoutUrl(eventVenueLayout), "_blank")
                }
                onError={(e) => {
                  e.target.onerror = null;
                  // Use a default image or hide if layout image fails to load
                  e.target.style.display = 'none'; // Hide the broken image
                  console.error("Failed to load venue seating layout image:", getSeatLayoutUrl(eventVenueLayout));
                }}
              />
               <p className={styles.clickToEnlarge}>Click image to enlarge</p>
            </div>
          )}


        </div>
      </div>

      {/* Seating Layout Selector Component */}
      {/* Render if event is active and has ticket types */}
      {eventStatus === "ACTIVE" && ticketTypes.length > 0 && (
          <SeatingLayoutSelector
              eventId={event.event_id || event.id} // Pass event ID
              ticketTypes={ticketTypes} // Pass the ticket types array
          />
      )}
       {/* Display message if event is not active or no ticket types */}
       {eventStatus !== "ACTIVE" && (
           <div className={styles.unavailableMessage}>
               Tickets are not available for purchase for this event.
           </div>
       )}
        {eventStatus === "ACTIVE" && ticketTypes.length === 0 && (
           <div className={styles.unavailableMessage}>
               No ticket types available for this event.
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
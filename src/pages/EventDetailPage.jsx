import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { addToCart } from "../services/cartService";
import TicketSelector from "./TicketSelector";
import styles from "./EventDetailPage.module.css";

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
    } catch (err) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";

    // If the time is already in HH:MM format, return it directly
    if (typeof timeString === "string" && timeString.includes(":")) {
      return timeString;
    }

    try {
      // Try to parse as a full date and extract time
      const date = new Date(`2022-01-01T${timeString}`);

      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return timeString;
    } catch (err) {
      return timeString;
    }
  };

  // Check if the image URL is a valid HTTP/HTTPS link
  const isValidImageUrl = (url) => {
    if (!url) return false;

    // Check if it's a standard HTTP/HTTPS URL
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Get a safe image URL, use default image if invalid

  const IMAGE_BASE_URL = "http://23.22.158.203:8080";
  const getEventImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;

    const cleanPath = imageUrl.replace(/^\.\//, "").replace(/^\/+/, "");
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  };

  // Get a safe seating layout image URL
  // const getSeatLayoutUrl = (imageUrl) => {
  //   if (isValidImageUrl(imageUrl)) {
  //     return imageUrl;
  //   }
  //   return "https://plus.unsplash.com/premium_photo-1724753996107-a35012f43bae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // };
  const getSeatLayoutUrl = (imagePath) => {
    if (!imagePath) {
      return "https://plus.unsplash.com/premium_photo-1724753996107-a35012f43bae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `http://23.22.158.203:8080${imagePath.replace("./", "/")}`;
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

  const handleAddToCart = (cartItems) => {
    Promise.all(cartItems.map((item) => addToCart(item)))
      .then(() => {
        alert("Tickets added to cart!");
        setShowTicketSelector(false);
      })
      .catch((err) => {
        alert("Failed to add to cart: " + err.message);
      });
  };

  const handleBuyNow = (cartItems) => {
    Promise.all(cartItems.map((item) => addToCart(item)))
      .then(() => {
        setShowTicketSelector(false);
        navigate("/user/checkout");
      })
      .catch((err) => {
        alert("Failed to process: " + err.message);
      });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading event information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/events" className={styles.backButton}>
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.errorContainer}>
        <h2>Event Not Found</h2>
        <p>
          Sorry, we couldn't find the event you're looking for. It may have been
          removed or the link is invalid.
        </p>
        <Link to="/events" className={styles.backButton}>
          Back to Events
        </Link>
      </div>
    );
  }

  // Extract event properties with appropriate fallbacks
  const eventId = event.event_id || event.id;
  const eventTitle = event.title || "";
  const eventImage = event.image || "";
  const eventVenue = event.venue || "";
  const eventCapacity = event.capacity || "";
  const eventCategory = event.category || "";

  // Event date and time fields
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
          {/* <img 
            src={getEventImageUrl(eventImage)} 
            alt={eventTitle} 
            className={styles.eventImage} 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; 
            }}
          /> */}
          <img
            src={getEventImageUrl(eventImage)}
            alt={eventTitle}
            className={styles.eventImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
            }}
          />

          {eventVenueLayout && (
            <div className={styles.venueLayout}>
              <h3>Venue Seating Layout</h3>
              <img
                src={getSeatLayoutUrl(eventVenueLayout)}
                alt="Venue Seating Layout"
                className={styles.layoutImage}
                onClick={() =>
                  window.open(getSeatLayoutUrl(eventVenueLayout), "_blank")
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://plus.unsplash.com/premium_photo-1724753996107-a35012f43bae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                }}
              />
            </div>
          )}
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
                    {formatDate(eventEndTime)}
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
              {eventCapacity && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capacity</span>
                  <span className={styles.detailValue}>
                    {eventCapacity} people
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

          {/* Display ticket type information */}
          {ticketTypes.length > 0 && (
            <div className={styles.ticketTypesSection}>
              <h2>Ticket Information</h2>
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
                    {ticket.description && (
                      <p className={styles.ticketDescription}>
                        {ticket.description}
                      </p>
                    )}
                    <div className={styles.ticketAvailability}>
                      <span>Available: </span>
                      <span
                        className={
                          parseInt(
                            ticket.available_quantity ||
                              ticket.availableQuantity ||
                              0
                          ) > 10
                            ? styles.available
                            : styles.limited
                        }
                      >
                        {parseInt(
                          ticket.available_quantity ||
                            ticket.availableQuantity ||
                            0
                        ) > 0
                          ? ticket.available_quantity ||
                            ticket.availableQuantity
                          : "Sold Out"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actionSection}>
            <button
              className={styles.buyButton}
              onClick={() => setShowTicketSelector(true)}
              disabled={eventStatus !== "ACTIVE"}
            >
              {eventStatus === "ACTIVE"
                ? "Buy Tickets"
                : "Currently Unavailable"}
            </button>
            <Link to="/events" className={styles.backButton}>
              Back to Events
            </Link>
          </div>
        </div>
      </div>

      {showTicketSelector && (
        <div className={styles.overlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowTicketSelector(false)}
            >
              ×
            </button>
            <h2>Select Tickets</h2>
            <TicketSelector
              eventId={id}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;

import { getCurrentUser } from '../authService/user-service';
import { ERROR_MESSAGES, DEFAULT_VALUES } from './config';

/**
 * Validate user identity and get user ID
 * @returns {string} User ID
 * @throws {Error} If user is not logged in or ID is missing
 */
export const validateUserAndGetId = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error(ERROR_MESSAGES.USER_NOT_LOGGED_IN);
  }

  const userId = currentUser.user_id;
  if (!userId) {
    console.warn("User ID missing, cannot perform cart operation", currentUser);
    throw new Error(ERROR_MESSAGES.USER_ID_NOT_FOUND);
  }

  return userId;
};

/**
 * Maps backend cart item object to frontend format.
 * Assumes the API response for GET /cart/:userId includes nested event_details and ticket_type_details.
 * @param {Object} item - The raw cart item object from the API.
 * @returns {Object} The mapped cart item object for the frontend.
 */
export const mapCartItemFromApi = (item) => {
  if (!item) {
    console.warn('[cartService/utils.js] mapCartItemFromApi received null/undefined item');
    return null;
  }

  // Extract nested details with fallback checks
  const eventDetails = item.event_details || {};
  const ticketTypeDetails = item.ticket_type_details || {};

  // Quantity is implicitly 1 per item in the new structure
  const quantity = 1;
  const pricePerTicket = parseFloat(ticketTypeDetails.price) || DEFAULT_VALUES.PRICE;
  const totalPrice = pricePerTicket * quantity;

  return {
    // Basic cart item details
    id: item.cart_item_id, // Use cart_item_id as the unique ID for frontend
    cartItemId: item.cart_item_id, // Keep original API field name as well
    ticketTypeId: item.ticket_type_id,
    userId: item.user_id,
    quantity: quantity, // Fixed quantity to 1
    seat: item.seat || null, // Map the seat field
    addedAt: item.added_at,

    // Event Details (flattened from nested event_details)
    eventId: eventDetails.event_id || null,
    eventName: eventDetails.title || DEFAULT_VALUES.EVENT_NAME,
    // Map the image path directly. Component rendering the image should handle full URL construction.
    eventImage: eventDetails.image || DEFAULT_VALUES.EVENT_IMAGE,
    eventDate: eventDetails.date || DEFAULT_VALUES.DATE,
    eventTime: eventDetails.time || DEFAULT_VALUES.TIME,
    eventEndTime: eventDetails.end_time || null,
    eventVenue: eventDetails.venue || DEFAULT_VALUES.VENUE,
    eventCategory: eventDetails.category || null,
    eventStatus: eventDetails.status || 'UNKNOWN',

    // Ticket Type Details (flattened from nested ticket_type_details)
    ticketTypeName: ticketTypeDetails.name || DEFAULT_VALUES.TICKET_TYPE_NAME,
    ticketTypeDescription: ticketTypeDetails.description || '',
    pricePerTicket: pricePerTicket, // Use the parsed price
    ticketTypeAvailableQuantity: ticketTypeDetails.available_quantity !== undefined ? ticketTypeDetails.available_quantity : 0,

    // Calculated total price for this item
    totalPrice: totalPrice,
  };
};


/**
 * Creates request body for adding an item to the cart.
 * @param {Object} params - Parameters object
 * @param {string} params.userId - User ID
 * @param {string} params.ticketTypeId - Ticket Type ID
 * @param {number} params.quantity - Quantity (should be 1 for seat-based tickets)
 * @param {string} [params.seat] - Seat information (optional, required for seated tickets)
 * @returns {Object} Request body
 */
export const createCartRequestBody = ({ userId, ticketTypeId, quantity, seat }) => {
  const body = {
    user_id: userId,
    ticket_type_id: ticketTypeId,
    quantity: String(quantity), // Ensure quantity is a string ("1")
  };
  // Add seat to body if provided
  if (seat) {
      body.seat = seat;
  }
  return body;
};


/**
 * Checks if the API response indicates success.
 * This is a general utility function.
 * @param {Object} response - API response object
 * @returns {boolean} Whether it's successful
 */
export const isApiResponseSuccess = (response) => {
  // Check for common success indicators:
  // 1. response object exists and is not null
  // 2. response has a 'success' field that is true
  // 3. OR response has a 'message' field that is 'ok' (specific to some APIs like your cart)
  // 4. OR response does NOT have an 'error' field and 'message' is not 'error' (general check for lack of explicit error)
  return response !== undefined && response !== null && (
    response.success === true ||
    response.message === 'ok' || // Keep this for compatibility with your cart API
    (response.message !== "error" && !response.error) // More general check
  );
};

/**
 * Checks if the API response indicates a duplicate key error.
 * @param {Object} response - API response object
 * @returns {boolean} Whether it's a duplicate key error
 */
export const isDuplicateKeyError = (response) => {
  // Adjust based on your backend's actual duplicate key error response
  // Example: check for a specific status code or error message content
  return response && response.error && response.error.includes('duplicate key'); // Example check
};


/**
 * Logs cart operation details.
 * @param {string} operation - Operation type (e.g., 'ADD_TO_CART', 'REMOVE_FROM_CART')
 * @param {string} status - Status ('STARTED', 'FINISHED', 'FAILED')
 * @param {Object} [details] - Additional details
 */
export const logCartOperation = (operation, status, details) => {
  console.log(`[CartService] ${operation} ${status}`, details || '');
};
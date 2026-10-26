
const STORAGE_KEY = "eventnest_bookings_v1";

// Get all saved bookings
export function getBookings() {
  try {
    const storedBookings = localStorage.getItem(STORAGE_KEY);

    return storedBookings ? JSON.parse(storedBookings) : [];
  } catch (error) {
    console.error("Failed to load bookings:", error);
    return [];
  }
}

// Save bookings to localStorage
export function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

    // Notify other components that bookings have changed
    window.dispatchEvent(new Event("eventnest-bookings-updated"));

    return true;
  } catch (error) {
    console.error("Failed to save bookings:", error);
    return false;
  }
}

// Check whether a venue is already booked on a particular date
export function isDateBooked(venueId, date, bookings = getBookings()) {
  return bookings.some(
    (booking) =>
      String(booking.venueId) === String(venueId) &&
      booking.date === date &&
      booking.status === "confirmed"
  );
}

// Get bookings for a particular venue
export function getBookingsByVenue(venueId) {
  return getBookings().filter(
    (booking) => String(booking.venueId) === String(venueId)
  );
}

// Get bookings for a particular date
export function getBookingsByDate(date) {
  return getBookings().filter((booking) => booking.date === date);
}

// Find a booking by its ID
export function getBookingById(bookingId) {
  return getBookings().find(
    (booking) => String(booking.id) === String(bookingId)
  ) || null;
}

// Add a new booking
export function addBooking(newBooking) {
  const bookings = getBookings();

  const booking = {
    ...newBooking,
    id: newBooking.id || `booking_${Date.now()}`,
    status: newBooking.status || "confirmed",
    createdAt: newBooking.createdAt || new Date().toISOString(),
  };

  // Prevent duplicate confirmed bookings for the same venue and date
  if (isDateBooked(booking.venueId, booking.date, bookings)) {
    return {
      success: false,
      message: "This venue is already booked for the selected date.",
      booking: null,
    };
  }

  const updatedBookings = [...bookings, booking];
  const saved = saveBookings(updatedBookings);

  return {
    success: saved,
    message: saved
      ? "Booking saved successfully."
      : "Unable to save booking.",
    booking: saved ? booking : null,
  };
}

// Update an existing booking
export function updateBooking(bookingId, updates) {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(
    (booking) => String(booking.id) === String(bookingId)
  );

  if (bookingIndex === -1) {
    return false;
  }

  const updatedBookings = bookings.map((booking, index) =>
    index === bookingIndex ? { ...booking, ...updates } : booking
  );

  return saveBookings(updatedBookings);
}

// Cancel a booking
export function cancelBooking(bookingId) {
  return updateBooking(bookingId, {
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
  });
}

// Delete a booking permanently
export function deleteBooking(bookingId) {
  const updatedBookings = getBookings().filter(
    (booking) => String(booking.id) !== String(bookingId)
  );

  return saveBookings(updatedBookings);
}

// Clear all bookings (use carefully)
export function clearAllBookings() {
  return saveBookings([]);
}

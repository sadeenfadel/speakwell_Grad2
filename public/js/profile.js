function openBookingModal(therapistName) {
    document.getElementById('therapistName').innerText = therapistName;
    document.getElementById('bookingModal').style.display = 'block';
  }
  
  function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
  }
  
  function confirmBooking() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const therapistName = document.getElementById('therapistName').innerText;
  
    if (date && time) {
      alert(`Appointment confirmed with ${therapistName} on ${date} at ${time}`);
      closeBookingModal();
    } else {
      alert('Please select both a date and a time.');
    }
  }
  
  // Close the modal when clicking outside of it
  window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
  
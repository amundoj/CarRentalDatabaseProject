// Rent a vehicle
async function rentVehicle(vehicleId) {
  try {
    const endDate = prompt("Enter end date (YYYY-MM-DD):");
    if (!endDate) return;

    const res = await fetch(`/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId, endDate })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Vehicle rented successfully!');
      window.location.reload();
    } else {
      alert(data.error || 'Failed to rent vehicle');
    }
  } catch (err) {
    console.error(err);
    alert('Error renting vehicle');
  }
}

// Cancel a rental
async function cancelRental(vehicleId) {
  const rentalId = document.getElementById(`rental-id-${vehicleId}`).value;
  if (!rentalId) {
    alert('No rental found');
    return;
  }

  if (!confirm('Are you sure you want to cancel this rental?')) return;

  try {
    const res = await fetch(`/rentals/${rentalId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (res.ok) {
      alert('Rental cancelled successfully!');
      window.location.reload();
    } else {
      alert(data.error || 'Failed to cancel rental');
    }
  } catch (err) {
    console.error(err);
    alert('Error cancelling rental');
  }
}

// Navigation shortcuts
function goToPopular() { window.location.href = '/vehicles/popular'; }
function goToRented() { window.location.href = '/vehicles/rented'; }
function goToService() { window.location.href = '/vehicles/service'; }
function goToCruise() { window.location.href = '/vehicles/cruise-control'; }
function goToAll() { window.location.href = '/vehicles'; }

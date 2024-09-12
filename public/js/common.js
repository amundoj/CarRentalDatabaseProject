// Function to rent a vehicle by vehicleId
function rentVehicle(vehicleId) {
  fetch('/vehicles/rent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ vehicleId: vehicleId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      window.location.reload(); // Reload the page after successful rental
    } else {
      alert(data.error); // Display an error message if something went wrong
    }
  })
  .catch(error => console.error('Error:', error)); // Log any errors in the console
}

// Function to cancel a rental by vehicleId
function cancelRental(vehicleId) {
  fetch('/vehicles/cancel-rental', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ vehicleId: vehicleId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      window.location.reload(); // Reload the page after successful cancellation
    } else {
      alert(data.error); // Display an error message if something went wrong
    }
  })
  .catch(error => console.error('Error:', error)); // Log any errors in the console
}

// Function to fetch popular vehicle types
function fetchPopularVehicleTypes() {
  window.location.href = '/vehicles/popular'; // Redirect to the popular vehicles page
}

// Function to fetch currently rented vehicles
function fetchCurrentlyRentedVehicles() {
  window.location.href = '/vehicles/rented'; // Redirect to the rented vehicles page
}

// Function to fetch vehicles requiring service
function fetchVehiclesRequiringService() {
  window.location.href = '/vehicles/service'; // Redirect to the vehicles requiring service page
}

// Function to fetch vehicles with cruise control
function fetchVehiclesWithCruiseControl() {
  window.location.href = '/vehicles/cruise-control'; // Redirect to the vehicles with cruise control page
}

// Function to fetch all vehicles
function fetchAllVehicles() {
  window.location.href = '/vehicles'; // Redirect to the all vehicles page
}

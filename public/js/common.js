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
      window.location.reload();
    } else {
      alert(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

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
      window.location.reload();
    } else {
      alert(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

function fetchPopularVehicleTypes() {
  window.location.href = '/vehicles/popular';
}

function fetchCurrentlyRentedVehicles() {
  window.location.href = '/vehicles/rented';
}

function fetchVehiclesRequiringService() {
  window.location.href = '/vehicles/service';
}

function fetchVehiclesWithCruiseControl() {
  window.location.href = '/vehicles/cruise-control';
}

function fetchAllVehicles() {
  window.location.href = '/vehicles';
}

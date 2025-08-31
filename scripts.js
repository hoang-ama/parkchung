document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const location = document.getElementById('location').value.trim();
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;

    if (!location) {
        alert('Please enter a location.');
        return;
    }

    if (new Date(startDate + 'T' + startTime) >= new Date(endDate + 'T' + endTime)) {
        alert('End time must be after start time.');
        return;
    }

    alert(`Searching parking spots at "${location}" from ${startDate} ${startTime} to ${endDate} ${endTime}.`);
    // TODO: Redirect or make API call with search parameters
});

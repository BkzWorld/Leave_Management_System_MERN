document.addEventListener('DOMContentLoaded', function() {
    const applyLeaveButton = document.getElementById('apply-leave-btn');
    const applyAnotherLeaveButton = document.getElementById('apply-another-leave-btn');
  
    // Function to show/hide the appropriate buttons based on leave history
    function updateButtonVisibility() {
      const leaveHistoryList = document.getElementById('leave-history-list');
      const leaveHistoryItems = leaveHistoryList.getElementsByTagName('li');
      if (leaveHistoryItems.length > 0) {
        applyLeaveButton.style.display = 'none';
        applyAnotherLeaveButton.style.display = 'block';
      } else {
        applyLeaveButton.style.display = 'block';
        applyAnotherLeaveButton.style.display = 'none';
      }
    }
  
    applyLeaveButton.addEventListener('click', function() {
      // Redirect to the Leave_Application.html page when the button is clicked
      window.location.href = 'Leave_Application.html';
    });
  
    applyAnotherLeaveButton.addEventListener('click', function() {
      // Redirect to the Leave_Application.html page when the button is clicked
      window.location.href = 'Leave_Application.html';
    });
  
    // Populate leave history dynamically (sample data for demonstration)
    const leaveHistoryList = document.getElementById('leave-history-list');
    const leaveHistory = [
      { type: 'CASUAL', fromDate: '2023-07-01', toDate: '2023-07-03' },
      { type: 'MEDICAL', fromDate: '2023-07-10', toDate: '2023-07-12' },
      // Add more leave history items as needed
    ];
  
    leaveHistory.forEach((leave) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${leave.type} Leave: ${leave.fromDate} to ${leave.toDate}`;
      leaveHistoryList.appendChild(listItem);
    });
  
    // Show/hide the appropriate buttons on page load
    updateButtonVisibility();
  });
  
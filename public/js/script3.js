document.addEventListener('DOMContentLoaded', function() {
    const showBalanceBtn = document.getElementById('show-balance-btn');
    const leaveBalanceSection = document.getElementById('leave-balance');
    const applyLeaveBtn = document.getElementById('apply-leave-btn');
    const applyAnotherLeaveBtn = document.getElementById('apply-another-leave-btn');
  
    // Show leave balance
    showBalanceBtn.addEventListener('click', function() {
      leaveBalanceSection.style.display = 'block';
    });
  
    // Check if there are leave records in the table
    const leaveTable = document.querySelector('.table tbody');
    if (leaveTable && leaveTable.children.length > 0) {
      applyLeaveBtn.style.display = 'none';
      applyAnotherLeaveBtn.style.display = 'block';
    }
  
    // Apply Another Leave button click event
    applyAnotherLeaveBtn.addEventListener('click', function() {
      // Handle the action for applying another leave
    });
  });
  
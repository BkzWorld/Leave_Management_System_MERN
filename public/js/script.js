

var mainSelection = document.getElementById('user-type');
var adminSection = document.getElementById('admin-section');
var employeeSection = document.getElementById('employee-section');
mainSelection.addEventListener('change', userType);
function userType() {
    if (mainSelection.value == 'EMPLOYEE'){
        adminSection.style.display = 'none';
        employeeSection.style.display = 'block';
    }
    else if (mainSelection.value == 'ADMIN'){
        employeeSection.style.display = 'none';
        adminSection.style.display = 'block';
    }
    else{
        adminSection.style.display = 'none';
        employeeSection.style.display = 'none';
    }
}
  
// document.addEventListener('DOMContentLoaded', function() {
//     const userTypeSelect = document.getElementById('user-type');
//     const adminSection = document.getElementById('admin-section');
//     const employeeSection = document.getElementById('employee-section');
  
//     userTypeSelect.addEventListener('change', function() {
//       const userType = userTypeSelect.value;
  
//       if (userType === 'ADMIN') {
//         adminSection.style.display = 'block';
//         employeeSection.style.display = 'none';
//       } else if (userType === 'EMPLOYEE') {
//         adminSection.style.display = 'none';
//         employeeSection.style.display = 'block';
//       } else {
//         adminSection.style.display = 'none';
//         employeeSection.style.display = 'none';
//       }
//     });
  
//     const loginForm = document.getElementById('register-form');
//     loginForm.addEventListener('submit', function(event) {
//       event.preventDefault();
//     //   const email = document.getElementById('email').value;
//     //   const password = document.getElementById('password').value;
//       const userType = document.getElementById('user-type').value;
  
//       let adminType = null;
//       let employeeType = null;
  
//       if (userType === 'ADMIN') {
//         adminType = document.getElementById('admin-type').value;
//       } else if (userType === 'EMPLOYEE') {
//         employeeType = document.getElementById('employee-type').value;
//       }
  
//       // You can now perform login/authentication actions here.
//       // Send the data to the backend server for validation and processing.
//     });
//   });
  
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
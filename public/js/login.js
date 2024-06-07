const log_in = document.querySelector('#log-in-btn');
const sign_up = document.querySelector('#sign-up-btn');
const container = document.querySelector('.container');

const log_in2 = document.querySelector('#sign-in-btn2');
const sign_up2 = document.querySelector('#sign-up-btn2');

sign_up.addEventListener('click', () => {
  container.classList.add('sign-up-mode');
});

log_in.addEventListener('click', () => {
  container.classList.remove('sign-up-mode');
});

sign_up2.addEventListener('click', () => {
  container.classList.add('sign-up-mode2');
});

log_in2.addEventListener('click', () => {
  container.classList.remove('sign-up-mode2');
});

/* Handle form submissions 

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('signup-userType').value;
    const specialization = document.getElementById('signup-specialization').value;

    console.log({ userName, email, password, userType, specialization });  // Debug log

    const res = await fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, email, password, userType, specialization }),
    });

    const data = await res.json();
    if (res.ok) {
        alert('Sign up successful!');
    } else {
        alert(data.message);
    }
});
*/
document
  .getElementById('signup-userType')
  .addEventListener('change', function () {
    if (this.value === 'therapist') {
      document.getElementById('specialization-input').style.display = 'block';
    } else {
      document.getElementById('specialization-input').style.display = 'none';
    }
  });
/*
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const userType = document.getElementById('login-userType').value;

    const res = await fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password, userType }),
    });
    const data = await res.json();
    if (res.ok) {
        if (data.role === 'parent') {
            window.location.href = '/public/PAGES/CHILD/child.html';
        } else if (data.role === 'therapist') {
            window.location.href = '/public/PAGES/therapist/Therapist _Profile.html';
        }
    } else {
        alert('Login failed: ' + data.message);
    }
});

*/

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 3) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      },
      withCredentials: true,
      credentials: 'include'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error', err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};

const loginForm = document.querySelector('.login--form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}

const logout = async () => {
  console.log('logout in login.js');
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      // Redirect to home page after successful logout
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error in logging out! Try again.');
  }
};

// Get the logout button using the correct class name
const logoutBtn = document.querySelector('.nav__el--logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
  });
}

const signup = async (name, email, password, passwordConfirm, role) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role
      }
    });
    if ((res.data.status = 'success')) {
      showAlert('success', 'Account created successfully!', 1);
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('passwordConfirm').value = '';
      document.getElementById('role').value = '';
    }


  } catch (err) {
    showAlert('error', 'Error in signing up! Try again.');
  }
};

const signupBtn = document.querySelector('.signup--form');

if (signupBtn) {
  signupBtn.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.signup--button').innerHTML =
      'Creating account.....';
    document.querySelector('.signup--button').disabled = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.getElementById('role').value;
    await signup(name, email, password, passwordConfirm, role);    
    document.querySelector('.signup--button').innerHTML =
    'Register';
    document.querySelector('.signup--button').disabled = false;
  });
}

// Update Settings
// const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `http://127.0.0.1:3000/api/v1/users/updateMe`,
//       data: {
//         name,
//         email
//       }
//     });
//     if (res.data.status === 'success') {
//       showAlert('success', `Name And Email Updated successfully!`);
//     }
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err.response.data.message);
//   }
// };

const updateData = async data => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updateMe`,
      data: data,
      withCredentials: true,
      credentials: 'include'
    });
    if (res.data.status === 'success') {
      showAlert('success', `User Updated successfully!`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const updateDataBtn = document.querySelector('.form-user-data');

if (updateDataBtn) {
  console.log('updateDataBtn');
  updateDataBtn.addEventListener('submit', async event => {
    event.preventDefault();
    document.querySelector('.btn-update-settings').innerHTML =
      'Updating settings.....';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    await updateData(form);

    document.querySelector('.btn-update-settings').innerHTML =
      'Save Settings';
  });
}

// Update Settings
const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  console.log('updatePassword');
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updatePassword`,
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      },
      withCredentials: true,
      credentials: 'include'
    });
    if (res.data.status === 'success') {
      showAlert('success', `Password Updated Successfully!`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const updatePasswordBtn = document.querySelector('.form-user-settings');

if (updatePasswordBtn) {
  console.log('updatePasswordBtn');
  updatePasswordBtn.addEventListener('submit', async event => {
    document.querySelector('.btn-update-password').innerHTML =
      'Updating password.....';
    event.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(passwordCurrent, password, passwordConfirm);
    await updatePassword(passwordCurrent, password, passwordConfirm);

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn-update-password').innerHTML = 'Save password';
  });
}
//-----------------------------------------------------------------------------

const stripe = Stripe(
  'pk_test_51QcOvRRxa5iP2FI39OyeYuHBwsBkAB2v4YyCOOAcU87JlRoqNjuHOyMilZ8BaUj1wWzYal1sQn1gXksMEAGR5kMr003bz2NnXK'
);

const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    //const tourId = e.target.dataset.tourId;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

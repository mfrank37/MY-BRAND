const AUTH = firebase.auth();
const SIGNIN_FORM = document.querySelector('.signin-form');

SIGNIN_FORM.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const email = evt.target.email.value;
  const pass = evt.target.password.value;

  AUTH.signInWithEmailAndPassword(email, pass)
    .then((USER) => {
      location.assign('admin.html');
    }).catch(e => {
      let message;
      switch (e.code) {
        case 'auth/user-not-found':
          message = 'Email or Password is incorrect. Please try again';
          break;
        case 'auth/wrong-password':
          message = 'Password is incorrect. Please try again';
          break;
        default:
          message = e.message;
          break;
      }
      notifySignInErrors(message);
    });
});

// display error notification
function notifySignInErrors(message) {
  let errorMessage = document.querySelector('.login-error-message');
  errorMessage.innerHTML = message;
  setTimeout(() => {
    errorMessage.innerHTML = '';
  }, 7000);
}
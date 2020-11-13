const AUTH = firebase.auth();

AUTH.onAuthStateChanged(USER => {
  if (!USER) {
    location.assign('signin.html');
  }
});

const Signout = document.querySelector('#signout');
Signout.addEventListener('click', () => {
  AUTH.signOut();
});
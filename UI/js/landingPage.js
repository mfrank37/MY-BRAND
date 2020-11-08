let contactForm = document.querySelector('.ask-me .ask-form');
let subscribeForm = document.querySelector('.checkout .newsletter');

contactForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const NAME = evt.target.name;
  const EMAIL = evt.target.email;
  const QUESTION = evt.target.querySelector('textarea');
  // add article to firestore articles collection
  FIRESTORE.collection('questions').add({
    name: NAME.value,
    email: EMAIL.value,
    question: QUESTION.value.trim(),
    time: new Date()
  }).then(() => {
    querrySuccess("Query Sent successfully");
    NAME.value = '';
    EMAIL.value = '';
    QUESTION.value = '';
  });
});

subscribeForm.addEventListener('submit', evt => {
  evt.preventDefault();
  FIRESTORE.collection('subscribers').add({
    email: evt.target.email.value,
    time: new Date()
  }).then(() => {
    querrySuccess("Subscribed successfully!")
    evt.target.email.value = '';
  });
});

function querrySuccess(successMessage) {
  let uploadQuerySuccess = document.createElement('div');
  uploadQuerySuccess.classList.add('upload-success');
  uploadQuerySuccess.innerHTML = `<span>${successMessage}</span><button>X</button>`;
  document.body.appendChild(uploadQuerySuccess);
  setTimeout(() => {
    document.body.removeChild(uploadQuerySuccess);
  }, 5000);
}
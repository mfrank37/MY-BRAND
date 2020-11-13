// check names, profession, about & avatar
FIRESTORE.collection('profile')
  .doc('basic-info').get()
  .then(PROFILE => {
    PROFILE = PROFILE.data();
    // check names
    if (!PROFILE.names.firstname || !PROFILE.names.lastname) {
      document.querySelector('.name-status').innerHTML += `<span class='not-ok'> X </span>`;
    } else {
      document.querySelector('.name-status').innerHTML += `<span class='ok'> Ok! </span>`;
    }
    // check profession
    if (!PROFILE.profession) {
      document.querySelector('.profession-status').innerHTML += `<span class='not-ok'> X </span>`;
    } else {
      document.querySelector('.profession-status').innerHTML += `<span class='ok'> Ok! </span>`;
    }
    // check about
    if (!PROFILE.about) {
      document.querySelector('.about-status').innerHTML += `<span class='not-ok'> X </span>`;
    } else {
      document.querySelector('.about-status').innerHTML += `<span class='ok'> Ok! </span>`;
    }
    // check avatar
    if (!PROFILE.avatar) {
      document.querySelector('.avatar-status').innerHTML += `<span class='not-ok'> X </span>`;
    } else {
      document.querySelector('.avatar-status').innerHTML += `<span class='ok'> Ok! </span>`;
    }
    // check address
    if (!PROFILE.address.city || !PROFILE.address.country) {
      document.querySelector('.address-status').innerHTML += `<span class='not-ok'> X </span>`;
    } else {
      document.querySelector('.address-status').innerHTML += `<span class='ok'> Ok! </span>`;
    }
  });

FIRESTORE.collection('profile/achievements/skills').get()
.then(SKILLS => {
  if (SKILLS.docs.length < 3) {
    document.querySelector('.skill-status').innerHTML += `<span class='not-ok'> X </span>`;
  } else {
    document.querySelector('.skill-status').innerHTML += `<span class='ok'> Ok! </span>`;
  }
})

FIRESTORE.collection('profile/achievements/experiences').get()
.then(EXPERIENCES => {
  if (EXPERIENCES.docs.length < 1) {
    document.querySelector('.experience-status').innerHTML += `<span class='not-ok'> X </span>`;
  } else {
    document.querySelector('.experience-status').innerHTML += `<span class='ok'> Ok! </span>`;
  }
})

FIRESTORE.collection('profile/achievements/projects').get()
.then(PROJECTS => {
  if (PROJECTS.docs.length < 1) {
    document.querySelector('.project-status').innerHTML += `<span class='not-ok'> X </span>`;
  } else {
    document.querySelector('.project-status').innerHTML += `<span class='ok'> Ok! </span>`;
  }
})

FIRESTORE.collection('subscribers').get()
  .then(SUBSCRIBERS => {
    let subscribersList = document.querySelector('.admin-home .subscribers');
    SUBSCRIBERS.forEach(SUBSCRIBER => {
      SUBSCRIBER = SUBSCRIBER.data();
      let email = document.createElement('p');
      email.innerHTML = SUBSCRIBER.email;
      subscribersList.appendChild(email);
    })
  })

let addNote = document.querySelector('#add-note');
document.querySelector('.add-note')
  .addEventListener('submit', (evt) => {
    evt.preventDefault();
    FIRESTORE.collection('notes').add({
      note: addNote.value,
      time: new Date()
    }).then(() => {
      let addedNote = document.createElement('p');
      addedNote.innerHTML = addNote.value;
      document.querySelector('.my-notes').appendChild(addedNote);
      addNote.value = '';
    });
  });

FIRESTORE.collection('notes').get()
  .then(NOTES => {
    NOTES.forEach(NOTE => {
      NOTE = NOTE.data();
      document.querySelector('.my-notes').innerHTML += `<p>${NOTE.note}</p>`;
    });
  });
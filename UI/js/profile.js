const fName = document.querySelector('#first-name');
const lName = document.querySelector('#last-name');
const avatarUploader = document.querySelector('#avatar-progress');
const updateAvatar = document.querySelector('#open-profile-picture');
const avatarReady = document.querySelector('.profile-picture > img');
const professionField = document.querySelector('#profession');
const aboutField = document.querySelector('#about');
const emailField = document.querySelector('.email-telephone #email');
const telephoneField = document.querySelector('.email-telephone #telephone');
const countryField = document.querySelector('.address #country');
const cityField = document.querySelector('.address #address');
let avatarURL;

// core Update profile page
FIRESTORE.collection('profile').doc('basic-info').get()
  .then(RES => {
    const PROFILE = RES.data();
    // .nav avatar
    document.querySelector('.nav .admin-profile > img').src = PROFILE.avatar;
    // current profile picture
    avatarReady.src = PROFILE.avatar;
    // names field
    fName.value = PROFILE.names.firstname;
    lName.value = PROFILE.names.lastname;
    // profession & about
    professionField.value = PROFILE.profession;
    aboutField.value = PROFILE.about;
    // email & telephone
    emailField.value = PROFILE.email;
    telephoneField.value = PROFILE.telephone;
    // address
    countryField.value = PROFILE.address.country;
    cityField.value = PROFILE.address.city;
  });

updateAvatar.addEventListener('change', (evt) => {
  avatarUploader.value = 0;
  updateAvatar.classList.remove('upload-image-success');
  // image
  let file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('avatar/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    // get image reference
    snapshot.ref.getDownloadURL().then(url => {
      avatarURL = url;
      // change visible avatar
      document.querySelector('.profile-picture > p').innerHTML = 'New profile picture';
      document.querySelector('.profile-picture > img').src = avatarURL;
    });
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      avatarUploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      updateAvatar.classList.add('upload-image-success');
    });
});

// On General submit
const UPDATE_BTN = document.querySelector('.update-button > #update-button');
UPDATE_BTN.addEventListener('click', (evt) => {
  evt.preventDefault();
  // upload basic-info data
  FIRESTORE.collection('profile').doc('basic-info').set({
    names: {
      firstname: fName.value,
      lastname: lName.value
    },
    avatar: avatarReady.src,
    profession: professionField.value,
    about: aboutField.value,
    email: emailField.value,
    telephone: telephoneField.value,
    address: {
      city: cityField.value,
      country: countryField.value
    }
  }).then(() => {
    uploadedNotification("Profile updated successfully!");
    document.querySelector('.profile-picture > p').innerHTML = 'Current profile picture';
    avatarUploader.value = 0;
    updateAvatar.classList.remove('upload-image-success');
  })
});

// SKILLS
let skillImage = document.querySelector('#skill-logo');
let skillUploader = document.querySelector('#skill-progress');
let currentSkills = document.querySelector('.skills .current-skills');
let addNewSkill = document.querySelector('#add-new-skill');
let skillURL;

skillImage.addEventListener('change', (evt) => {
  skillUploader.value = 0;
  skillImage.classList.remove('upload-image-success');
  // image
  let file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('skills/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    // get image reference
    snapshot.ref.getDownloadURL().then(url => skillURL = url);
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      skillUploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      skillImage.classList.add('upload-image-success');
    });
});

addNewSkill.addEventListener('click', (evt) => {
  evt.preventDefault();
  let skillName = document.querySelector('#skill-name');
  // add new skill
  FIRESTORE.collection('profile/achievements/skills').add({
    logo: skillURL,
    name: skillName.value
  }).then((snapshot) => {
    // div.skill
    let newSkill = document.createElement('div');
    newSkill.classList.add('skill');
    newSkill.classList.add('upload-feature-success');
    // |___ img.src
    let img = document.createElement('img');
    img.src = skillURL;
    newSkill.appendChild(img);
    // |___ h4
    let h4 = document.createElement('h4');
    h4.innerHTML = skillName.value;
    newSkill.appendChild(h4);
    // |___ button#ID
    let button = document.createElement('button');
    button.id = snapshot.id;
    button.onclick = removeSkill;
    button.innerHTML = 'remove';
    newSkill.appendChild(button);
    currentSkills.appendChild(newSkill);
    // clear values
    skillImage.classList.remove('upload-image-success');
    skillUploader.value = 0;
    skillImage.value = '';
    skillName.value = '';
    uploadedNotification('Skill added successfully!');
  });
});

// fetch and display skills
FIRESTORE.collection('profile/achievements/skills').get()
  .then(SKILLS => {
    SKILLS.forEach(SKILL => {
      showSkill(SKILL.data(), SKILL.id);
    })
  });

// show skill
function showSkill(SKILL, ID) {
  // div.skill
  let skill = document.createElement('div');
  skill.classList.add('skill');
  // |___ img.src
  let img = document.createElement('img');
  img.src = SKILL.logo;
  skill.appendChild(img);
  // |___ h4
  let h4 = document.createElement('h4');
  h4.innerHTML = SKILL.name;
  skill.appendChild(h4);
  // |___ button#ID
  let button = document.createElement('button');
  button.id = ID;
  button.onclick = removeSkill;
  button.innerHTML = 'remove';
  skill.appendChild(button);
  currentSkills.appendChild(skill);
}

const removeSkill = (evt) => {
  evt.preventDefault();
  FIRESTORE.collection('profile/achievements/skills').doc(evt.target.id).delete()
    .then(() => {
      uploadedNotification('Skill removed successfully!');
      document.getElementById(evt.target.id).parentNode.remove();
    })
}

// PROJECTS
let projectImage = document.querySelector('#project-logo');
let projectUploader = document.querySelector('#project-progress');
let currentProjects = document.querySelector('.projects .projects-board');
let addNewProject = document.querySelector('#add-new-project');
let projectDescription = document.querySelector('#project-description');
let projectURL;

projectImage.addEventListener('change', (evt) => {
  projectImage.classList.remove('upload-image-success');
  projectUploader.value = 0;
  // image
  let file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('projects/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    // get image reference
    snapshot.ref.getDownloadURL().then(url => projectURL = url);
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      projectUploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      projectImage.classList.add('upload-image-success');
    });
});

addNewProject.addEventListener('click', (evt) => {
  evt.preventDefault();
  let projectName = document.querySelector('#project-name');
  // add new project
  FIRESTORE.collection('profile/achievements/projects').add({
    logo: projectURL,
    name: projectName.value,
    description: projectDescription.value
  }).then((snapshot) => {
    // div.project
    let newProject = document.createElement('div');
    newProject.classList.add('project');
    newProject.classList.add('upload-feature-success');
    // |___ img.src
    let img = document.createElement('img');
    img.src = projectURL;
    newProject.appendChild(img);
    // |___ h3.project-title
    let h3 = document.createElement('h3');
    h3.classList.add('project-title');
    h3.innerHTML = projectName.value;
    newProject.appendChild(h3);
    // |___ button#ID
    let button = document.createElement('button');
    button.id = snapshot.id;
    button.onclick = removeProject;
    button.innerHTML = 'remove';
    newProject.appendChild(button);
    currentProjects.appendChild(newProject);
    // clear values
    projectImage.classList.remove('upload-image-success');
    projectUploader.value = 0;
    projectImage.value = '';
    projectName.value = '';
    projectDescription.value = '';
    uploadedNotification('Project added successfully!');
  });
});

// fetch and display projects
FIRESTORE.collection('profile/achievements/projects').get()
  .then(PROJECTS => {
    PROJECTS.forEach(PROJECT => {
      showProject(PROJECT.data(), PROJECT.id);
    })
  });

// show project
function showProject(PROJECT, ID) {
  // div.project
  let project = document.createElement('div');
  project.classList.add('project');
  // |___ img.src
  let img = document.createElement('img');
  img.src = PROJECT.logo;
  project.appendChild(img);
  // |___ h3
  let h3 = document.createElement('h3');
  h3.classList.add('project-title');
  h3.innerHTML = PROJECT.name;
  project.appendChild(h3);
  // |___ button#ID
  let button = document.createElement('button');
  button.id = ID;
  button.onclick = removeProject;
  button.innerHTML = 'remove';
  project.appendChild(button);
  currentProjects.appendChild(project);
}

const removeProject = (evt) => {
  evt.preventDefault();
  FIRESTORE.collection('profile/achievements/projects').doc(evt.target.id).delete()
    .then(() => {
      uploadedNotification('Project removed successfully!');
      document.getElementById(evt.target.id).parentNode.remove();
    })
}

// EXPERIENCES
let experienceImage = document.querySelector('#experience-logo');
let experienceUploader = document.querySelector('#experience-progress');
let currentExperiences = document.querySelector('.experiences .experience-board');
let addNewExperience = document.querySelector('#add-new-experience');
let experienceURL;

experienceImage.addEventListener('change', (evt) => {
  experienceImage.classList.remove('upload-image-success');
  experienceUploader.value = 0;
  // image
  let file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('experiences/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    // get image reference
    snapshot.ref.getDownloadURL().then(url => experienceURL = url);
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      experienceUploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      experienceImage.classList.add('upload-image-success');
    });
});

addNewExperience.addEventListener('click', (evt) => {
  evt.preventDefault();
  let experienceLifetime = document.querySelector('#experience-lifetime');
  let experiencePosition = document.querySelector('#experience-position');
  let experienceCompany = document.querySelector('#experience-company');
  // add new experience
  FIRESTORE.collection('profile/achievements/experiences').add({
    logo: experienceURL,
    position: experiencePosition.value,
    company: experienceCompany.value,
    lifetime: experienceLifetime.value
  }).then((snapshot) => {
    // div.experience
    let newExperience = document.createElement('div');
    newExperience.classList.add('experience');
    newExperience.classList.add('upload-feature-success');
    // |___ img.src
    let img = document.createElement('img');
    img.src = experienceURL;
    newExperience.appendChild(img);
    // |___ h4.lifetime
    let h4a = document.createElement('h4');
    h4a.classList.add('lifetime');
    h4a.innerHTML = experienceLifetime.value;
    newExperience.appendChild(h4a);
    // |___ h4.position
    let h4b = document.createElement('h4');
    h4b.classList.add('position');
    h4b.innerHTML = experiencePosition.value;
    newExperience.appendChild(h4b);
    // |___ h4.company
    let h4c = document.createElement('h4');
    h4c.classList.add('company');
    h4c.innerHTML = 'at ' + experienceCompany.value;
    newExperience.appendChild(h4c);
    // |___ button#ID
    let button = document.createElement('button');
    button.id = snapshot.id;
    button.onclick = removeExperience;
    button.innerHTML = 'remove';
    newExperience.appendChild(button);
    currentExperiences.appendChild(newExperience);
    // clear values
    experienceImage.classList.remove('upload-image-success');
    experienceUploader.value = 0;
    experienceImage.value = '';
    experienceLifetime.value = '';
    experiencePosition.value = '';
    experienceCompany.value = '';
    uploadedNotification('Experience added successfully!');
  });
});

// fetch and display experiences
FIRESTORE.collection('profile/achievements/experiences').get()
  .then(EXPERIENCES => {
    EXPERIENCES.forEach(EXPERIENCE => {
      showExperience(EXPERIENCE.data(), EXPERIENCE.id);
    })
  });

// show experience
function showExperience(EXPERIENCE, ID) {
  // div.experience
  let experience = document.createElement('div');
  experience.classList.add('experience');
  // |___ img.src
  let img = document.createElement('img');
  img.src = EXPERIENCE.logo;
  experience.appendChild(img);
  // |___ h4.lifetime
  let h4Lifetime = document.createElement('h4');
  h4Lifetime.classList.add('lifetime');
  h4Lifetime.innerHTML = EXPERIENCE.lifetime;
  experience.appendChild(h4Lifetime);
  // |___ h4.position
  let h4Position = document.createElement('h4');
  h4Position.classList.add('position');
  h4Position.innerHTML = EXPERIENCE.position;
  experience.appendChild(h4Position);
  // |___ h4.company
  let h4Company = document.createElement('h4');
  h4Company.classList.add('company');
  h4Company.innerHTML = 'at ' + EXPERIENCE.company;
  experience.appendChild(h4Company);
  // |___ button#ID
  let button = document.createElement('button');
  button.id = ID;
  button.onclick = removeExperience;
  button.innerHTML = 'remove';
  experience.appendChild(button);
  currentExperiences.appendChild(experience);
}

const removeExperience = (evt) => {
  evt.preventDefault();
  FIRESTORE.collection('profile/achievements/experiences').doc(evt.target.id).delete()
    .then(() => {
      uploadedNotification('Experience removed successfully!');
      document.getElementById(evt.target.id).parentNode.remove();
    })
}

// social-media links
let linkIcon = document.querySelector('#link-icon');
let iconUploader = document.querySelector('#icon-progress');
let currentLinks = document.querySelector('.social-links .contact-list');
let addNewLink = document.querySelector('#add-new-link');
let iconURL;

linkIcon.addEventListener('change', (evt) => {
  iconUploader.value = 0;
  linkIcon.classList.remove('upload-image-success');
  // image
  let file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('contacts/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    // get image reference
    snapshot.ref.getDownloadURL().then(url => iconURL = url);
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      iconUploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      linkIcon.classList.add('upload-image-success');
    });
});

addNewLink.addEventListener('click', (evt) => {
  evt.preventDefault();
  let linkURL = document.querySelector('#url');
  // add new link
  FIRESTORE.collection('profile/basic-info/social-media').add({
    logo: iconURL,
    link: linkURL.value
  }).then((snapshot) => {
    // div.contact
    let newLink = document.createElement('div');
    newLink.classList.add('contact');
    newLink.classList.add('upload-feature-success');
    // |___ a.href
    let a = document.createElement('a');
    a.href = '#';
    // |    |___ img.src
    let img = document.createElement('img');
    img.src = iconURL;
    a.appendChild(img);
    newLink.appendChild(a);
    // |___ a.link
    let link = document.createElement('a');
    link.classList.add('link');
    link.href = '#';
    // |    |___ span
    let span = document.createElement('span');
    span.innerHTML = linkURL.value;
    link.appendChild(span);
    // |    |___ button
    let button = document.createElement('button');
    button.id = snapshot.id;
    button.innerHTML = 'remove';
    button.onclick = removeLink;
    link.appendChild(button);
    newLink.appendChild(link);
    currentLinks.appendChild(newLink);
    // clear values
    linkIcon.classList.remove('upload-image-success');
    iconUploader.value = 0;
    linkIcon.value = '';
    linkURL.value = '';
    uploadedNotification('Link added successfully!');
  });
});

// fetch and display skills
FIRESTORE.collection('profile/basic-info/social-media').get()
  .then(LINKS => {
    LINKS.forEach(LINK => {
      showLink(LINK.data(), LINK.id);
    })
  });

// show link
function showLink(LINK, ID) {
  // div.contact
  let link = document.createElement('div');
  link.classList.add('contact');
  // |___ a.href
  let a = document.createElement('a');
  a.href = '#';
  // |    |___ img.src
  let img = document.createElement('img');
  img.src = LINK.logo;
  a.appendChild(img);
  link.appendChild(a);
  // |___ a.link
  let aLink = document.createElement('a');
  aLink.href = '#';
  aLink.classList.add('link');
  // |    |___ span
  let span = document.createElement('span');
  span.innerHTML = LINK.link;
  aLink.appendChild(span);
  // |    |___ button#ID
  let button = document.createElement('button');
  button.innerHTML = 'remove';
  button.id = ID;
  button.onclick = removeLink;
  aLink.appendChild(button);
  link.appendChild(aLink);
  currentLinks.appendChild(link);
}

const removeLink = (evt) => {
  evt.preventDefault();
  FIRESTORE.collection('profile/basic-info/social-media').doc(evt.target.id).delete()
    .then(() => {
      uploadedNotification('Link removed successfully!');
      document.getElementById(evt.target.id).parentNode.parentNode.remove();
    })
}

// firestore upload success notifier
function uploadedNotification(message) {
  let successDiv = document.createElement('div');
  successDiv.classList.add('upload-success');
  successDiv.innerHTML = `<span>${message}</span><button>X</button>`;
  document.body.appendChild(successDiv);
  setTimeout(() => {
    successDiv.remove();
  }, 4500);
}
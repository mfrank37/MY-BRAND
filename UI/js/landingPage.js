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

// load basic info/data
FIRESTORE.collection('profile').doc('basic-info').get()
  .then(RES => {
    const PROFILE = RES.data();
    // document title
    document.head.querySelector('title').innerHTML = PROFILE.names.firstname + ' ' + PROFILE.names.lastname + ' - ' + PROFILE.profession;
    // banner
    document.querySelector('.nav > .banner').innerHTML = PROFILE.names.firstname + ' ' + PROFILE.names.lastname[0];
    // fullname
    document.querySelector('.hello > .myfullname').innerHTML = PROFILE.names.firstname + ' ' + PROFILE.names.lastname;
    // profession
    document.querySelector('.home-section .profession').innerHTML = PROFILE.profession;
    // about
    document.querySelector('.about-me > p').innerHTML = PROFILE.about;
    // profile picture or avatar
    document.querySelector('.about .profile-picture > img').src = PROFILE.avatar;
    // location
    document.querySelector('.contact-social .address > span').innerHTML = PROFILE.address.city + ', ' + PROFILE.address.country;
  });

// load skills
FIRESTORE.collection('profile/achievements/skills').get()
  .then(SKILLS => {
    SKILLS.forEach(SKILL => {
      SKILL = SKILL.data();
      // div.skill
      let skill = document.createElement('div');
      skill.classList.add('skill');
      // |___ img:src
      let img = document.createElement('img');
      img.src = SKILL.logo;
      skill.appendChild(img);
      // |___ h4
      let h4 = document.createElement('h4');
      h4.innerHTML = SKILL.name;
      skill.appendChild(h4);
      document.querySelector('.skills-section .skills').appendChild(skill);
    });
  });

// load projects
FIRESTORE.collection('profile/achievements/projects').get()
  .then(PROJECTS => {
    PROJECTS.forEach(PROJECT =>{
      PROJECT = PROJECT.data();
      // div.project
      let project = document.createElement('div');
      project.classList.add('project');
      // |___ img:src
      let img = document.createElement('img');
      img.src = PROJECT.logo;
      img.alt = PROJECT.name;
      project.appendChild(img);
      // h3.project-title
      let h3 = document.createElement('h3');
      h3.classList.add('project-title');
      h3.innerHTML = PROJECT.name;
      project.appendChild(h3);
      // div.description
      let description = document.createElement('div');
      description.classList.add('description');
      description.innerHTML = PROJECT.description;
      project.appendChild(description);
      document.querySelector('.projects-section .projects-board').appendChild(project);
    });
  });

// load experiences
FIRESTORE.collection('profile/achievements/experiences').get()
  .then(EXPERIENCES => {
    EXPERIENCES.forEach(EXPERIENCE => {
      EXPERIENCE = EXPERIENCE.data();
      // div.experience
      let experience = document.createElement('div');
      experience.classList.add('experience');
      // |___ img:src
      let img = document.createElement('img');
      img.src = EXPERIENCE.logo;
      experience.appendChild(img);
      // |___ h4.lifetime
      let lifetime = document.createElement('h4');
      lifetime.classList.add('lifetime');
      lifetime.innerHTML = EXPERIENCE.lifetime;
      experience.appendChild(lifetime);
      // |___ h4.position
      let position = document.createElement('h4');
      position.classList.add('position');
      position.innerHTML = EXPERIENCE.position;
      experience.appendChild(position);
      // |___ h4.company
      let company = document.createElement('h4');
      company.classList.add('company');
      company.innerHTML = EXPERIENCE.company;
      experience.appendChild(company);
      document.querySelector('.experience-section .experience-board').appendChild(experience);
    });
  });

// load contact/links
FIRESTORE.collection('profile/basic-info/social-media').get()
  .then(LINKS => {
    LINKS.forEach(LINK => {
      LINK = LINK.data();
      // div.contact
      let link = document.createElement('div');
      link.classList.add('contact');
      // |___ a:href
      let a = document.createElement('a');
      a.href = LINK.link;
      // |    |___ img:src
      let img = document.createElement('img');
      img.src = LINK.logo;
      a.appendChild(img);
      link.appendChild(a);
      // a.link
      let aLink = document.createElement('a');
      aLink.classList.add('link');
      aLink.href = LINK.link;
      aLink.innerHTML = LINK.link.replace(/^(.*:\/\/www\.|www\.|.*:www\.|.*:\/\/|.*:)/, "");
      link.appendChild(aLink);// ://www.
      document.querySelector('.contact-section .contact-social .contact-list').appendChild(link);
    });
  });

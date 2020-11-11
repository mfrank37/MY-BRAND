let form, coverImage, imageURL, uploader, file;
form = document.querySelector('#add-article');
coverImage = document.querySelector("#coverImage");
uploader = document.querySelector("#progress");

coverImage.addEventListener('change', evt => {
  uploader.value = 0;
  coverImage.classList.remove('upload-image-success');
  coverImage.classList.remove('notify-required-field');
  // image
  file = evt.target.files[0];
  // storage ref
  if (!file) {
    coverImage.classList.add('notify-required-field');
    return;
  }
  let storageRef = STORAGE.ref('articles/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      imageURL = url;
      coverImage.classList.add('upload-image-success');
    });
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      uploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    }
  );
})

form.addEventListener('submit', evt => {
  evt.preventDefault();
  let title = form.querySelector('#article-title');
  let description = form.querySelector('#article-body');
  // checking values
  if (title.value == '' || description.value == '' || !coverImage.files[0] || imageURL == undefined) {
    notifyErrors('Please fill out all required fields');
    return;
  }
  // add article to firestore articles collection
  FIRESTORE.collection('articles').add({
    title: title.value,
    coverImage: imageURL,
    description: description.value.split(/\n{2,}/),
    time: new Date(),
    comments: []
  }).then( snapshot => {
    uploadSuccess(snapshot);
    coverImage.classList.remove('upload-image-success');
    uploader.value = 0;
    title.value = '';
    coverImage.value = '';
    description.value = '';
  });
});

// MAKE UPLOAD CONFIRMATION POPUP
function uploadSuccess(snapshot) {
  let uploadArticleSuccess = document.createElement('div');
  uploadArticleSuccess.classList.add('upload-success');
  uploadArticleSuccess.innerHTML = `<span>Upload complete</span>
                                    <button>X</button>
                                    <i>  Want to 
                                      <a href="view article.html#${snapshot.id}">view it ?</a>
                                    </i>`;
  document.body.appendChild(uploadArticleSuccess);
  setTimeout(() => {
    document.body.removeChild(uploadArticleSuccess);
  }, 6000);
}

// MAKE  NOTIFICATION
function notifyErrors(message) {
  let title = document.querySelector('#article-title');
  let description = document.querySelector('#article-body');
  if (!imageURL || !coverImage.files[0]) {
    coverImage.classList.add('notify-required-field');
    coverImage.classList.remove('upload-image-success');
  }
  if (!title.value) {
    title.classList.add('notify-required-field');
  }
  if (!description.value) {
    description.classList.add('notify-required-field');
  }
  // display error notification
  let errorDiv = document.createElement('div');
  errorDiv.classList.add('error-message');
  errorDiv.innerHTML = `<span>${message}</span><button>X</button>`;
  document.body.appendChild(errorDiv);
  setTimeout(() => {
    errorDiv.remove();
    coverImage.classList.remove('notify-required-field');
    title.classList.remove('notify-required-field');
    description.classList.remove('notify-required-field');
  }, 4000);
}
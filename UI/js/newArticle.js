let form, coverImage, imageURL, uploader, file;
form = document.querySelector('#add-article');
coverImage = document.querySelector("#coverImage");
uploader = document.querySelector("#progress");

coverImage.addEventListener('change', evt => {
  uploader.value = 0;
  // image
  file = evt.target.files[0];
  // storage ref
  let storageRef = STORAGE.ref('articles/' + file.name);
  let uploadTask = storageRef.put(file);

  uploadTask.then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => imageURL = url );
  });

  uploadTask.on('state_changed',
    function progress(snapshot) {
      uploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    },
    function error(err) {
      console.log('Upload failed! ' + err);
    },
    function complete() {
      // get image reference
      console.log('Completed upload ' + file.name);
    });
})

form.addEventListener('submit', evt => {
  evt.preventDefault();
  let title = form.querySelector('#article-title');
  let description = form.querySelector('#article-body');
  // add article to firestore articles collection
  FIRESTORE.collection('articles').add({
    title: title.value,
    coverImage: imageURL,
    description: description.value.split(/\n{2,}/),
    time: new Date(),
    comments: []
  }).then( snapshot => {
    uploadSuccess(snapshot);
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

const articleID = location.hash.substr(1);
let articleForm, coverImage, imageURL, uploader, file, currentCoverImage;
articleForm = document.querySelector('.create-article-form');
coverImage = document.querySelector("#select-new-coverImage");
uploader = document.querySelector("#update-coverImage-progress");
currentCoverImage = articleForm.querySelector('.current-coverImage > img');
FIRESTORE.collection('articles/').doc(articleID).get()
        .then(result => {
            const ARTICLE = result.data();
            displayArticle(ARTICLE);
        });

function displayArticle(ARTICLE) {
  // Show the title
  articleForm.querySelector('label > #article-title').value = ARTICLE.title;
  // Show the coverImage
  currentCoverImage.src = imageURL = ARTICLE.coverImage;
  // Show the description paragraphs
  let articleDescription = articleForm.querySelector('label textarea');
  ARTICLE.description.forEach( paragraph => {
    articleDescription.value += paragraph + "\n\n";
  });
}
coverImage.addEventListener('change', ({target}) => {
    uploader.value = 0;
    // image
    file = target.files[0];
    // storage ref
    let storageRef = STORAGE.ref('articles/' + file.name);
    let uploadTask = storageRef.put(file);

    uploadTask.then( snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            // show newimage image reference
            imageURL = url;
            console.log('new coverImage ::: ', imageURL);
            currentCoverImage.src = imageURL;
        });
    });

    uploadTask.on('state_changed',
        function progress(snapshot) {
            uploader.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        },
        function error(err) {
            console.log('Upload failed! ' + err);
        },
        function complete() {
            console.log('uploaded new coverImage');
        });
});
articleForm.addEventListener('submit', evt => {
    evt.preventDefault();
    let title = articleForm.querySelector('#article-title');
    let description = articleForm.querySelector('#article-body');
    // add article to firestore articles collection
    FIRESTORE.collection('articles').doc(articleID).update({
      title: title.value,
      coverImage: imageURL,
      description: description.value.split(/\n{2,}/),
    }).then( () => {
      updateSuccess();
      uploader.value = 0;
      title.value = '';
      coverImage.value = '';
      description.value = '';
    });
});
function updateSuccess () {
    let uploadArticleSuccess = document.createElement('div');
    uploadArticleSuccess.classList.add('upload-success');
    uploadArticleSuccess.innerHTML = `<span>Update complete</span>
                                      <button>X</button>
                                      <span>Want to <a href="view article.html#${articleID}">view it ?</a></span>`;
    document.body.appendChild(uploadArticleSuccess);
    setTimeout(() => {
      document.body.removeChild(uploadArticleSuccess);
    }, 6000);
}
updateSuccess();
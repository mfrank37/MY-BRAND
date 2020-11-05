let form, coverImage, uploader, file;
form = document.querySelector('#add-article');
coverImage = document.querySelector("#coverImage");
uploader = document.querySelector("#progress");

coverImage.addEventListener('change', evt => {
    uploader.value = 0;
    // image
    file = evt.target.files[0];
    // storage ref
    let storageRef = STORAGE.ref('articles/' + file.name );
    let task = storageRef.put(file);
    
    task.on('state_changed',
    function progress(snapshot) {
        console.log(snapshot.bytesTransferred/snapshot.totalBytes * 100, " %  - uploaded Article's cover image");
        uploader.value = snapshot.bytesTransferred/snapshot.totalBytes * 100;
    },
    function error(err) {
        console.log('Upload failed! ' + err);
    },
    function complete(){
        // get image reference
        console.log('Completed upload ' + file.name );        
    });
})

form.addEventListener('submit', evt => {
    evt.preventDefault();
    let title = form.querySelector('#article-title');
    let description = form.querySelector('#article-body');
    // add article to firestore articles collection
    FIRESTORE.collection('articles').add({
        title: title.value,
        coverImage: file.name,
        description: description.value.split(/\n{2,}/),
        time: new Date(),
        comments: {}
    }).then( () => {
        uploader.value = 0;
        title.value = '';
        coverImage.value = '';
        description.value = '';
        console.log('Article uploaded');
    });
});
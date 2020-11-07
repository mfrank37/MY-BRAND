// get the articles from birebase

const allArticles = document.querySelector('.view-articles-section .all-articles');

FIRESTORE.collection('articles').get().then( result => {
    const ARTICLES = result.docs;
    ARTICLES.forEach( ARTICLE => {
        const ID = ARTICLE.id;
        ARTICLE = ARTICLE.data();
        displayArticle(ARTICLE, ID);
    });
});

const displayArticle = (ARTICLE, ID) => {
   /*   // ARTICLE DOM structure
    *    div.article +
    *                |___ div.article-text +
    *                |                     |____h4
    *                |                     |____p
    *                |                     |____p.details +
    *                |                                    |___span
    *                |____ div.cover-image +
    *                |                     |___ img
    *                |____ div.btns +
    *                               |___ a  // ----> view article.html
    *                               |___ button //-> update article.html
    *                               |___ button //-> delete popup
    * 
    */
    //  div.article
    let article = document.createElement('div');
    article.classList.add('article');
    article.classList.add(ID);
        // div.article-text
        let articleText = document.createElement('div');
        articleText.classList.add('article-text');
            // h4
            let articleHeader = document.createElement('h4');
            articleHeader.innerHTML = ARTICLE.title;
            articleText.appendChild(articleHeader);
            // p
            let articleDescription = document.createElement('p');
            articleDescription.innerHTML = ARTICLE.description[0];
            articleText.appendChild(articleDescription);
            // p.details
            let articleDetails = document.createElement('p');
            articleDetails.classList.add('details');
            let publishDate = new Date(ARTICLE.time.seconds * 1000);
            articleDetails.innerHTML = `${publishDate.toDateString()} `;
            let hasComments = ARTICLE.comments.length > 1 ? `<span> - ${ARTICLE.comments.length} comments</span>`
                            : ARTICLE.comments.length == 1 ? `<span> - ${ARTICLE.comments.length} comment</span>`
                            : `<span> - No comment</span>`;
            articleDetails.innerHTML = articleDetails.innerHTML + hasComments;
        articleText.appendChild(articleDetails);
    article.appendChild(articleText);
        // div.cover-image
        let coverImage = document.createElement('div');
        coverImage.classList.add('cover-image');
            let img = document.createElement('img');
            img.src = ARTICLE.coverImage;
            console.log(ARTICLE.coverImage);
        coverImage.appendChild(img);
            // div.btns
    article.appendChild(coverImage);
        let btns = document.createElement('div');
        btns.classList.add('btns');
            let viewAnchor = document.createElement('a');
            viewAnchor.href = 'view article.html#' + ID;
            viewAnchor.innerHTML = 'View';
        btns.appendChild(viewAnchor);
            let updateAnchor = document.createElement('a');
            updateAnchor.classList.add('update');
            updateAnchor.href = 'update article.html#' + ID;
            updateAnchor.innerHTML = 'Update article';
        btns.appendChild(updateAnchor);
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.setAttribute('data-article-id', ID);
            deleteButton.addEventListener('click', confirmDeletePopup);
            deleteButton.innerHTML = 'Delete article';
        btns.appendChild(deleteButton);
    article.appendChild(btns);
    allArticles.appendChild(article);
}
function cancelDeleteArticle() {
    let deleteSection = document.querySelector('.confirm-delete-section');
    deleteSection.classList.add('hide');
}
function confirmDeletePopup({target}) {
    let deleteSection = document.querySelector('.confirm-delete-section');
    // embed the clicked article in the delete popup
    let titlePlaceholder = deleteSection.querySelector('h2');
    titlePlaceholder.innerHTML = target.parentNode.parentNode.querySelector('.article-text h4').innerHTML;
    // add id to the big main btn
    let bigDeleteButton = deleteSection.querySelector('button.big-delete-btn');
    bigDeleteButton.setAttribute('data-delete-article', target.getAttribute('data-article-id'));
    bigDeleteButton.addEventListener('click', deleteArticle);
    // make visible
    deleteSection.classList.remove('hide');
}
function deleteArticle(evt) {
    evt.preventDefault();
    const ID = evt.target.getAttribute('data-delete-article');
    FIRESTORE.collection('articles')
            .doc(ID)
            .delete()
            .then(() => {
                console.log('deleted article ', ID);
                deleteArticleDone(ID);
            });
}
function deleteArticleDone(articleID) {
    document.querySelector('.'+articleID).remove();
    cancelDeleteArticle();
}
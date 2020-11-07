const articlesBoard = document.querySelector('.articles-board .article-year');

FIRESTORE.collection('articles').get().then( result => {
    const ARTICLES = result.docs;
    ARTICLES.forEach( ARTICLE => {
        const ID = ARTICLE.id;
        ARTICLE = ARTICLE.data();
        displayArticles(ARTICLE, ID);
    });
});

function displayArticles(ARTICLE, ID) {
    // a.article  href=view article.html#ID
    let article = document.createElement('a');
    article.href = 'view article.html#' + ID;
    article.classList.add('article');
    //         |___ div.article-description
    let articleDescription = document.createElement('div');
    articleDescription.classList.add('article-description');
    //         |    |____ h3
    let h3 = document.createElement('h3');
    h3.innerHTML = ARTICLE.title;
    articleDescription.appendChild(h3);
    //         |    |____ h5.publish-date +___ span
    let h5 = document.createElement('h5');
    h5.classList.add('publish-date');
    let published = new Date(ARTICLE.time.seconds * 1000);
    h5.innerHTML = `Published: <span>${ published.toDateString() }</span>`;
    articleDescription.appendChild(h5);
    article.appendChild(articleDescription);
    //         |___ div.article-image
    let coverImage = document.createElement('div');
    coverImage.classList.add('article-image');
    //              |____ img.src
    let img = document.createElement('img');
    img.src = ARTICLE.coverImage;
    coverImage.appendChild(img);
    article.appendChild(coverImage);
    articlesBoard.appendChild(article);
}
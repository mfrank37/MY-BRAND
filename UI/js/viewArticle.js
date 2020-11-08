const articleID = location.hash.substr(1);
const COMMENT_FORM = document.querySelector('.comment-form');
 
// document.querySelector('.article').addEventListener('click', evt =>{
//   console.log(evt);
// });

FIRESTORE.collection('articles/').get().then(result => {
  // Get documents from collection
  const ALL_ARTICLES = result.docs;
  // Filter the article wanted
  const [ARTICLE] = ALL_ARTICLES.filter(ARTICLE => ARTICLE.id === articleID);
  // Select recommendations of 2 articles
  let RECOMMENDED = [];
  let count = 2, n = ALL_ARTICLES.length - 1;
  if ( n > count) {
    for (; count >= 1;) {
      if (ALL_ARTICLES[n].id == articleID) {
        continue;
      };
      RECOMMENDED.push(ALL_ARTICLES[n]);
      count--;
      n--;
    }
  }
  // show the ARTICLE and the recommended articles
  showArticle(ARTICLE.data());
  showRecommended(RECOMMENDED);
});

function showArticle(ARTICLE) {
  const articleView = document.querySelector('.article-view-section .article-view');
  // Show the title
  articleView.querySelector('.header > h1').innerHTML = ARTICLE.title;
  // Show publish date
  let published = new Date(ARTICLE.time.seconds * 1000);
  articleView.querySelector('.header > p > .date').innerHTML = published.toDateString();
  // Show the coverImage
  articleView.querySelector('.article-image > img').src = ARTICLE.coverImage;
  // Show the description paragraphs
  let articleDescription = articleView.querySelector('.description');
  ARTICLE.description.forEach( paragraph => {
    let p = document.createElement('p');
    p.innerHTML = paragraph;
    articleDescription.appendChild(p);
  });
  // Show the comments
  let commentsView = document.querySelector('.comments-section .comments');
  if(ARTICLE.comments.length > 0) {
    let noComments = commentsView.querySelector('.no-comments');
    commentsView.removeChild(noComments);
    ARTICLE.comments.forEach( COMMENT => {
      // div.comment
      let commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
        // |___ h5
        let h5 = document.createElement('h5');
          //    |___ span.date
          h5.innerHTML = `${COMMENT.posterName} `;
          let commentedOn = new Date(COMMENT.time.seconds * 1000);
          h5.innerHTML += `<span class="date">- ${commentedOn.toDateString()} </span>`;
        commentDiv.appendChild(h5);
          // |___ p
          let p = document.createElement('p');
          p.innerHTML = COMMENT.comment;
        commentDiv.appendChild(p);
      commentsView.appendChild(commentDiv);
    }); 
  }
}
function showRecommended(RECOMMENDED) {
  if (RECOMMENDED.length > 0) {
    RECOMMENDED.forEach(ARTICLE => {
      const ID = ARTICLE.id;
      ARTICLE = ARTICLE.data();
      let viewRecommended = document.querySelector('.article-view-section .more-articles');
      // div.article
      let article = document.createElement('div');
      article.id = ID;
      article.addEventListener('click', seeChosenRecommendation);
      article.classList.add('article');
      // |___ div.article-description
      let articleDescription = document.createElement('div');
      articleDescription.classList.add('article-description');
      // |    |___ h3
      let h3 = document.createElement('h3');
      h3.id = ID;
      h3.addEventListener('click', seeChosenRecommendation);
      h3.innerHTML = ARTICLE.title;
      articleDescription.appendChild(h3);
      // |    |___ h5.publish-date +
      let h5 = document.createElement('h5');
      h5.classList.add('publish-date');
      // |        |___ span
      let date = new Date(ARTICLE.time.seconds * 1000);
      h5.innerHTML = `Published <span>${date.toDateString()}</span>`;
      articleDescription.appendChild(h5);
      article.appendChild(articleDescription);
      // |___ div.article-dimage
      let articleImage = document.createElement('div');
      articleImage.classList.add('article-image');
      // |    |___ img
      let img = document.createElement('img');
      img.id = ID;
      img.addEventListener('click', seeChosenRecommendation);
      img.src = ARTICLE.coverImage;
      articleImage.appendChild(img);
      article.appendChild(articleImage);
      viewRecommended.appendChild(article);
    });
  }
}
function seeChosenRecommendation ({target}) {
  console.log(target);
  let viewOther = location.hash;
  location.hash = " ";
  location.hash = viewOther;
  // location.assign(`${location.pathname}#${target.id}`);
}
COMMENT_FORM.addEventListener('submit', evt => {
  evt.preventDefault();
  // add article to firestore articles collection
  FIRESTORE.collection('articles').doc(articleID).update({
    comments: firebase.firestore.FieldValue.arrayUnion({
      posterName: COMMENT_FORM.name.value,
      comment: COMMENT_FORM.comment.value.trim(),
      time: new Date()
    })
  }).then( () => {
    commentSuccess(COMMENT_FORM.name.value, COMMENT_FORM.comment.value);
    COMMENT_FORM.name.value = '';
    COMMENT_FORM.comment.value = '';
  });
});

function commentSuccess(posterName, comment) {
  try {
    let commentsView = document.querySelector('.comments-section .comments');
    let noComments = commentsView.querySelector('.no-comments');
    commentsView.removeChild(noComments);
  } catch (error) {
    console.log('Your comment saved!');
  }
  let commentsView = document.querySelector('.comments-section .comments');
  // div.comment-success
  let successPopup = document.createElement('div');
  successPopup.classList.add('comment-success');
  successPopup.classList.add('comment');
  // |___ h5
  let h5 = document.createElement('h5');
  //    |___ span.date
  h5.innerHTML = posterName;
  let commentedOn = new Date();
  h5.innerHTML += ` <span class="date">- ${commentedOn.toDateString()} </span>`;
  successPopup.appendChild(h5);
  // |___ p
  let p = document.createElement('p');
  p.innerHTML = comment;
  successPopup.appendChild(p);
  commentsView.appendChild(successPopup);
}

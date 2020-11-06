/* Navbar control */
function toggleNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function cancelDeleteArticle(){
  let deleteSection = document.querySelector('.confirm-delete-section');
  deleteSection.classList.add('hide');
}


function confirmDeletePopup({ target }){
  let deleteSection = document.querySelector('.confirm-delete-section');
  
  // embed the clicked article in the delete popup
  let titlePlaceholder = deleteSection.querySelector('h2');
  titlePlaceholder.innerHTML = target.parentNode.parentNode.querySelector('.article-text h4').innerHTML;

  // add id to the big main btn
  deleteSection.querySelector('button.big-delete-btn').setAttribute('data-delete-article', target.getAttribute('data-article-id'));
  // make visible
  deleteSection.classList.remove('hide');
}


// Gets run when loaded.
function start(){

  let deleteButtons = document.querySelectorAll('.article .btns .delete');
  deleteButtons.forEach( button =>{
    button.addEventListener('click', confirmDeletePopup);
  });

}
// starts here
start();
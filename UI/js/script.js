/* Navbar control */
function toggleNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " hide";
  } else {
    x.className = "topnav";
  }
}
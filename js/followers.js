window.onload = () => {
    sessionStorage.setItem("payLink", "")
}

const $buttons = document.querySelectorAll('#sidebar-toggle');
const payments_links = document.querySelectorAll('.payments-links');
const $wrapper = document.querySelector('#wrapper');
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btns = document.querySelectorAll("#myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("cllose")[0];

$buttons.forEach(($button) => {
    $button.addEventListener('click', (e) => {
        e.preventDefault();
        $wrapper.classList.toggle('toggled');
    });
})
document.addEventListener('scroll', (scrollEvent) => {
    var nav = document.querySelector('.navbar');
    if (window.pageYOffset >= 392) {
        document.querySelector('.navbar').style.backgroundColor = "#212121"
    } else {
        document.querySelector('.navbar').style.background = "transparent"
    }
});

btns.forEach((btn) => {
    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }
});



// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

payments_links.forEach((links) => {
    links.addEventListener('click', (event) => {
        event.preventDefault();
        let link = event.target.attributes['href'].value;
        sessionStorage.setItem("payLink", "");
        sessionStorage.setItem("payLink", link);
    })
})
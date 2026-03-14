document.addEventListener("DOMContentLoaded", function() {
    const headerTarget = document.getElementById('header') || document.getElementById('header-container');
    const footerTarget = document.getElementById('footer') || document.getElementById('footer-container');

    if (headerTarget) {
        fetch('https://vikasgoyal.github.io/header.html')
            .then(response => response.text())
            .then(data => {
                headerTarget.innerHTML = data;
            })
            .catch(error => console.error('Error loading the header:', error));
    }

    if (footerTarget) {
        fetch('https://vikasgoyal.github.io/footer.html')
            .then(response => response.text())
            .then(data => {
                footerTarget.innerHTML = data;
            })
            .catch(error => console.error('Error loading the footer:', error));
    }
});
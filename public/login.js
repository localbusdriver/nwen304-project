$(".input_text").focus(function(){
    $(this).prev('.fa').addClass('glowIcon'); 
});

$(".input_text").focusout(function(){
    $(this).prev('.fa').removeClass('glowIcon'); 
});
function submitForm() {
    $('#loginForm').submit();
}

$(document).ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();

        const username = $('input[name="username"]').val();
        const password = $('input[name="password"]').val();

        $.post('/login', { username, password })
        // Waits for response from server
        .done(function(response) {
            if (response.message === 'Logged in successfully') {
                if (response.redirectTo) { // Redirect to server provided URL
                    window.location.href = response.redirectTo; 
                } else {
                    alert('Logged in successfully');
                }
            } else { // Display error message
                alert(response.message);
            }
        })
        .fail(function(xhr) {
            alert(xhr.responseText || 'An error occurred. Please try again.');
        });
    });
});

//obtain redirect parameter from query URL
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect');

if (redirect) {
    //Display message
    document.getElementById('loginMessage').innerText = 'Please log in to continue to the requested page.';
}

//When the session is expired
if (urlParams.get('sessionExpired')) {
    document.getElementById('loginMessage').innerText = 'Your session has expired. Please log in again.';
}
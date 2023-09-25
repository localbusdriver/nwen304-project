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
        .done(function(response) {
            if (response.message === 'Logged in successfully') {
                if (response.redirectTo) {
                    window.location.href = response.redirectTo; //Redirect to server provided URL
                } else {
                    alert('Logged in successfully');
                }
            } else {
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

function checkLoggedIn(req, res, next) {
    if (req.session && req.session.user && req.session.user.id) {
        next();
    } else {
        res.redirect('/login.html?sessionExpired=true');
    }
}



$(function() {
    $('header h1').on('click', function() {
        window.location.href = '/';
    });

    $('.sign-in button').on('click', function() {
        $('#login-form').modal();
        return false;
    });

    $('.about-methods button').on('click', function() {
        $('#methods').modal();
        return false;
    });

    $('#login-form form').on('submit', function(event) { 
        event.preventDefault();
        
        var form = event.target;

        $.ajax({
            type: form.method,
            url: form.action,
            data: $(this).serialize(),
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                var response = error.responseJSON;                
                $('<div class="modal">' + response.message + '</div>').appendTo('body').modal();
            }
        });
    });
});
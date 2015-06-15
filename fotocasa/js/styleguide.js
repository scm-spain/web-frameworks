$(function () {
    $('nav a[href*=#]').click(function (event) {
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500, "swing");
        event.preventDefault();
    });

    //Abrir paneeles show code

    $("[data-show-code]").on("click", function (e) {
        e.preventDefault();
        $(this).next(".code-container").toggleClass("code-visibility__yes");
        if ($(this).text() == "Show code") {
            $(this).text("Hide code");
        }
        else {
            $(this).text("Show code");
        }
    });
});
(function ($) {
  'use strict';

  // Preloader js    
  $(window).on('load', function () {
    $('.preloader').fadeToggle(1000);
  });

  // Sticky Menu
  $(window).scroll(function () {
    var height = $('.top-header').innerHeight();
    if ($('header').offset().top > 10) {
      $('.top-header').addClass('hide');
      $('.navigation').addClass('nav-bg');
      $('.navigation').css('margin-top','-'+height+'px');
    } else {
      $('.top-header').removeClass('hide');
      $('.navigation').removeClass('nav-bg');
      $('.navigation').css('margin-top','-'+0+'px');
    }
  });

  

  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    });
  });



  //Hero Slider
  $('.hero-slider').slick({
    autoplay: true,
    autoplaySpeed: 7500,
    pauseOnFocus: false,
    pauseOnHover: false,
    infinite: true,
    arrows: true,
    fade: true,
    prevArrow: '<button type=\'button\' class=\'prevArrow\'><i class=\'ti-angle-left\'></i></button>',
    nextArrow: '<button type=\'button\' class=\'nextArrow\'><i class=\'ti-angle-right\'></i></button>',
    dots: true
  });
  $('.hero-slider').slickAnimation();

  // venobox popup
  $(document).ready(function () {
    $('.venobox').venobox();
  });

  // filter
  $(document).ready(function () {
    var containerEl = document.querySelector('.filtr-container');
    var filterizd;
    if (containerEl) {
      filterizd = $('.filtr-container').filterizr({});
    }
    //Active changer
    $('.filter-controls li').on('click', function () {
      $('.filter-controls li').removeClass('active');
      $(this).addClass('active');
    });
  });

  //  Count Up
  function counter() {
    var oTop;
    if ($('.count').length !== 0) {
      oTop = $('.count').offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $('.count').each(function () {
        var $this = $(this),
          countTo = $this.attr('data-count');
        $({
          countNum: $this.text()
        }).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
          }
        });
      });
    }
  }
  $(window).on('scroll', function () {
    counter();
  });

  // Animation
  $(document).ready(function () {
    $('.has-animation').each(function (index) {
      $(this).delay($(this).data('delay')).queue(function () {
        $(this).addClass('animate-in');
      });
    });
  });

  $(document).ready(function() {

      // process the form
      $('#joinUsForm').submit(function(event) {

          // get the form data
          // there are many ways to get this data using jQuery (you can use the class or id also)
          var formData = {
              'name'       : $('input[name=name]').val(),
              'mail'       : $('input[name=mail]').val(),
              'reason'    : $('input[name=message]').val()
          };

          // process the form
          $.ajax({
              type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url         : 'https://rbb-data-api.cisco.com/api/v1/rbb/join-us', // the url where we want to POST
              headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
              },
              data        : JSON.stringify(formData), // our data object
              dataType    : 'json', // what type of data do we expect back from the server
              encode          : true
          })
              // using the done promise callback
              .done(function(data) {

                  // log data to the console so we can see
                  console.log(data);

                  // here we will handle errors and validation messages
              });

          // stop the form from submitting the normal way and refreshing the page
          event.preventDefault();
      });

  });

  $(document).ready(function() {

        // process the form
        $('#loginForm').submit(function(event) {

            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'userName'              : $('input[name=username]').val(),
                'password'             : $('input[name=password]').val()
            };

            console.log(formData);

            // process the form
            $.ajax({
                type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url         : 'https://rbb-data-api.cisco.com/api/v1/rbb/member-login', // the url where we want to POST
                headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                },
                data        : JSON.stringify(formData), // our data object
                dataType    : 'json', // what type of data do we expect back from the server
                encode      : true
            })
                // using the done promise callback
                .done(function(data) {

                    // log data to the console so we can see
                    console.log(data);

                    // here we will handle errors and validation messages
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });

    });


})(jQuery);
var isAppleFunc = typeof displayApplePayButton != 'undefined',
    isAndroidFunc = typeof displayAndroidPayButton != 'undefined';

if (isAppleFunc || isAndroidFunc) {
    // FLWS-1789 Overwrite desktop's display Apple Pay button function
    if (isAppleFunc) {
        var _displayApplePayButton = displayApplePayButton;
        displayApplePayButton = function() {
            if ($('body').hasClass('applepay')) {
                _displayApplePayButton();

                // insert apple pay css
                $('head').append(
                    '<style>' +
                    '.apple-pay-button-with-text { --apple-pay-scale: 1.40625; /* (height / 32) */ display: inline-flex; justify-content: center; font-size: 12px; border-radius: 5px; padding: 0px; box-sizing: border-box; width: 100%; min-width: 130px; height: 45px; min-height: 32px; max-height: 64px;}.apple-pay-button-black-with-text { background-color: black; color: white;}.apple-pay-button-white-with-text { background-color: white; color: black;}.apple-pay-button-white-with-line-with-text { background-color: white; color: black; border: .5px solid black;}.apple-pay-button-with-text.apple-pay-button-black-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-white); background-color: black;}.apple-pay-button-with-text.apple-pay-button-white-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-with-text.apple-pay-button-white-with-line-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-with-text > .text { font-family: -apple-system; font-size: calc(1em * var(--apple-pay-scale)); font-weight: 300; align-self: center; margin-right: calc(2px * var(--apple-pay-scale));}.apple-pay-button-with-text > .logo { width: calc(35px * var(--apple-pay-scale)); height: 100%; background-size: 100% 60%; background-repeat: no-repeat; background-position: 0 50%; margin-left: calc(2px * var(--apple-pay-scale)); border: none;}' +
                    '.apple-pay-button { display: inline-block; background-size: 100% 60%; background-repeat: no-repeat; background-position: 50% 50%; border-radius: 5px; padding: 0px; box-sizing: border-box; min-width: 200px; min-height: 32px; max-height: 64px;}.apple-pay-button-black { background-image: -webkit-named-image(apple-pay-logo-white); background-color: black;}.apple-pay-button-white { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-white-with-line { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white; border: .5px solid black;}' +
                    '#your_recipient #_apple_pay_btn { margin-left: 10px; }' +
                    '</style>'
                );

                var apLink = $('#apLink');

                if (apLink.length) {
                    var bodyObj = $('body');

                    if (bodyObj.hasClass('_Product') && !bodyObj.hasClass('tablet')) {
                        apLink.addClass('hide');

                        $('#your_recipient').append(apLink);

                        var applePayBtn = $(document.createElement('div'));
                        applePayBtn.attr('id', '_apple_pay_btn')
                            .html(
                                '<div>' +
                                '<div class="input_holder icon">' +
                                '<div class="apple-pay-button-with-text apple-pay-button-black-with-text">' +
                                '<span class="text">Buy With</span>' +
                                '<span class="logo"></span>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            ).find('div.apple-pay-button-with-text').attr({"onclick":"ga('fd_mbp.send', 'event', {eventCategory: 'PDP',eventAction: 'Click',eventLabel: 'Apple Pay'});","onload":"ga('send', 'event', {eventCategory: 'PDP',eventAction: 'Impression',eventLabel: 'Apple Pay'});"})
                            .click(function() {
                                apLink.click();
                            });

                        placePayBtn(applePayBtn);

                        //Start FLWS-3040 -*Bug* Apple Pay/Add To Cart Not Sticky On PDP Plus Phones
                        $("#your_recipient").removeClass("pfx-down");
                        $("#your_recipient").addClass("pfx-up");
                        //End FLWS-3040

                    } else if (bodyObj.hasClass('_PlaceOrder')) {
                        // Insert apple pay code here when apple pay is taken out of the signal container
                    } else if (bodyObj.hasClass('_ShoppingCart')) {
                        // cart page?
                    }
                }
            }
        }
    }

    // FLWS-2282 Overwrite desktop's display Android Pay button function
    var isCartEmpty;
    if ($("#cart_btn span").hasClass("hide")) {
        isCartEmpty = true;
    } else {
        isCartEmpty = false;
    }
    console.log("is cart empty: " + isCartEmpty);
    if (isAndroidFunc && isCartEmpty === true && $('body').hasClass('android')) {
        console.log("android/webpayments");
        var _displayAndroidPayButton = displayAndroidPayButton;
        displayAndroidPayButton = function() {
            _displayAndroidPayButton();

            var androidPayBtnLink = $('#androidPayBtnLink');
            var googlePayBtnLink = $('#googlePayBtnLink');
            console.log(androidPayBtnLink.length);
            console.log(googlePayBtnLink.length);
            if (androidPayBtnLink.length && googlePayBtnLink.length) {
                var bodyObj = $('body');
                if (bodyObj.hasClass('_Product')) {
                    var androidPayBtn = $(document.createElement('div'));
                    androidPayBtn.attr('id', '_android_pay_btn')
                        .addClass('input_holder')
                        .html(
                            '<div class="fake_button secondary_bg" tabindex=-1>' +
                            '<div class="regular">' +
                            'Express Checkout' +
                            '</div>' +
                            '<div class="extra_small">' +
                            'Credit Card' +
                            '</div>' +
                            '</div>'
                        ).find('div.fake_button')
                        .click(function() {
                            googlePayBtnLink.find('img').click();
                        });

                    placePayBtn(androidPayBtn);
                } else if (bodyObj.hasClass('_PlaceOrder')) {
                    var androidPayBtn = $(document.createElement('div'));
                    androidPayBtn.attr('id', '_android_pay_btn')
                        .addClass('row full_margin_top')
                        .html(
                            '<input type="button" class="secondary_bg" value="Pay with Credit Card">'
                        ).find('input').click(function() {
                            androidPayBtnLink.find('img').click();
                        });
                    $('#_payment_title').after(androidPayBtn);
                    androidPayBtn.attr('id', '_android_pay_btn').parent().removeClass('hide');

                    var hiddenForms = $(document.createElement('div'));
                    hiddenForms.attr('id', '__hidden_forms')
                        .addClass('hide')
                        .append($('#_payment_form')).append($('h1.billing_detail'));
                    androidPayBtn.after(hiddenForms);

                    var expChkOpts = $(document.createElement('div'));
                    expChkOpts.attr('id', '_exp_chk_opts')
                        .addClass('row')
                        .append($('[data-visibility="VISACheckoutLogo"]'))
                        .append($('[data-visibility="VISACheckoutCustomerInfo"]')).append($('[data-visibility="BMLLogo"]'))
                        .append($('[data-visibility="googleWalletLogo"]')).append($('[data-visibility="whatisthis"]'))
                        .append($('[data-id="BillingAddressForm"]')).append($('#divPlaceOrderBtnAmex'))
                        .append($('#checkout_buttons'));
                    hiddenForms.after(expChkOpts);
                }
            }
        }
    }

    function placePayBtn(payBtn) {
        var bodyObj = $('body');

        // FLWS-1856
        var hidePassport = true; // set to false to unhide passport
        var passportBanner = $('#showPpBanner').parent();
        if (hidePassport) {
            passportBanner.addClass('hide');
        }
        // END FLWS-1856

        var recipient = $('#your_recipient');

        var addToCartBtn = $('#styled_addItemTocartButton')
            .parent();
        if (bodyObj.hasClass('fanniemay-brand') || bodyObj.hasClass('cheryls-brand') || bodyObj.hasClass('thepopcornfactory-brand')) {
            addToCartBtn.prepend(payBtn);
        } else {
            // remove the zipcode field
            var zipLocHolder = recipient.find('#_zip_location_type')
                .removeClass('split hide');
            var zipInput = zipLocHolder.find('.input_holder:first-child');
            // put the zip input to the right of location type input to prevent
            // a border from appearing to the left of location type input when zip input is hidden
            zipLocHolder.addClass('hide').append(zipInput.addClass('hide'));
            var zipHeader = $('form[data-id="OrderItemAddForm"]').children('div:contains("Select Location Type")').addClass('hide');

            // remove delivery calendar button and add apple pay button
            var dateBtn = recipient.find('#_pick_delivery_date').addClass('hide');

            // FLWS-2378
            var selAddr = recipient.find('select[data-id="addressBookSelection"]').parent().parent().addClass('force_hide');

            var innerDateBtn = dateBtn.find('div[data-visibility~="div#slidingScaleDeliDate"]'),
                innerDateBtnOnHidden = innerDateBtn.attr('data-onhidden');
            innerDateBtn.removeAttr('data-onhidden');

            // move apple pay button and add to cart button into a split div
            var addToCartBtnClone = addToCartBtn.addClass('hide')
                .clone();
            addToCartBtnClone.find('input')
                .attr('id', 'appAddToCartButton')
                .removeClass('hide inactive_bg')
                .addClass((payBtn.attr('id') == '_apple_pay_btn') ? 'secondary_bg' : 'hollow_button')
                .removeAttr('data-onclick')
                .removeAttr('data-onclick-append')
                .removeAttr('onclick')
                .removeAttr('event-data-method')
                .removeAttr('event-data-value')
                .click(function() {
                    payBtn.parent().addClass('hide');
                    // move back zip input to the left of location type input
                    zipLocHolder.addClass('split').removeClass('hide').prepend(zipInput.removeClass('hide'));
                    dateBtn.removeClass('hide');
                    innerDateBtn.attr('data-onhidden', innerDateBtnOnHidden);
                    if (zipHeader.length) {
                        zipHeader.html(zipHeader.html().replace("Select Location Type", "Enter Delivery Zip Code"))
                            .removeClass('hide');
                    }
                    selAddr.removeClass('force_hide');
                    $(this).addClass('hide');
                    // FLWS-1856
                    passportBanner.removeClass('hide'); // unhide banner when apple pay is disabled
                    if (!zipInput.find('input:enabled').val()) {
                        zipInput.find('input:enabled').focus();
                        bodyObj.scrollTop($(document).height());
                    }
                    // FLT-1229
                    if (bodyObj.hasClass('tablet')) {
                        addToCartBtn.removeClass('hide');
                    }
                });

            recipient.append(
                    '<div class="row half_margin split">' +
                    '</div>'
                ).find('> :last-child')
                .append(addToCartBtnClone.removeClass('hide row half_margin').addClass('input_holder'))
                .append(payBtn);
        }

        //var textMsgInputs 		= $("[id^='giftMessages_']"); 	// real input field(s) for cart message
        var itemID = utag_data.product_base_codes.toString();
        var apGiftMsg = '_GiftMessage_' + itemID;
        var giftMsgTxt = mfw.cookies.get_cookie(apGiftMsg) || '';
        giftMsgTxt = giftMsgTxt.split('|').join(' ');

        var giftMsg = $('#_add_gift_message');
        giftMsg.removeClass('hide');
        giftMsg.find('textarea[data-id="giftMessages"]')
            .focusout(function() {
                if (!(typeof $(this).val() === "undefined" || $(this).val() == '')) {
                    mfw.cookies.writeCookie(apGiftMsg, $(this).val());
                }
            });
        if (giftMsgTxt) {
            giftMsg.val(giftMsgTxt);
            $('input[data-id="_wantGiftMessage"]').closest('div.addGiftMessage').click();
        }
    }
}

// FLT-932 To show hidden items when Applepay is not present
$(document).ready(function() {
    if ((typeof getCookie != "undefined" && getCookie('itemCount') && getCookie('itemCount') != '0') || (!window.ApplePaySession && !window.PaymentRequest)) {
        if ($('body').hasClass('flowers-brand') || $('body').hasClass('fruitbouquets-brand') || $('body').hasClass('baskets-brand')) {
            $('form[data-id="OrderItemAddForm"]').children('div:contains("Enter Delivery Zip Code")').removeClass('hide');
        }
        $("#showPpBanner").parent().removeClass("hide");
        $("#_zip_location_type").addClass('split').removeClass('hide').prepend($("#_zip_location_type").find('input[data-id="zipCode"]').parent().removeClass('hide'));
        $("#_pick_delivery_date").removeClass("hide");
        $("#styled_addItemTocartButton").parent().removeClass("hide");
        $('#_android_pay_btn').parent().addClass('hide');
        if (mfw.cookies.readCookie('logonId')) {
            $("#your_recipient").find('[data-id="addressBookSelection"]').parent().parent().removeClass("force_hide");
        }
    }
});
// End FLT-932

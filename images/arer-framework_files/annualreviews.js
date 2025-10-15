/* plain JS slideToggle https://github.com/ericbutler555/plain-js-slidetoggle */

HTMLElement.prototype.slideToggle = function(duration, callback) {
    if (this.clientHeight === 0) {
      _s(this, duration, callback, true);
    } else {
      _s(this, duration, callback);
    }
  };
  
  HTMLElement.prototype.slideUp = function(duration, callback) {
    _s(this, duration, callback);
  };
  
  HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
  };
  
  function _s(el, duration, callback, isDown) {
  
    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;
  
    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";
  
    var elStyles        = window.getComputedStyle(el);
  
    var elHeight        = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop    = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop     = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom  = parseFloat(elStyles.getPropertyValue('margin-bottom'));
  
    var stepHeight        = elHeight        / duration;
    var stepPaddingTop    = elPaddingTop    / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop     = elMarginTop     / duration;
    var stepMarginBottom  = elMarginBottom  / duration;
  
    var start;
  
    function step(timestamp) {
  
      if (start === undefined) start = timestamp;
  
      var elapsed = timestamp - start;
  
      if (isDown) {
        el.style.height        = (stepHeight        * elapsed) + "px";
        el.style.paddingTop    = (stepPaddingTop    * elapsed) + "px";
        el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
        el.style.marginTop     = (stepMarginTop     * elapsed) + "px";
        el.style.marginBottom  = (stepMarginBottom  * elapsed) + "px";
      } else {
        el.style.height        = elHeight        - (stepHeight        * elapsed) + "px";
        el.style.paddingTop    = elPaddingTop    - (stepPaddingTop    * elapsed) + "px";
        el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
        el.style.marginTop     = elMarginTop     - (stepMarginTop     * elapsed) + "px";
        el.style.marginBottom  = elMarginBottom  - (stepMarginBottom  * elapsed) + "px";
      }
  
      if (elapsed >= duration) {
        el.style.height        = "";
        el.style.paddingTop    = "";
        el.style.paddingBottom = "";
        el.style.marginTop     = "";
        el.style.marginBottom  = "";
        el.style.overflow      = "";
        if (!isDown) el.style.display = "none";
        if (typeof callback === 'function') callback();
      } else {
        window.requestAnimationFrame(step);
      }
    }
  
    window.requestAnimationFrame(step);
  }


function getFirstVisibleElement(selector) {
    // Get all matching elements
    const elements = document.querySelectorAll(selector);
    
    // Loop through the elements and find the first visible one
    for (let i = 0; i < elements.length; i++) {
        if (isElementVisible(elements[i])) {
            return elements[i];
        }
    }
    return null; // If no visible element is found
}

// Helper function to check if an element is visible
function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetHeight > 0;
}



document.addEventListener("DOMContentLoaded", function() {
    const inputSearch = document.querySelector('input#searchText');

    function tabletSearchInputToggle() {
        let searchBoxContainer = document.querySelector('.ar-main-nav .quickSearchFormContainer');
        let searchBoxContainerCompStyles = window.getComputedStyle(searchBoxContainer);
        searchBoxContainer.style.display = searchBoxContainerCompStyles.getPropertyValue('display') === 'none' ? 'block' : 'none';
        searchBoxContainer.classList.toggle('active');

        let mobileSearchBtn = document.querySelector('.mobile-search-btn');
        if (!mobileSearchBtn) {
            //if no mobile search button then return
            console.warn('No mobile search button found.');
            return;
        }
        //switch search icon for close icon
        if (mobileSearchBtn.querySelector('.fa').matches('.fa-search')) {
            mobileSearchBtn.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true"></i>';
            searchBoxContainer.querySelector('input.searchText').focus();
        } else {
            mobileSearchBtn.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
        }
        //toggle event listner on button (since a click away should also remove search box )
        mobileSearchBtn.classList.toggle('js-mobile-search-btn');
    } 

    //add event listner when elements detect input focus
    inputSearch.addEventListener('focus', function(e) { 
        inputSearch.closest('.ar-main-search-form').classList.add('transition', 'active');
    });


    // Add an event listener for when the input loses focus
    inputSearch.addEventListener("blur", function(e) {
        inputSearch.closest('.ar-main-search-form').classList.remove('transition', 'active');

        //trigger on click event on close button when displayed (shown at tablet viewports) when no longer has focus
        if (document.querySelector('.mobile-search-btn i') && document.querySelector('.mobile-search-btn i').matches('.fa-times-circle')){
             setTimeout(function() {
                tabletSearchInputToggle();
             }, 600);
        }
    });

    let hamburgerTriggerLink = document.querySelector('.js_ar-mobile-nav');
    let slideMenuContainer = document.querySelector('#ar-mobile-nav');
    let mobileSiteMenuOpenOverlay = document.querySelector('#mm-blocker');

    function enableFocusTrap() {
        const focusableSelectors = 'a, button, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(slideMenuContainer.querySelectorAll(focusableSelectors)).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    
        // Add #mm-blocker to the start of the list of focusable elements if it exists
        if (mobileSiteMenuOpenOverlay) {
            focusableElements.unshift(mobileSiteMenuOpenOverlay);
        }
    
        if (focusableElements.length > 0) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
    
            function trapFocus(event) {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        // Shift + Tab: Move focus to the last element if on the first
                        if (document.activeElement === firstFocusable) {
                            event.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        // Tab: Move focus to the first element if on the last
                        if (document.activeElement === lastFocusable) {
                            event.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            }
    
            // Add keydown listener for trapping focus
            document.addEventListener('keydown', trapFocus);
    
            // Store the listener for later removal
            slideMenuContainer._trapFocusListener = trapFocus;
        }
    }
    
    function disableFocusTrap() {
        if (slideMenuContainer._trapFocusListener) {
            document.removeEventListener('keydown', slideMenuContainer._trapFocusListener);
            delete slideMenuContainer._trapFocusListener;
        }
    }


    document.addEventListener("keydown", function(event) {
      if (event.target.classList.contains('mm-slideout') && (event.code == "Space" || event.code == "Enter")) {
            event.target.click();
      } 
      if (event.code == "Escape") {
        let mainMenuOpenMenu = document.querySelector('.has-dropdown.open');
        if (slideMenuContainer && slideMenuContainer.classList.contains('mm-opened')) {
          document.querySelector('.mm-slideout').click();
        }
        if (mainMenuOpenMenu){
            //reset keyboard focus back to link opener
            const menuLink =  mainMenuOpenMenu.querySelector('a');
            if (menuLink) {
                menuLink.focus();
                mainMenuOpenMenu.classList.remove('open');
                menuLink.setAttribute('aria-expanded', "false");
            }
         
        }
      }
    });
const slideMenu = document.querySelector('.mm-page.mm-slideout');
    document.addEventListener('click', function(event) { 
        //this is for the slide in/out menu (on mobile)
        if (event.target.classList.contains('js_ar-mobile-nav') || event.target.classList.contains('mm-slideout')) {
            event.preventDefault();
            let htmlElement = document.querySelector('html.pb-page')
                htmlElement.classList.toggle('mm-opened'); 
                htmlElement.classList.toggle('mm-background');
                htmlElement.classList.toggle('mm-right');
                htmlElement.classList.toggle('mm-pageshadow') 
                htmlElement.classList.toggle('mm-opening');
                htmlElement.classList.toggle('mm-blocking');

            
                slideMenuContainer.classList.toggle('mm-current');
                slideMenuContainer.classList.toggle('mm-opened');

                //toggle aria-expanded attribute on links
                hamburgerTriggerLink.setAttribute('aria-expanded', hamburgerTriggerLink.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');

                //toggle inert attribute between true and false on slideMenu and tabIndex need to do this before setting focus
                slideMenu.inert = slideMenu.inert ? false : true;
                slideMenu.setAttribute('tabIndex', slideMenu.getAttribute('tabIndex') === '-1' ? '0' : '-1');

                   //if opened then move focus to close expand overlay div first this should be the first focusable element
                if (slideMenuContainer.classList.contains('mm-opened')) {
                    mobileSiteMenuOpenOverlay.focus();
                    //now I have verified the menu is open I need to trap focus within the site until the menu is closed
                    enableFocusTrap();
                    mobileSiteMenuOpenOverlay.setAttribute('aria-expanded', 'true');
                    
                } else {
                    disableFocusTrap();
                    hamburgerTriggerLink.focus();
                    mobileSiteMenuOpenOverlay.setAttribute('aria-expanded', 'false');
                }
        }
        if (event.target.classList.contains('icon-search-trigger')) {
            event.preventDefault();
            event.target.classList.toggle('active');
            //toggle aria-expanded attribute on links
            event.target.setAttribute('aria-expanded', event.target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');

            //toggle aria-label attribute on links between "open site search" and "close site search"
            event.target.setAttribute('aria-label', event.target.getAttribute('aria-label') === 'open site search' ? 'close site search' : 'open site search');

            let mobileSearchContainer = document.querySelector('.mobile-search-container');
            // mobileSearchContainer.querySelector('.ar-main-search-form').classList.toggle('active');
            // mobileSearchContainer.querySelector('.ar-main-search-form').classList.toggle('transition');
            
            mobileSearchContainer.slideToggle();
            mobileSearchContainer.classList.toggle('active');

            if (mobileSearchContainer.classList.contains('active')) {
                let searchInput = mobileSearchContainer.querySelector('input#mobile-searchText');
                if (searchInput) {
                    searchInput.focus();
                }
            }

        }
        
        if (event.target.classList.contains('js-mobile-search-btn') || event.target.parentNode.classList.contains('js-mobile-search-btn')) {
            event.preventDefault();
          
            tabletSearchInputToggle();
            
        }

        //this is for the parent sub menu right arrow within the slide out menu
        if (event.target.classList.contains('mm-next') || (event.target.classList.contains('js-mm-next') && event.target.dataset.target) ) {
                    event.preventDefault();
             
                let target = event.target.dataset.target;
                let parentMenu = event.target.closest('.mm-panel');
                disableFocusTrap();
           
                slideMenuContainer.querySelector(target).classList.remove('mm-hidden');
                //delay before adding class to allow for css transition
                setTimeout(function() {
                    parentMenu.classList.remove('mm-current');
                    parentMenu.classList.add('mm-subopened');
                    enableFocusTrap();
                    slideMenuContainer.querySelector(target).classList.add('mm-highest', 'mm-current', 'mm-opened');
                    slideMenuContainer.querySelector(`${target} .mm-navbar a`).focus();
                }, 200);
                //delay before hiding parent menu (enough time for css transition to complete)
                setTimeout(function() {
                    parentMenu.classList.add('mm-hidden');
                    
                }, 1000);

        }

        //this is for the child sub menu within the slide out menu's (return to parent)
        if (event.target.classList.contains('mm-prev')) {
            event.preventDefault();
            let clickedElem = event.target;
            disableFocusTrap();
            //the previous menu is the parent menu
            let parentMenu = clickedElem.closest('.mm-panel');

                parentMenu.classList.remove('mm-current', 'mm-opened');
            let target = clickedElem.dataset.target;
                slideMenuContainer.querySelector(target).classList.remove('mm-subopened', 'mm-hidden');
                slideMenuContainer.querySelector(target).classList.add('mm-current');

                //1sec delay before focus is set back to parent link
                setTimeout(function() {
                    parentMenu.classList.add('mm-hidden');
                    enableFocusTrap();
                    const parentLink = slideMenuContainer.querySelector(`${target} .mm-listview a[href$=${parentMenu.id}]`)
                    if( parentLink) {
                        parentLink.focus();
                    }
                }, 1000);
            
        }

        if(event.target.dataset.service) {
            event.preventDefault();
            let a, i = window.location.href;

            function openWindow(e) {
                var t = screen.height / 3 - 150
                  , a = screen.width / 2 - 250;
                window.open(e, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=500,height=300,top=" + t + ",left=" + a)
            }

            switch (event.target.dataset.service) {
            case "facebook":
                openWindow(a = "https://www.facebook.com/sharer/sharer.php?u=" + i);
                break;
            case "twitter":
                openWindow(a = "https://twitter.com/intent/tweet/?url=" + i);
                break;
            case "reddit":
                openWindow(a = "https://www.reddit.com/submit?url=" + i);
                break;
            case "linkedin":
                openWindow(a = "https://www.linkedin.com/shareArticle?mini=true&url=" + i);
                break;
            case "email":
                (function t(a) {
                    if ($(".article-header").length) {
                        var i, n, o, r = e("title").text();
                        i = (r = r.split("|"))[0].trim(),
                        n = r[1].trim(),
                        console.log(i),
                        console.log(n),
                        o = "From the " + n + ": " + i + "\r\n\n"
                    } else
                        i = "From Annual Reviews",
                        o = "";
                    var l = o + a + "\r\n\nYou are receiving this email because another reader/user wanted to share it with you. To learn more, visit http://www.annualreviews.org.\r\n\nAbout Annual Reviews\r\n\nAnnual Reviews publishes authoritative, analytic reviews within the Biomedical, Life, Physical, and Social Sciences. Since 1932, Annual Reviews publications have ranked consistently among the most highly cited in the scientific literature.\r\n\nFor more information about Annual Reviews, to view additional content, receive email alerts, or to subscribe to any Annual Reviews journals, visit http://www.annualreviews.org.\r\n\nCopyright " + new Date().getFullYear() + ", Annual Reviews. All Rights Reserved.";
                    l = encodeURIComponent(l),
                    window.location.href = "mailto:?subject=" + i + "&body=" + l
                }
            )(i);
            break;
            case "print":
                window.print()
            }
        }
        

    });

    let getSiblings = function (e) {
        // for collecting siblings
        let siblings = []; 
        // if no parent, return no sibling
        if(!e.parentNode) {
            return siblings;
        }
        // first child of the parent node
        let sibling  = e.parentNode.firstChild;
        
        // collecting siblings
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== e) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
        }
        return siblings;
    };



// Document-level touch handler to close open dropdowns when clicking outside
document.addEventListener('touchstart', function(event) {
    // Get the currently open dropdown
    const openDropdown = document.querySelector('#ar-main-nav li.has-dropdown.open');
    
    // If there's an open dropdown and the touch is outside of it
    if (openDropdown && !openDropdown.contains(event.target)) {
        // Close the dropdown
        openDropdown.classList.remove('open');
        const anchorElement = openDropdown.querySelector('a');
        if (anchorElement) {
            anchorElement.setAttribute('aria-expanded', "false");
        }
    }
});

//Main desktop menu helper scripts used for Accessibility
const menuItems = document.querySelectorAll('#ar-main-nav li.has-dropdown');
let timer;


Array.prototype.forEach.call(menuItems, function(el){

    //if it does not contain a link then return
    if(!el.querySelector('a')) {
        return;
    }
         
    //mouse helper function
    el.addEventListener("mouseover", handleMenuOpen);
    el.addEventListener("touchstart", handleMenuOpen);

    function handleMenuOpen(event) {
    
        // Prevent default behavior only for touch events to avoid unwanted navigation
         if (event.type === "touchstart" && !event.target.closest('.ar-dropdown')) {
             event.preventDefault();
            
            // Check if this dropdown is already open, if so close it and return
            if (this.classList.contains('open')) {
                this.classList.remove('open');
                let anchorElement = this.querySelector('a');
                if (anchorElement) {
                    anchorElement.setAttribute('aria-expanded', "false");
                }
                return;
            }
         }
        
        let siblings = getSiblings(this);
        siblings.map(e => {
            e.classList.remove('open');
            let anchorElement = e.querySelector('a');
            if (anchorElement) {
                anchorElement.setAttribute('aria-expanded', "false");
            }
        });

        let menuSiblings = getSiblings(this.parentNode);
        menuSiblings.map(e => {
            let openmenus = e.querySelector(".has-dropdown.open")
            if(openmenus){
                openmenus.classList.remove('open');
                let menuAnchorElement = openmenus.querySelector('a');
                if (menuAnchorElement) {
                    menuAnchorElement.setAttribute('aria-expanded', "false");
                }

            }
        });

        this.classList.add('open');
        let anchorElement = this.querySelector('a');
        if (anchorElement) {
            anchorElement.setAttribute('aria-expanded', "true");
        }
        clearTimeout(timer);
    }

     el.querySelector('a').addEventListener("click",  function(event){
		if (!this.parentNode.classList.contains("open")) {
            event.preventDefault();
            let documentOpen = document.querySelector(".has-dropdown.open");
            if (documentOpen){
                documentOpen.classList.remove('open');
            }
			this.parentNode.classList.add("open");
			this.setAttribute('aria-expanded', "true");
		} else {    
			this.parentNode.classList.remove("open");
			this.setAttribute('aria-expanded', "false");
		}
		
		
	}); 
    el.addEventListener("mouseout", function(){
		timer = setTimeout(function(){
            for (let el of menuItems) {
			    el.classList.remove('open');
                let anchorElement = el.querySelector('a');
                if (anchorElement) {
                    anchorElement.setAttribute('aria-expanded', "false");
                }
                
            }
		}, 500);
	});
    //if menu item or any of its sub menu items is not in focus then the menu should close
    el.addEventListener("focusout", function(event){
        if (!el.contains(event.relatedTarget)) {
             el.classList.remove('open');
             let anchorElement = el.querySelector('a');
            if (anchorElement) {
                el.querySelector('a').setAttribute('aria-expanded', "false");
            }
        }
    });

    
});

});

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');

    buttons.forEach(button => {
        const targetSelector = button.getAttribute('data-target');
        const targetMenu = document.querySelector(targetSelector);

        if (!targetMenu) {
            console.warn(`Target menu not found for selector: ${targetSelector}`);
            return;
        }

        // Trap focus inside expanded menu
        targetMenu.addEventListener('keydown', (e) => {
            const focusable = Array.from(targetMenu.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])'))
                .filter(el => !el.disabled && el.offsetParent !== null);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    // Shift+Tab on first → collapse and focus back to button
                    e.preventDefault();
                    $(targetMenu).collapse('hide');
                    button.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    // Tab on last → just collapse and let browser move focus to next naturally
                    $(targetMenu).collapse('hide');
                }
            }
            // ESC to collapse and return focus to button
            if (e.key === 'Escape') {
                $(targetMenu).collapse('hide');
                button.focus();
                e.preventDefault();
                return;
            }
        });
    });
});
$(document).ready(function() {
    $(document).on('click', '.socialicon-wechat', function(e) {
        e.preventDefault();
        $(".modal-wechat").show();
    });

    $("#weChatModal span.close").click(function () {
        $(".modal-wechat").hide();
    });

});


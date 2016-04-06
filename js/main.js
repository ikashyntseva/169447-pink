(function(){
    function toggleClass(el, className) {
        if (el.classList) {
          el.classList.toggle(className);
        } else {
          var classes = el.className.split(" ");
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
          else
            classes.push(className);

          el.className = classes.join(" ");
        }
    }
    function removeClass(el, className) {
        if (el.classList)
          el.classList.remove(className);
        else
          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
    function menuToggle(event) {
        var menuDisplay = document.querySelector(".menu").style.display;
        toggleClass(document.querySelector(".menu__button"), "menu__button--close");
        menuDisplay == "" ||  menuDisplay == "none" ? menuDisplay = "block" : menuDisplay = "none";
        document.querySelector(".menu").style.display =  menuDisplay;
    }
    var clientWidth = document.body.clientWidth;
    var menuButton =  document.querySelector(".menu__button");
    var menu = document.querySelector(".menu");
    var header = document.querySelector(".page-header");
    window.onload = function() {
       if(menu) {
           if((menu.className.indexOf("menu--open") !==1) && (menuButton.className.indexOf("menu__button--close") !==1)) {
               removeClass(menu, "menu--open");
               toggleClass(menuButton, "menu__button--close");
               removeClass(header, "page-header--no-js");
           }
       }
    }


    if(menuButton){
      menuButton.addEventListener("click", menuToggle);
    }

}());

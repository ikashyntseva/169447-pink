(function(){
    function toggleClass(el, className) {
        if (el.classList) {
          el.classList.toggle(className);
        } else {
          var classes = el.className.split(' ');
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
          else
            classes.push(className);

          el.className = classes.join(' ');
        }
    }
    function menuToggle(event) {
        var menuDisplay = document.querySelector('.menu').style.display;
        toggleClass(document.querySelector('.menu__button'), 'menu__button--close');
        menuDisplay == '' ||  menuDisplay == 'none' ? menuDisplay = 'block' : menuDisplay = 'none';
        document.querySelector('.menu').style.display =  menuDisplay;
    }

    var menuButton =  document.querySelector('.menu__button');
    if(menuButton){
      menuButton.addEventListener('click', menuToggle);
    }
}());

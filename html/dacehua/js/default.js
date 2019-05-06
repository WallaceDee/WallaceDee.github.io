 function fgTab(tabNav, tabBody) {
     var tabMenu = document.getElementById(tabNav);
     var tabTitle = tabMenu.getElementsByTagName('li');
     var tabContent = document.getElementById(tabBody);
     var tabBody = tabContent.getElementsByTagName('div');

     function switchTab(i) {
         tabTitle[i].onclick = function() {
             for (j = 0; j < tabTitle.length; j++) {
                 if (i == j) {
                     tabTitle[j].className = 'curent';
                     tabBody[j].style.display = "block";
                 } else {
                     tabTitle[j].className = '';
                     tabBody[j].style.display = "none";
                 }
             }
         }
     }
     for (i = 0; i < tabTitle.length; i++) {
         switchTab(i);
     }
 }

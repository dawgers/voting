// function toggle_visibility(id) {
      // var e = document.getElementById(id);
      // if(e.style.display == 'block')
       //   e.style.display = 'none';
       //else
         // e.style.display = 'block';
  //  }
function bodyOnLoad(){

  document.getElementById( 'slide-s-nav' ).addEventListener( 'click', function() {

    ( slidenav.style.width == '256px' || slidenav.style.width == '' )
      ? slidenav.style.width = '0%'
      : slidenav.style.width = '256px';


  }, false );


  var tabLinks = document.querySelectorAll('ul.tabs li a');

  for (var i = 0; i < tabLinks.length; i++) {
    tabLinks[i].onclick = function() {
      var target = this.getAttribute('href').replace('#', '');
      var sections = document.querySelectorAll('div.cus-tab-content');

      for(var j=0; j < sections.length; j++) {
        sections[j].style.display = 'none';
      }

      document.getElementById(target).style.display = 'block';

      for(var k=0; k < tabLinks.length; k++) {
        tabLinks[k].removeAttribute('class');
      }

      this.setAttribute('class', 'is-active-lg');

      return false;
    }
  };


  var tabLinks1 = document.querySelectorAll('ul.tabs-sm li a');

  for (var i = 0; i < tabLinks1.length; i++) {
    tabLinks1[i].onclick = function() {
      var target = this.getAttribute('href').replace('#', '');
      var sections = document.querySelectorAll('div.tab-content-sm');

      for(var j=0; j < sections.length; j++) {
        sections[j].style.display = 'none';
      }

      document.getElementById(target).style.display = 'block';

      for(var k=0; k < tabLinks1.length; k++) {
        tabLinks1[k].removeAttribute('class');
      }

      this.setAttribute('class', 'is-active');

      return false;
    }
  };
  
  

}


function openViewClickNewPopup(){
	    var e = document.getElementById('newPopup');
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
	   /*var section = document.querySelectorAll('.cp-detailBox');
	   section.animate({
		  width: "toggle"
		});*/
  }
function openAudiencePopup(){
	    var e = document.getElementById('audiencePopup');
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
}


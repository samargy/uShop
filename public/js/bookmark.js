
$(document).ready(function(){
    $("#bookmarkDropdown").hide()
    $("#bookmarkBTN").click(function(){
      $('#bookmarkDropdown').fadeIn()
    });
  });

  $(document).mouseup(function(e) 
  {
      var container = $("#bookmarkDropdown");
  
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
          container.fadeOut();
      }
  });
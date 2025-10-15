$(document).ready(function(){

    $('.js-related-content-load').click(function()  {
    	var parentContainer = $(this).closest('li');
          
    	
    	    if (!$(this).hasClass('opened')) {
    	        $(this).addClass('opened');   
    	        
    	        returnRelatedContent(parentContainer);
    	    }
    });


    if ($('#js-recommend-load').length > 0) {
        function removeSidebarContainer() {
                //no recommended data returned remove the sidebar content from the DOM!
                $('#js-recommend-load').closest('.sidebar-pub2web-element').remove();
        }
        // pass optional function in. 
         returnRelatedContent($('#js-recommend-load'), removeSidebarContainer);
     }
});
   

   
function returnRelatedContent(parentContainer, noResultsReturnedFunctionToBeRun){
    
    
    var moreLikeThisContainer = parentContainer.find('.morelikethiscontainer');
    
     var morelikethisurl = $("#hiddenContext").text() + '/search/morelikethis';
     
     var pubrelatedcontentids = moreLikeThisContainer.children(".hiddenmorelikethisids").text().replaceAll(/\s+/g, ' ');
     var webid = moreLikeThisContainer.children(".hiddenmorelikethiswebid").text().replaceAll(/\s+/g, ' ');
     var fields = moreLikeThisContainer.children(".hiddenmorelikethisfields").text().replaceAll(/\s+/g, ' ');
     var restrictions = moreLikeThisContainer.children(".hiddenmorelikethisrestrictions").text().replaceAll(/\s+/g, ' ');
     var number = moreLikeThisContainer.children(".hiddenmorelikethisnumber").text().replaceAll(/\s+/g, ' ');
     var numbershown = moreLikeThisContainer.children(".hiddenmorelikethisnumbershown").text().replaceAll(/\s+/g, ' ');

     var data = {'pubrelatedcontentids': pubrelatedcontentids, 'webid': webid, 'fields': fields, 'restrictions': restrictions, 'number': number, 'numbershown': numbershown, 'fmt' : 'ahah'};
     
     
     if (fields && webid && number && numbershown){
        moreLikeThisContainer.append('<img id="loader" src="/images/jp/spinner.gif" alt="Loading" width="21">');
         $.post(morelikethisurl, data, function(resp) {
             let $resp = $(resp);
             $resp.find('h3').each(function() {
                 let $h3 = $(this);
                 $h3.html($h3.html().replace('<p>', '').replace('</p>', ''));
             });
            moreLikeThisContainer.html($resp);

            ingentaCMSApp.displayElipsisDescription();

               moreLikeThisContainer.siblings(".tocitem").show();
               
            //inclusion of the class js-articleMetadata should give us a indication of data being returned!
            if (moreLikeThisContainer.find(".js-articleMetadata").length === 0 
                && noResultsReturnedFunctionToBeRun) {
                noResultsReturnedFunctionToBeRun();
            } 
     }); 
         
     }

}

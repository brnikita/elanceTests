(function(){
    var apiPath = 'http://10.10.2.134/api/';
    $.get(apiPath + 'check_answer').done(function(response){
        console.log(response);
    });
})();
(function(){
    var apiPath = 'http://soshace.com/api/';
    $.get(apiPath + 'check_answer').done(function(response){
        console.log(response);
    });
})();
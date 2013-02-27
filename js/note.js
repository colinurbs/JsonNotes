 $("#input").typeahead({
        prefetch: 'notes.json'
        }); 

        $("input").keypress(function(event) {
        if (event.which == 13) {
        input();
        }
        });
        $('#input').focus();
        //function to load an display notes
        function load(){
        var notes = $.getJSON('notes.json');
        $.getJSON('notes.json', function(data) {
            $('#num').html(length);
            $('#notes').empty();
            data.posts.reverse();
            var length = data.posts.length;
            //display notes
                for (var i = 0; i < length; i++) {
                    if (typeof data.posts[i]['title'] != 'undefined'){
                    $('#notes').append('<div class="one-third column note"><span style="width:100%;background:#ddd;padding:2px;padding-right:10px; padding-left:10px;"><b>'+data.posts[i]['title'].replace("@","")+'</b><a class="delete" onclick=del(\''+data.posts[i]['title']+'\')>X</a></span><div id="'+i+'"  onClick="this.contentEditable=\'true\';" onblur="e('+i+')" class="inner">'+data.posts[i]['text']+'</div></div>');  
                    }
                };
            }); 
        $('#input').val("");
        }
        //delet function
        function del(title){
            if(confirm('Delete '+title+'?')){
                $.ajax({
                    url: "json.php",
                    type: "POST",
                    data: ({action:"del",title:title}),
                    context: document.body
                    }).done(function() {
                    load();
                });
            }
        }
        //edit function (allows editing via onclick)
        function e(id){
        var div = '#'+id;
        var text = $(div).html();
            $.getJSON('notes.json', function(data) {
                data.posts.reverse();
                title = data.posts[id]['title'];
                to_json(title,text)
            });
        }
        //main function to filter and sort input
        function input(){
        //set variables
        var special = [];
        var title = [];
        var tags = [];
        var text = [];
        var text = document.getElementById('input').value;
        var data = text.split(" ");
        var length = data.length;
        //add titles to title array
            for (var i = 0; i < length; i++) {
            var result = data[i].search("@");
                if(result>=0){
                    title.push(data[i]);
                    special.push(i);
                };
            }
        //add tags to tag array
            for (var i = 0; i < length; i++) {
            var result = data[i].search("#");
                if(result>=0){
                    tags.push(data[i]);
                    special.push(i);                
                };
            }
        //remove tags and title from remaining data
        var length = special.length;
            for (var i = 0; i < length; i++) {
            delete data[special[i]];
            }
        //send AJAX write request
        $.ajax({
            url: "json.php",
            type: "POST",
            data: ({action:"write",title:title[0],text:data,tags:tags}),
            context: document.body,
            success: function(){load();}
            });
        }
        //save to json via ajax
        function to_json(title,text){
        text = text.split(" ");
        $.ajax({
            url: "json.php",
            type: "POST",
            data:({edit:'1',action:"write",title:title,text:text}),
            context: document.body,
            success: function(){load();}
            });  
        }
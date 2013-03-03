//setup stuff
$('#input').val("");
$("#input").attr("autocomplete","off");
$("input").keypress(function(event) {
if (event.which == 13) {
input();
}
});
       //load and display notes
       $(document).ready(function(){
        var data = load();
        write_notes(data);
        });

        //function to load notes
        function load(){
        var notes;
        $.getJSON('notes.json', function(data) {
            
            write_notes(data);
           
        });
       }
       //display notes
        function write_notes(data){
        console.log(data);
        $('#num').html(length);
        $('#notes').empty();
        data.posts.reverse();
        var length = data.posts.length;
            //display notes
                for (var i = 0; i < length; i++) {
                    if (typeof data.posts[i]['title'] != 'undefined'){
                    $('#notes').append('<div  id="'+i+'" class="one-third column note"><span style="padding:5px;width:100%;background:#ddd;padding:2px;padding-right:10px; padding-left:10px;"><b>'+data.posts[i]['title'].replace("@","")+'</b><a class="delete" onclick=del(\''+data.posts[i]['title']+'\')>x</a><a class="expand" onclick="expand('+i+')">+</a></span><div id="'+i+'"  onblur="e('+i+')" onClick="this.contentEditable=\'true\';" class="inner">'+data.posts[i]['text']+'</div></div>');  
                    }

                };
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
        var text = $(div+' .inner').html();
            $.getJSON('notes.json', function(data) {
                data.posts.reverse();
                title = data.posts[id]['title'];
                to_json(title,text,"write")
            });
        }

        //expand note
        function expand(id){
        var div = '#'+id;
        note_width = $(div).width();
        $(div+' .inner').css({
            'overflow-y': 'scroll',
            'overflow-x': 'hidden'
        });
        $(div).animate({
            width: 940,
        });
        $(div+' .expand').html('-');
        $(div+' .expand').attr('onclick', 'expand_c('+id+','+note_width+')');
        }

        function expand_c(id,width,height){
        var div = '#'+id;
        $(div).animate({
        width: width,
        });
        $(div+' .inner').css({
            'overflow-y': 'hidden'
        });
        $(div+' .expand').html('+');
        $(div+' .expand').attr('onclick', 'zoom('+id+')');
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
       to_json(title[0],data.join(" "),"write");
         }
        //save to json via ajax
        function to_json(title,text,action){
        text = text.split(" ");
        $.ajax({
            url: "json.php",
            type: "POST",
            data:({edit:'1',action:action,title:title,text:text}),
            context: document.body,
            success: function(){load();}
            });  
        }
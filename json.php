<?php
$starttime = $mtime;
//if this is a write, this variable is set if the write is appending a previously created note
$update = 0;
//if this action is an edit from an onclick event
$edit   = 0;
//set variables
$edit   = $_POST['edit'];
$text   = implode(" ", $_POST['text']);
$title  = $_POST['title'];
$tags   = $_POST['tags'];
$data   = load();
$action = $_POST['action'];

//write
if ($action == "write") {
    
    
    foreach ($data['posts'] as &$post) {
        
        if ($post->title == $title) {
            $update = 1;
            
            if ($edit == 1) {
                $post->text = $text;
                
            } else {
                $post->text = $post->text . $text;
            }
            
        }
        
        
        
    }
    
    if ($update == 0) {
        $data['posts'][] = array(
            'title' => $title,
            'text' => $text,
            'tags' => $tags
        );
        
    }
    
    if (save($data)) {
        return true;
    }
    
}

//delete
if ($action == "del") {
    
    
    
    
    foreach ($data['posts'] as $post) {
        
        if ($post->title == $title) {
            
            
            unset($post->title);
            unset($post->text);
            unset($post->tags);
            //unset($post);
            
        }
    }
    
    
    
    
    if (save($data)) {
        return true;
    }
}


function load()
{
    
    $string = file_get_contents('notes.json');
    return (array) json_decode($string);
}

function save($data)
{
    $json = json_encode($data);
    $fp   = fopen('notes.json', 'w');
    fwrite($fp, $json);
    fclose($fp);
    return true;
    
}
?>
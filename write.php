<?php
include 'ChromePhp.php';
$starttime = $mtime; 

		$edit = 0;
		$text = implode(" ",$_POST['text']);
		$title = $_POST['title'];
		$tags = $_POST['tags'];
		$data = load();
		$action = $_POST['action'];
		ChromePhp::log($action);
		if ($action == "write"){


		foreach ($data['posts'] as &$post){

			if ($post->title ==$title){
				$edit = 1;
				$post->text = $post->text.'</br>'.$text;
			}

		
			
		}

		if ($edit ==0){
		$data['posts'][] = array(
			'title'=>$title,
			'text'=>$text,
			'tags'=>$tags
			);

		}

		if (save($data)){
	return true;
}

}

if ($action == "del"){
ChromePhp::log("deleting..");
ChromePhp::log($title);



	foreach ($data['posts'] as $post){
		
		if ($post->title ==$title){
				
				ChromePhp::log($post);
				unset($post->title);
				unset($post->text);
				unset($post->tags);
				//unset($post);
				
			}
		}
		



			if (save($data)){
	return true;
}
}


function load(){

	$string = file_get_contents('notes.json');
	return (array)json_decode($string);
}

function save($data){
$json = json_encode($data);
		$fp = fopen('notes.json', 'w');
		fwrite($fp,$json);
			fclose($fp);
return true;

}
?>
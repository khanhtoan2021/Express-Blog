$(document).ready(()=>{
	//let a=moment("2010-10-20 4:30", "YYYY-MM-DD HH:mm"); 
	//alert(a);
	$(".leftContent").on('submit','form.addForm1',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let formData = new FormData(this);
		$.ajax({
			url:'/users/register',
			type: 'POST',
			dataType: 'json',
			contentType: false,
			processData: false,
			cache: false,
			data: formData
		}).done(function(res) {
			let result=JSON.parse(res);
			console.log(result);
		}).fail(function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		});
	});	
	$(".leftContent").on('submit','form.loginForm1',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let formData = new FormData(this);
		//let data={email:formData.get('email'),password:formData.get('password')}
		let data=$(this).serializeArray();
		//console.log(formData);
		//return;
		$.ajax({
			url:'/users/login',
			type: 'POST',
			dataType: 'json',
			data: data
		}).done(function(res) {
			let result=JSON.parse(res);
			console.log(result);
		}).fail(function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		});
	});	
	$('.leftContent').on('change','.imgload',function(e){
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.imgshow').attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
		}
	});
	$('.leftContent .buttonAdd').hide();
	$('.leftContent').on('click','a.addCatalogy ',function(e){
		let name=$(this).children('span').text();
		$('.leftContent .buttonAdd').toggle(function(){
			if (name==='Cancel') {
				$('.leftContent a.addCatalogy span ').text("addCatalogy");
			}else{
				$('.leftContent a.addCatalogy span ').text("Cancel");
			}
		});
	});
	//Ajax add new a catalogy
	$(".leftContent").on('click','button#button-addon2',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let article = $('.leftContent input#article').val();
		$.ajax({
			url:'/postCatalogies/addCatalogy',
			type: 'POST',
			dataType: 'json',
			data: data
		}).done(function(res) {
			let result=JSON.parse(res);
			console.log(result);
		}).fail(function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		});
	});	
//Ajax new comment
	$(".leftContent").on('submit','form#comment',function(e){
		e.preventDefault();//ngan chan link href default chay 
		//let formData = new FormData(this);
		//let data={email:formData.get('email'),password:formData.get('password')}
		let data=$(this).serializeArray();
		//console.log(formData);
		let url=$(this).attr('action');
		$.ajax({
			url:url,
			type: 'POST',
			dataType: 'json',
			data: data
		}).done(function(res) {
			let result=JSON.parse(res);
			//console.log(result.session);
			//console.log(result.val);
			let str=`
			<div class="d-flex border my-3 p-3">
				<div class="avatar me-4" style="width:100px">
					<img class="rounded-circle m-auto" src="/img/avatars/${result.session.avatar}" style="width:30px" alt="avatar">
					<p>${result.session.fullName}</p>
				</div>
				<div class="comment">
					<p>${result.val.content}</p>
					<ul class="nav">
						<li class="nav-item">
							<p class="nav-link"><i class="fas fa-clock me-1"> </i><span class="date">${moment(result.val.created).fromNow()}</span></p>
						</li>
						<li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-thumbs-up me-1"></i>like</a></li>
						<li class="nav-item"><a class="commentReply nav-link" href="#"><i class="fas fa-comments me-1"></i>reply</a></li>
					</ul>
					<div class="d-flex detailReply d-none">
						<div class="avatar me-1" style="width:40px"><img class="rounded-circle m-auto" src="/img/avatars/${result.session.avatar}" style="width:30px" alt="avatar" /></div>
						<div class="input-group mb-3"><input class="form-control" type="text" placeholder="Add a reply here!" /><button class="btn btn-outline-secondary me-3" id="buttonSend" alt="${result.session._id}.${result.val.posts_id}.${result.val.path}" type="button">Send</button><button class="btn btn-outline-secondary" id="buttonCancel" type="button">Cancel</button></div>
					</div>
				</div>
			</div>`;
			$('.leftContent .commentList').append(str);
			let curVal=$('.leftContent span.commentSum').text();
			$('.leftContent span.commentSum').text(parseInt(curVal) +1);
		}).fail(function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		});
	});	
//Ajax new reply
	$(".leftContent").on('click','button.buttonSend',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let ele=$(this).parent().parent().parent().parent().parent();
		let content=$(this).prev().val();
		//let content=ele.children('.detailReply').children('.input-group').children('.form-control').val();
		//let comments_id=ele.children('.detailReply').children('.input-group').children('#buttonSend').attr('alt');
		let reply_id=$(this).attr('alt');
		$.ajax({
			url:'/posts/reply',
			type: 'POST',
			dataType: 'json',
			data: {content:content,reply_id:reply_id}
		}).done(function(res) {
			let result=JSON.parse(res);
			//console.log(result.session);
			//console.log(result);
			//return;
			let str=`
			<div class="d-flex border my-3 p-3">
				<div class="avatar me-4" style="width:100px">
					<img class="rounded-circle m-auto" src="/img/avatars/${result.session.avatar}" style="width:30px" alt="avatar">
				</div>
				<div class="comment">
					<p>${result.val.content}</p>
					<ul class="nav">
						<li class="nav-item">
							<p class="nav-link"><i class="fas fa-clock me-1"> </i><span class="date">${moment(result.val.created).fromNow()}</span></p>
						</li>
						<li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-thumbs-up me-1"></i>like</a></li>
						<li class="nav-item"><a class="commentReply nav-link" href="#"><i class="fas fa-comments me-1"></i>reply</a></li>
					</ul>
					<div class="d-flex detailReply d-none">
						<div class="avatar me-1" style="width:40px"><img class="rounded-circle m-auto" src="/img/avatars/${result.session.avatar}" style="width:30px" alt="avatar" /></div>
						<div class="input-group mb-3"><input class="form-control" type="text" placeholder="Add a reply here!" /><button class="btn btn-outline-secondary me-3" id="buttonSend" type="button">Send</button><button class="btn btn-outline-secondary" id="buttonCancel" type="button">Cancel</button></div>
					</div>
				</div>
			</div>`;
			ele.append(str);
			$('.leftContent .comment .detailReply').addClass('d-none');

			//let curVal=$('.leftContent span.commentSum').text();
			//$('.leftContent span.commentSum').text(parseInt(curVal) +1);
		}).fail(function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		});
	});		
	//show Form when click on Reply
	$(".leftContent").on('click','a.commentReply',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let select=$(this).parent().parent().parent();
		select.children('.detailReply').removeClass('d-none');
		//$('.leftContent .detailReply').removeClass('d-none');
	});
	$(".leftContent").on('click','a.commentReplyReply',function(e){
		e.preventDefault();//ngan chan link href default chay 
		let select=$(this).parent().parent().parent();
		select.children('.detailReply').removeClass('d-none');
		//$('.leftContent .detailReply').removeClass('d-none');
	});
	$(".leftContent").on('click','button#buttonCancel',function(e){
		e.preventDefault();//ngan chan link href default chay 
		$('.leftContent .detailReply').addClass('d-none');
	});
	// ClassicEditor
	// 	.create(document.querySelector('#editor22'))
	// 	.then(editor => {
	// 		console.log(editor);
	// 	})
	// 	.catch(error => {
	// 		console.error(error);
	// 	});
	ClassicEditor
	.create( document.querySelector( '#editor' ), {
		ckfinder: {
			uploadUrl: '/posts/uploadImages?command=QuickUpload&type=Files&responseType=json',
		},
		toolbar: [ 'ckfinder', 'imageUpload', '|', 'heading', '|', 'bold', 'italic', '|', 'undo', 'redo' ]
	} )
	.catch( error => {
		console.error( error );
	} );	
})	

	
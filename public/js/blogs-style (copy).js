$(document).ready(()=>{
	$('a#sigin').click(function(e) {
		e.preventDefault();
		// Sigin Form use to regis users
		let str=`
		<div class="card-body border w-50 my-3 m-auto">
			<div class="errMessage"></div>
		    <form class="addForm" action="/" method="post" enctype="multipart/form-data">
		        <div class="form-group"><label>Full Name</label><input class="form-control my-1" type="text" name="fullName" required="required" /></div>
		        <div class="form-group"><label>Your Email</label><input class="form-control my-1" type="text" name="email" required="required" /></div>
		        <div class="form-group"><label>Password</label><input class="form-control my-1" type="password" name="password" required="required" /></div>
		        <div class="form-group"><label>Password Confirmation</label><input class="form-control my-1" type="password" name="passwordConfirm" required="required" /></div>
		        <div class="form-group"><label>Age</label><input class="form-control my-1" type="number" name="age" required="required" /></div>
		        <div class="form-group"><label>Phone number</label><input class="form-control my-1" type="number" name="phone"/></div>
		        <div class="form-group"><label>Gender</label><select class="form-control my-1" name="gender" required="required">
		                <option value="Nam">Nam</option>
		                <option value="Nữ">Nữ</option>
		            </select></div>
		        <div class="form-group"><label>Avatar</label><input class="imgload form-control my-1" id="file" type="file" name="avatar" required="required" /><img class="imgshow" src="#" align="left" style="width:50px" /></div>
		        <div class="card-footer d-flex flex-row-reverse bg-light"><button class="btn btn-block btn-success" type="submit">Add </button><a class="btn btn-light bg-white me-2" href="/">Cancel</a></div>
		    </form>
		</div>`;
        $('.leftContent').html(str);
	});	
	//Note leftContent class is obsevation area
	$('.leftContent').on('change','.imgload',function(e){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.imgshow').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
    $('a#login').click(function(e) {
		//e.preventDefault();//ngan chan link href default chay 
		let str=`
		<div class="card-body border w-50 my-3 m-auto">
		    <div class="d-flex justify-content-center"><img class="rounded-circle m-auto" src="/img/avatars/1634459023804_hinh4.png" alt="avatar" /></div>
		    <div class="errMessage"></div>
		    <form class="loginForm" action="/users/login" method="post" enctype="multipart/form-data">
		        <div class="form-group"><label>Your Email</label><input class="form-control my-1" type="text" name="email" required="required" /></div>
		        <div class="form-group"><label>Password</label><input class="form-control my-1" type="password" name="password" required="required" /></div>
		        <div class="form-group text-center my-3"><button class="btn btn-block btn-success w-50" type="submit">Login</button></div>
		        <div class="form-check"><input class="form-check-input" id="autoSizingCheck" type="checkbox" /><label class="form-check-label" for="autoSizingCheck">Remember me</label></div><a id="createAccount" href="JavaScript:void(0);">Create an Account</a>
		    </form>
		</div>`;
        $('.leftContent').html(str);
	});	
	$(".leftContent").on('click','a#createAccount',function(e){//Truyen Id sang Form Delete record
		e.preventDefault();//ngan chan link href default chay 
		$('a#sigin').click(); //call siginForm
	});
	//Registation User
	$(".leftContent").on('submit','form.addForm',function(e){//Truyen Id sang Form Delete record
		e.preventDefault();//ngan chan link href default chay 
        let formData = new FormData(this);
        $.ajax({
            url:'/users/regis',
            type: 'POST',
			dataType: 'json',
            contentType: false,
            processData: false,
            cache: false,
            data: formData
        }).done(function(res) {
        	let result=JSON.parse(res);
        	console.log(result);
        	if (result!=='ok') {
        		let err=`<div class="alert alert-danger" role="alert">
						  ${result.msg}
						</div>`;
				//$('a#sigin').click(); //call siginForm
				$('.leftContent .errMessage').html(err);
        	}else{
				$('a#login').click(); //call siginForm
        	}
		}).fail(function( xhr, status, errorThrown ) {
		   alert( "Sorry, there was a problem!" );
		   console.log( "Error: " + errorThrown );
		   console.log( "Status: " + status );
		   console.dir( xhr );
		});
    });
    //User login
	$(".leftContent").on('submit','form.loginForm',function(e){//Truyen Id sang Form Delete record
		e.preventDefault();//ngan chan link href default chay 
        let formData = new FormData(this);
        $.ajax({
            url:'/users/login',
            type: 'POST',
			dataType: 'json',
			contentType: false,
            processData: false,
            cache: false,
            data: formData
        }).done(function(res) {
        	let result=JSON.parse(res);
        	console.log(result);
        	if (result!=='ok') {
        		let err=`<div class="alert alert-danger" role="alert">
						  ${result.msg}
						</div>`;
				//$('a#sigin').click(); //call siginForm
				$('.leftContent .errMessage').html(err);
        	}else{
				$('.leftContent').html("ban vao trang chu"); //call siginForm
        	}
		}).fail(function( xhr, status, errorThrown ) {
		   alert( "Sorry, there was a problem!" );
		   console.log( "Error: " + errorThrown );
		   console.log( "Status: " + status );
		   console.dir( xhr );
		});
    });
});


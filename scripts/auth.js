

//auth --> contains firebase data

//State changes listener
auth.onAuthStateChanged(user => {
	if(user){ //user logged in // did log in
		console.log('user logged in: ' + user+ " user uid: " + user.uid);
		let userData = functions.httpsCallable('getInfoUser');
		userData().then(function(res){
			console.log("res: ");
			console.log(res.data);
			setupData(res.data);
		}).catch(function(error){
			console.log(error);
		});

	}else{
		//user not logged in //did log out
		console.log('user logged out');
	}
});

//SIGN-UP
const signupForm = document.querySelector('#signup-Form');

signupForm.addEventListener('submit', (e) =>{
	e.preventDefault(); //prevent auto refreshing
	//set User info
	const email = signupForm['signup-email'].value;
	const pwd = signupForm['signup-password'].value;

	//console.log(email, pwd);
	//Signup with credentials
	auth.createUserWithEmailAndPassword(email, pwd).then(credentials => {
		//console.log(credentials);
		const modal = document.querySelector('#modal-signup');
		M.Modal.getInstance(modal).close();
		signupForm.reset(); //Clear form
	});

});

//LOG OUT 
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
	e.preventDefault(); //prevent auto refreshing
	auth.signOut().then(() => {
		console.log('user logged out');
	});

});

//LOG IN
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault(); //prevent auto refreshing
	const email = loginForm['login-email'].value;
	const pwd = loginForm['login-password'].value;

	//log in with creds
	auth.signInWithEmailAndPassword(email, pwd).then(creds => {
		console.log(creds);
		//Close and reset modal
		const modal = document.querySelector('#modal-login');
		M.Modal.getInstance(modal).close();
		loginForm.reset(); //Clear form
	});
});
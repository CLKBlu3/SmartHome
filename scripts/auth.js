

let userData = functions.httpsCallable('getInfoUser');
let register = functions.httpsCallable('addNewUser');
let addHomeFunc = functions.httpsCallable('registerUserToHouse');
//auth --> contains firebase data

//State changes listener
auth.onAuthStateChanged(user => {
	if(user){ //user logged in // did log in
		userData().then(function(res){
			setupData(res.data);
			fillAccountDetails(res.data, user);
		}).catch(function(error){
			console.log(error);
			$('#modal-error').show();
		});
		hideOrShowElementsByClass('.logged-out', '.logged-in');
	}else{
		//user not logged in //did log out
		clearData();
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
	const username = signupForm['signup-name'].value;

	//Signup with credentials
	register({name: username, mail: email, password: pwd}).then(() =>{
		const modal = $('#modal-signup');
		M.Modal.getInstance(modal).close();
		auth.signInWithEmailAndPassword(email, pwd);
		signupForm.reset();
	}).catch(function (error) {
		console.log(error);
		//$('#modal-signup').toggle();
		const modal = $('#modal-signup');
		M.Modal.getInstance(modal).close();
		signupForm.reset();
		$('#modal-error').show();
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
		const modal = $('#modal-login');
		M.Modal.getInstance(modal).close();
		loginForm.reset(); //Clear form
	}).catch(function (error) {
		console.log(error);
		const modal = document.querySelector('#modal-login');
		M.Modal.getInstance(modal).close();
		loginForm.reset();
		$('#modal-error').show();
	});
});

//ADD USER TO NEW HOME
const addUserToHome = document.querySelector('#addhome-form');
addUserToHome.addEventListener('submit', (e) => {
	e.preventDefault();
	var homeId = addUserToHome['home-identifier'].value;
	userData().then(res => {
		const userId = res.data.uid;
		addHomeFunc({houseid: homeId, userid: userId}).then( () =>{
			$('#modal-addhome').toggle();
			addUserToHome.reset();
			location.reload();
		}).catch(function(error){
			$('#modal-addhome').toggle();
			addUserToHome.reset();
			$('#modal-error').show();
			console.log(error);
		});
	});
});
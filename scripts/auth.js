

let userData = functions.httpsCallable('getInfoUser');
let register = functions.httpsCallable('addNewUser');
let addHomeFunc = functions.httpsCallable('registerUserToHouse');
//auth --> contains firebase data

//State changes listener
auth.onAuthStateChanged(user => {
	if(user){ //user logged in // did log in
		//console.log('user logged in: ' + user+ " user uid: " + user.uid);
		//console.log(user);
		userData().then(function(res){
			//console.log("res: ");
			//console.log(res.data);
			setupData(res.data);
			fillAccountDetails(res.data, user);
		}).catch(function(error){
			console.log(error);
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

	//console.log(email, pwd);
	//Signup with credentials
	register({name: username, mail: email, password: pwd}).then(() =>{
		const modal = document.querySelector('#modal-signup');
		M.Modal.getInstance(modal).close();
		auth.signInWithEmailAndPassword(email, pwd);
		signupForm.reset();
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

//ADD USER TO NEW HOME
const addUserToHome = document.querySelector('#addhome-form');
addUserToHome.addEventListener('submit', (e) => {
	e.preventDefault();
	var homeId = addUserToHome['home-identifier'].value;
	userData().then(res => {
		const userId = res.data.uid;
		addHomeFunc({houseid: homeId, userid: userId}).then( () =>{
			$('#modal-addhome').hide();
			addUserToHome.reset();
			location.reload();
		}).catch(function(error){
			$('#modal-addhome').hide();
			addUserToHome.reset();
			//TODO: Afegir modal amb display d'errors!
			console.log(error);
		});
	});
});
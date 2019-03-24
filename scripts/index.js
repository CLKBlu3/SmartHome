const homeList = document.querySelector('.data');

const setupData = (data) =>{
	var i;
	var li= ``;
	let homeData = functions.httpsCallable('getInfoHome');
	homeList.innerHTML = li;
	for(i = 0; i < data.Cases.length; ++i){
		//console.log(data.Cases[i]);
		homeData({id: data.Cases[i]}).then(function(dHome){
			console.log(dHome);
			li = `
				<li>
					<div class="collapsible-header grey lighten-4">${dHome.data.cid}</div>
					<div class="collapsible-body white"><b>Admin: </b>${dHome.data.admin} </div>
					<div class="collapsible-body white"><b>Users: </b>${dHome.data.users} </div>
					<div class="collapsible-body white"><b>Actuadors: </b>${dHome.data.actuadors} </div>
					<div class="collapsible-body white"><b>Sensors: </b>${dHome.data.sensors} </div>
				</li>
			`;
			homeList.innerHTML += li;
		});
	}
};

const clearData = ()=>{
	var li = `
		<li>
			<div class="collapsible-header grey lighten-4"><center><b>PLEASE LOGIN OR SIGN UP TO SEE YOUR DATA </b></center></div>
		</li>
	`;
	homeList.innerHTML = li
	//user logged out--> hide log out and show Login/sign up
	hideOrShowElementsByClass('logged-in', 'logged-out');
}

//PAR 1: classe a amagar, PAR2: classe a mostrar
const hideOrShowElementsByClass = (hideClass, showClass) =>{
	var elements = document.getElementsByClassName(hideClass);
	var i;
	for(i = 0; i < elements.length; ++i){
		elements[i].style.display = 'none';
	}

	elements = document.getElementsByClassName(showClass);
	for(i = 0; i < elements.length; ++i){
		elements[i].style.display = 'block';
	}
}

const accInfo = document.querySelector('.accInfo');
const fillAccounDetails = (userData, user) => {
	console.log(userData)
	var li = ``;
	li = `
		<li>
			<div class="collapsible-header grey lighten-4">${userData.Name}</div>
			<div class="collapsible-body white"><b>Name: </b>${userData.Name} </div>
			<div class="collapsible-body white"><b>Email: </b>${user.email} </div>
			<div class="collapsible-body white"><b>Verified: </b>${user.emailVerified} </div>
			<div class="collapsible-body white"><b>Homes: </b>${userData.Cases} </div>
			<div class="collapsible-body white"><b>Number of Homes: </b>${userData.Cases.length} </div>
			<div class="collapsible-body white"><b>UID: </b>${userData.uid} </div>
		</li>
	`;
	accInfo.innerHTML = li;
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
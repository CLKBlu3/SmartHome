const homeList = $('.data'); //DIV with the list of elements of the Homes

const setupData = (data) =>{
	var i;
	var li= ``;
	let homeData = functions.httpsCallable('getInfoHome');
	homeList.innerHTML = li;
	for(i = 0; i < data.Cases.length; ++i){
		//console.log(data.Cases[i]);
		homeData(data.Cases[i]).then(function(dHome){
			console.log(dHome);
			li += `
				<li>
					<div class="collapsible-header grey lighten-4">${dHome.data.cid}</div>
					<div class="collapsible-body white"><b>Admin: </b>${dHome.data.admin} </div>
					<div class="collapsible-body white"><b>Num Users: </b>${dHome.data.users.length} </div>
					<div class="collapsible-body white"><b>Users: </b>${dHome.data.users} </div>
					<div class="collapsible-body white"><b>IP: </b>${dHome.data.ip} </div>
				</li>
			`;
            homeList.html(li).append('<button class=\"btn yellow darken-2 z-depth-0\" addHome>Add new Home</button>');
		});
	}
};

const clearData = ()=>{
	var li = `
		<li>
			<div class="collapsible-header grey lighten-4" style="text-align: center;"><b>PLEASE LOGIN OR SIGN UP TO SEE YOUR DATA </b></div>
		</li>
	`;
	homeList.html(li);
	//user logged out--> hide log out and show Login/sign up
	hideOrShowElementsByClass('.logged-in', '.logged-out');
}

//PAR 1: classe a amagar, PAR2: classe a mostrar
const hideOrShowElementsByClass = (hideClass, showClass) =>{
	$(hideClass).hide();
	$(showClass).show();
}

const accInfo = $('.accinfo');
const fillAccountDetails = (userData, user) => {
	//console.log(userData);
	var li;
	li = `
		<li>
			<div class="collapsible-header grey lighten-4">${userData.Name}</div>
			<div class="collapsible-body white"><b>Name: </b>${userData.Name} </div>
			<div class="collapsible-body white"><b>Email: </b>${user.email} </div>
			<div class="collapsible-body white"><b>Number of Homes: </b>${userData.Cases.length} </div>
		</li>
	`;
	accInfo.html(li);
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = $('.modal');
  M.Modal.init(modals);

  var items = $('.collapsible');
  M.Collapsible.init(items);

});
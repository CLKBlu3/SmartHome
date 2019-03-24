const homeList = document.querySelector('.data');

const setupData = (data) =>{
	var i;
	var li= ``;
	let homeData = functions.httpsCallable('getInfoHome');
	for(i = 0; i < data.Cases.length; ++i){
		console.log(data.Cases[i]);
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

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
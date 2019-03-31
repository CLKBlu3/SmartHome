const homeList = $('.data'); //DIV with the list of elements of the Homes

const setupData = (data) =>{
	var i;
	var li= ``;
	let homeData = functions.httpsCallable('getInfoHome');
	homeList.html(li);
	for(i = 0; i < data.Cases.length; ++i){
		//console.log(data.Cases[i]);
		homeData(data.Cases[i]).then(function(dHome){
			console.log(dHome);
			li += `<li>`
			li += `<div class=\"collapsible-header grey lighten-4\">${dHome.data.cid}</div>`;
            li += `<div class=\"collapsible-body white\"><b>Admin: </b>${dHome.data.admin} </div>`;
            if(dHome.data.admin === data.uid){
                data = dHome.data;
                li += `<div class='collapsible-body white'> `+
                    `<div class='left-element'> <b>Num Users: </b>${dHome.data.users.length}  <p style=\"text-align:right\" style=\"vertical-align:top\">`
                    + `<button class=\"btn yellow darken-2 z-depth-0\" onclick="deleteUsers(data)"> X </button> </p></div></div>`;
            }
			else li += `<div class=\"collapsible-body white\"><b>Num Users: </b>${dHome.data.users.length} </div>`;
			li += `<div class=\"collapsible-body white\"><b>Users: </b>${dHome.data.users} </div>`;
			li += `<div class=\"collapsible-body white\"><b>IP: </b>${dHome.data.ip} </div>`;
			li += `</li>`;
			//console.log(li);
            homeList.append(li)//.append(`<button class="btn yellow darken-2 z-depth-0" data-toggle="modal" data-target="#modal-addhome">Add new Home</button>`);
		});
	}
	let button = `<button class="btn yellow darken-2 z-depth-0" data-toggle="modal" onClick="$('#modal-addhome').show()">Add new Home</button>`;
	homeList.append(button);
};

const deleteUsers = (homeData) =>{
    var i;
    console.log(homeData);
    for(i = 0; i < homeData.users.length; ++i){
        //afegirlos a una llista en un "popup" per seleccionar quins vols eliminar amb un checkbox?
    }
}

const clearData = ()=>{
	var li = `
			<span class="collapsible-header grey lighten-4" style="text-align: center;"><b>PLEASE LOGIN OR SIGN UP TO SEE YOUR DATA </b></span>
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
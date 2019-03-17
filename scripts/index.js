const homeList = document.querySelector('.data');

const setupData = (data) =>{
	data.forEach(doc =>{
		const home = doc.data().Cases;
		console.log(home.length);
		var li = ``;
		var i;
		for(i = 0; i < home.length; ++i){
			database.collection('cases').where('cid', '==', home[i])
			.get()
			.then(function(casaQuery) {
				casaQuery.forEach(casa =>{
					var data = casa.data().admin;
					console.log(data);
					li =`
						<li>
							<div class="collapsible-header grey lighten-4">${casa.data().cid}</div>
							<div class="collapsible-body white">Admin: ${data}</div>
						</li>
					`;
					homeList.innerHTML += li;
				})
			});
		}	

	});
	//homeList.innerHTML = html;
};
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
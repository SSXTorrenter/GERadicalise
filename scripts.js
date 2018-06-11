window.onload = function(){listQuestions();};

$('#poserQuestion').click(function(){
    jQuery(function($) {
      $.ajax({
                url: 'http://groups.cowaboo.net/2018/group07/public/api/entry',
                type:'POST',
                data: {
		                  'secretKey': $("#secretKey").val(),
		                  'observatoryId':'question',
		                  'tags': $("#questionValue").val(),
		                  'value': $("#questionValue").val()
		              },
                dataType: 'json'
            }).done(function( arg ) {
              alert("Votre question a bien été enregistrée !");
              $("#secretKey").val("");
              $("#questionValue").val("");
              listQuestions();
            }).fail(function(arg){
              alert("Votre clé secret est invalide !");
            });
        });
  });

function voirReponses(){
	let exists = false;
	$('.voirReponses').click(function(e){
		$('#questionIdObservatory').val(e.target.value.trim());
		listReponses(e.target.value);
		exists = false;
	});
	$('#posterMaReponse').click(function(e){
		if(exists==false){
			jQuery(function($) {
				$.ajax({
					url: 'http://groups.cowaboo.net/2018/group07/public/api/observatory',
					type:'POST',
					data:{
							'secretKey': $("#secretKeyReponse").val(),
		                  	'observatoryId':$('#questionIdObservatory').val()
					},
					dataType: 'json'
				})
			});
		}


		jQuery(function($) {
      $.ajax({
                url: 'http://groups.cowaboo.net/2018/group07/public/api/entry',
                type:'POST',
                data: {
		                  'secretKey': $("#secretKeyReponse").val(),
		                  'observatoryId':$('#questionIdObservatory').val(),
		                  'tags': $("#reponseValue").val(),
		                  'value': $("#reponseValue").val()
		              },
                dataType: 'json'
            }).done(function( arg ) {
              alert("Votre réponse a bien été enregistrée !");
              listReponses($('#questionIdObservatory').val());
              $("#secretKeyReponse").val("");
              $('#questionIdObservatory').val("");
              $("#reponseValue").val("");
            }).fail(function(arg){
              alert("Votre clé secret est invalide !");
            });
        });
	});
}

function listQuestions(){
		jQuery(function($) {
			$.ajax({
				url: 'http://groups.cowaboo.net/2018/group07/public/api/observatory?observatoryId=question',
				type:'GET',
				data:{},
				dataType: 'json'
			}).done(function( dataRecieved ) {
				console.log( dataRecieved );
				var questions = dataRecieved.dictionary.entries;
				$('#questions').html("");
				for(var i in questions){
					var question = questions[i].value;
					$('#questions').append('<div class="alert alert-info" role="alert">' + question + '<button type="button" class="btn btn-sm btn-default voirReponses" value="' + question + '" data-toggle="modal" data-target="#reponsesQuestion">Voir les réponses</button></div>');
				};
				voirReponses();
			});
		});

	}

function listReponses(idObs){
	jQuery(function($) {
			$.ajax({
				url: 'http://groups.cowaboo.net/2018/group07/public/api/observatory?observatoryId=' + idObs,
				type:'GET',
				data:{},
				dataType: 'json'
			}).done(function( dataRecieved ) {
				console.log( dataRecieved );
				var reponses = dataRecieved.dictionary.entries;
				$('#reponsesQuestion .modal-body').html("");
				for(var i in reponses){
					var reponse = reponses[i].value;
					$('#reponsesQuestion .modal-body').append('<div class="alert alert-success" role="alert">' + reponse + '</div>');
				};
				exists = true;
			}).fail(function(){
				exists = false;
				$('#reponsesQuestion .modal-body').html('<div class="alert alert-warning" role="alert">Aucune réponses pour l\'instant. Postez la première.</div>');
			});
		});
}
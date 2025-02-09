function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

$(document).ready(function() {
    // Vérifie si le cookie 'hack_success' est présent
    if (getCookie('hack_success') === 'true') {
        $('#message-container').html('<div class="success-message"><h2>CLEF DE CHIFFREMENT</h2></div>');
        $('#hackButton').hide();  // Cacher le bouton si le piratage est déjà réussi
    }

    $('#hackButton').click(function() {
        // Effacer tout message d'erreur précédent
        $('#error-message').addClass('hidden').text('');
        
        // Vérifier si le navigateur supporte la géolocalisation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Envoyer les coordonnées au serveur pour vérification
                $.ajax({
                    url: '/check_location',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({latitude: latitude, longitude: longitude}),
                    success: function(response) {
                        if (response.authorized) {
                            // Effacer tout message d'erreur précédent
                            $('#error-message').addClass('hidden').text('');
                            // Lancer le piratage
                            launchHack();
                        } else {
                            // Afficher le message d'erreur dans le conteneur
                            $('#error-message').removeClass('hidden').text('Aucun dispositif de chiffrement détécté à proximité.');
                        }
                    },
                    error: function() {
                        // Afficher un message d'erreur en cas de problème de communication
                        $('#error-message').removeClass('hidden').text('Erreur lors de la vérification du dispositif de chiffrement. Veuillez réessayer.');
                    }
                });
            }, function() {
                // Afficher un message d'erreur si la géolocalisation échoue
                $('#error-message').removeClass('hidden').text('Erreur lors de la récupération de la position.');
            });
        } else {
            // Afficher un message d'erreur si la géolocalisation n'est pas supportée
            $('#error-message').removeClass('hidden').text('La géolocalisation n\'est pas supportée par ce navigateur.');
        }
    });

    function launchHack() {
        $('#hackButton').prop('disabled', true);
        $('#loading').removeClass('hidden');

        var progress = 0;
        var totalDuration = 60000; // 60 secondes
        var intervalTime = 100; // Mise à jour toutes les 100 ms
        var totalSteps = totalDuration / intervalTime; // 600 étapes

        // Générer un nombre aléatoire d'interruptions entre 2 et 4
        var numInterruptions = Math.floor(Math.random() * 3) + 2; // 2, 3, 4

        // Générer des temps d'interruption aléatoires en millisecondes
        var interruptions = [];
        for (var i = 0; i < numInterruptions; i++) {
            // S'assurer que les interruptions sont réparties entre 10% et 90% de la durée totale
            var t = Math.random() * (totalDuration * 0.8) + totalDuration * 0.1;
            interruptions.push(t);
        }
        interruptions.sort(function(a, b) { return a - b; }); // Trier les interruptions par ordre croissant

        var currentTime = 0;
        var nextInterruptionIndex = 0;

        var progressInterval = setInterval(function() {
            currentTime += intervalTime;

            // Vérifier s'il est temps de déclencher une interruption
            if (nextInterruptionIndex < interruptions.length && currentTime >= interruptions[nextInterruptionIndex]) {
                // Appliquer l'interruption : réduire la progression de 30%
                progress = Math.max(0, progress - 30);
                $('#progressBar').css('width', progress + '%');

                // Passer à la prochaine interruption
                nextInterruptionIndex++;
            }

            // Calculer un incrément de progression non linéaire
            // Exemple : progression plus rapide au fil du temps
            var remainingTime = totalDuration - currentTime;
            var timeFactor = 1 - (remainingTime / totalDuration); // 0 au début, 1 à la fin
            var increment = 0.5 + (timeFactor * 1.5); // Incrément entre 0.5% et 2.0%

            // Ajouter une petite variation aléatoire pour rendre la progression moins prévisible
            increment += (Math.random() - 0.5) * 0.5; // Variation de +/- 0.25%

            progress += increment;
            progress = Math.min(progress, 100); // S'assurer que la progression ne dépasse pas 100%

            $('#progressBar').css('width', progress + '%');

            if (progress >= 100) {
                clearInterval(progressInterval);
                $('#loading').addClass('hidden');
                // Envoyer une requête pour définir le cookie
                $.ajax({
                    url: '/start_hack',
                    type: 'POST',
                    success: function(response) {
                        // Injecter le message sans recharger la page
                        $('#message-container').html('<div class="success-message"><h2>' + response.message + '</h2></div>');
                        $('#hackButton').hide();  // Cacher le bouton après succès
                    },
                    error: function() {
                        // Afficher un message d'erreur en cas de problème lors de la finalisation
                        $('#error-message').removeClass('hidden').text('Erreur lors de la finalisation du piratage. Veuillez réessayer.');
                    }
                });
            }
        }, intervalTime);
    }
});
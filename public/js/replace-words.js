(function() {
    'use strict';

    /**
     * Replaces forbidden words.
     */
    var replaceForbiddenWords = function() {
        var citation = document.getElementById('cit_libelle').value;
        var listeMot = [];
        var mots = document.getElementById('mots').querySelectorAll('li');

        // Add forbidden words to the list
        for (var i = 0; i < mots.length; i++) {
            listeMot.push(mots[i].innerHTML);
        }

        // Check if there is a forbidden word and replace it.
        listeMot.forEach(function(mot) {
            if ((citation.toLowerCase()).indexOf(mot.toLowerCase()) !== -1) {
                document.getElementById('error').innerHTML = '<p><core-icon icon="error"></core-icon> Le mot <em>' + mot + '</em> n\'est pas autorisé.</p>';

                // Replace forbidden words with asterisks.
                var newCitation = citation.replace(mot.toLowerCase(), function(mot) {
                    var lettre = 0;
                    var asterisks = '';

                    while (lettre < mot.length) {
                        asterisks += '*';
                        lettre++;
                    }

                    return asterisks;
                });

                // Replace the citation without the forbidden word.
                document.getElementById('cit_libelle').value = newCitation;
            }
        });
    }

    /**
     * Replace forbidden words while typing.
     */
    document.getElementById('cit_libelle').onkeyup = replaceForbiddenWords;

    /**
     * Replaces forbidden words on copy & paste.
     */
    document.getElementById('cit_libelle').onchange = replaceForbiddenWords;

    /**
     * Toggles forbidden words dialog box.
     */
    document.getElementById('btnDialog').onclick = function() {
        var dialog = document.querySelector('paper-action-dialog');
        if (!dialog) {
            return;
        }
        dialog.toggle();
    }
})();

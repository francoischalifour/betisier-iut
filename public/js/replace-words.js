$(function() {
    'use strict';

    var listeMot = [];

    /**
     * Gets all forbidden words.
     */
    function getAllForbiddenWords() {
        $.ajax({
            url: '/citations/forbidden-words',
            success: function(mots) {
                mots.forEach(function(mot) {
                    listeMot.push(mot.mot_interdit);
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    /**
     * Replaces forbidden words.
     */
    var replaceForbiddenWords = function() {
        var citation = $('#cit_libelle').val();

        // Check if there is a forbidden word and replace it.
        listeMot.forEach(function(mot) {
            if ((citation.toLowerCase()).indexOf(mot.toLowerCase()) !== -1) {
                $('#error').html('<p><core-icon icon="error"></core-icon> Le mot <em>' + mot + '</em> n\'est pas autorisé.</p>');

                // Replace forbidden words with asterisks.
                var newCitation = citation.toLowerCase().replace(mot.toLowerCase(), function(mot) {
                    var lettre = 0;
                    var asterisks = '';

                    while (lettre < mot.length) {
                        asterisks += '*';
                        lettre++;
                    }

                    return asterisks;
                });

                // Replace the citation without the forbidden word.
                $('#cit_libelle').val(newCitation);
            }
        });
    }

    /**
     * Loads all forbidden words.
     */
    $('#cit_libelle').on('focus', getAllForbiddenWords);

    /**
     * Replace forbidden words while typing.
     */
    $('#cit_libelle').on('keyup', replaceForbiddenWords);

    /**
     * Replaces forbidden words on copy & paste.
     */
    $('#cit_libelle').on('change', replaceForbiddenWords);

    /**
     * Toggles forbidden words dialog box.
     */
    $('#btnDialog').on('click', function() {
        var dialog = document.querySelector('paper-action-dialog');
        if (!dialog)
            return;

        dialog.toggle();
    });
});

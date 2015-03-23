$(function() {
    var listeNotes = [];

    /**
     * Gets all notes by citation.
     */
    function getAllNotes(cit_num) {
        $.ajax({
            url: '/api/citations/' + cit_num,
            async: false,
            success: function(notes) {
                notes.forEach(function(vote) {
                    listeNotes.push({
                        note: vote.vot_valeur,
                        auteur: vote.per_prenom + ' ' + vote.per_nom
                    });
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    /**
     * Adds notes values with their authors in a dialog panel.
     */
    $('.note').on('click', function() {
        getAllNotes($(this).attr('id'));

        var auteurs = '';

        // Add all authors and notes.
        listeNotes.forEach(function(vote) {
            auteurs += '<li>' + vote.auteur + ' : ' + vote.note + '</li>';
        });

        $('#auteurs').html(auteurs);

        // Show dialog box.
        var dialog = document.querySelector('paper-action-dialog');
        if (!dialog)
            return;

        dialog.toggle();

        // Reset the notes list.
        listeNotes = [];
    });
});
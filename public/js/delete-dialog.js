/**
 * Toggles the delete panel.
 */
(function() {
    'use strict';

    var deleteLink = document.getElementById('deleteLink');

    if (!deleteLink)
        return

    deleteLink.onclick = function(e) {
        e.preventDefault();
        document.getElementById('deletePanel').toggle();
    }
})();

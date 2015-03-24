/**
 * Toggles the delete panel.
 */
(function() {
    var deleteLink = document.getElementById('deleteLink');

    if (!deleteLink)
        return

    deleteLink.onclick = function(e) {
        e.preventDefault();
        document.getElementById('deletePanel').toggle();
    }
})();

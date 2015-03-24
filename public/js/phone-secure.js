/**
 * Turns the telephone number into canvas.
 */
(function() {
    'use strict';

    var per_tel_span = document.getElementById('per_tel');

    if (!per_tel_span)
        return;

    var per_tel = per_tel_span.innerHTML;

    per_tel_span.remove();
    var context = document.getElementById('per_tel_canvas').getContext('2d');

    context.canvas.width = 100;
    context.canvas.height = 20;
    context.font = '14px RobotoDraft';
    context.fillText(per_tel, 0, 20);
})();

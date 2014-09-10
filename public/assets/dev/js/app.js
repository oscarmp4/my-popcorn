(function (w, undefined) {
	'use strict';

    require.config({
        paths: {
            jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
        }
    });

    var dropArea = $("div#drop-area");

    if (dropArea.length) {
        require(['vendor/dropzone'], function (Dropzone) {
            var myDropzone = new Dropzone("div#drop-area", { url: "/set"});

            myDropzone.on('success', function (file) {
                location.href = '/view';
            });
        });
    }
}(window))
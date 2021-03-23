AFRAME.registerSystem('sync', {
    init: function() {
        var vid = document.getElementById('tv-screen')
        var music = document.getElementById('radio-music')


        // Sending
        var remote = document.getElementById('remote-model')
        var radio = document.getElementById('radio-model')
        remote.addEventListener('click', function() {
           
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
            NAF.connection.broadcastDataGuaranteed('remote-clicked', true)
            
        });

        radio.addEventListener('click', function() {
           
            if (!music.paused) {
                music.pause()
            } else {
                music.play()
            }
            NAF.connection.broadcastDataGuaranteed('radio-clicked', true)
            
        });






        NAF.connection.subscribeToDataChannel('remote-clicked', function (senderId, type, data, targetId) {
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
        })


        NAF.connection.subscribeToDataChannel('radio-clicked', function (senderId, type, data, targetId) {
            if (!music.paused) {
                music.pause()
            } else {
                music.play()
            }
        })


    }
})
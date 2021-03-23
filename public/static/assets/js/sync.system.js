AFRAME.registerSystem('sync', {
    init: function() {
        var vid = document.getElementById('tv-screen')


        // Sending
        var remote = document.getElementById('remote-model')
        remote.addEventListener('click', function() {
           
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
            NAF.connection.broadcastDataGuaranteed('remote-clicked', true)
            
        });

        NAF.connection.subscribeToDataChannel('remote-clicked', function (senderId, type, data, targetId) {
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
        })
    }
})
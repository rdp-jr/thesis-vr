AFRAME.registerSystem('sync', {
    init: function() {
        var vid = document.getElementById('tv-screen')
        var music = document.getElementById('radio-music')

        NAF.connection.subscribeToDataChannel('remote-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRemote', {})
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
        })

        NAF.connection.subscribeToDataChannel('radio-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRadio', {})
            if (!music.paused) {
                music.pause()
            } else {
                music.play()
            }
        })

        NAF.connection.subscribeToDataChannel('watercan-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleWater', {})
            growFlower()
        })

        NAF.connection.subscribeToDataChannel('flower-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleArrange', {})
            moveFlowerToVase()
        })

    }
})
AFRAME.registerSystem('sync', {
    init: function() {
        var vid = document.getElementById('tv-screen')
        var music = document.getElementById('radio-music')

        NAF.connection.subscribeToDataChannel('remote-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRemote', {})
            document.getElementById('sfx-remote').play()
            if (!vid.paused) {
                vid.pause()
            } else {
                vid.play()
            }
        })

        NAF.connection.subscribeToDataChannel('radio-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRadio', {})
            document.getElementById('sfx-radio').play()
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

        NAF.connection.subscribeToDataChannel('get-scrapbook-1', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit(`toggleScrapbook1`, {})
            moveScrapbook('1')
        })

        NAF.connection.subscribeToDataChannel('get-scrapbook-2', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit(`toggleScrapbook2`, {})
            moveScrapbook('2')
        })

        NAF.connection.subscribeToDataChannel('get-scrapbook-3', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit(`toggleScrapbook3`, {})
            moveScrapbook('3')
        })

        NAF.connection.subscribeToDataChannel('get-scrapbook-4', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit(`toggleScrapbook4`, {})
            moveScrapbook('4')
        })

    }
})
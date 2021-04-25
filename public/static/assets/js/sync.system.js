AFRAME.registerSystem('sync', {
    init: function() {
        var vid = document.getElementById('tv-screen')
        var music = document.getElementById('radio-music')

        NAF.connection.subscribeToDataChannel('remote-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRemote', {})
            document.getElementById('sfx-remote').play()
            var bg = document.getElementById("bg-music")
            if (!vid.paused) {
                vid.pause()
                bg.play()
            } else {
                vid.play()
                bg.pause()
            }
        })

        NAF.connection.subscribeToDataChannel('radio-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleRadio', {})
            document.getElementById('sfx-radio').play()
            var bg = document.getElementById("bg-music")
            if (!music.paused) {
                music.pause()
                bg.play()
            } else {
                music.play()
                bg.pause()
            }
        })

        NAF.connection.subscribeToDataChannel('camera-clicked', function (senderId, type, data, targetId) {
            document.getElementById('sfx-camera').play()
        })

        NAF.connection.subscribeToDataChannel('watercan-clicked', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleWater', {})      
            growFlower()
            animateWatercan()
        })

        NAF.connection.subscribeToDataChannel('flower-clicked1', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleArrange', {})
            moveFlowerToVase('1')
        })

        NAF.connection.subscribeToDataChannel('flower-clicked2', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleArrange', {})
            moveFlowerToVase('2')
        })

        NAF.connection.subscribeToDataChannel('flower-clicked3', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleArrange', {})
            moveFlowerToVase('3')
        })

        NAF.connection.subscribeToDataChannel('flower-clicked4', function (senderId, type, data, targetId) {
            AFRAME.scenes[0].emit('toggleArrange', {})
            moveFlowerToVase('4')
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
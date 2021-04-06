function clickWatercan() {
    AFRAME.scenes[0].emit('toggleWater', {})
   NAF.connection.broadcastDataGuaranteed('watercan-clicked', true)
   growFlower()
   AFRAME.scenes[0].emit('increaseScore', {points: 50});
   
 }

 function growFlower() {
   
   var flower = document.getElementById('ent-flower')
   flower.setAttribute('animation__grow', 'property: scale; to: 0.25 0.25 0.25; dur: 1500')
 }

 function clickFlower() {
   AFRAME.scenes[0].emit('toggleArrange', {})
   NAF.connection.broadcastDataGuaranteed('flower-clicked', true)
   moveFlowerToVase()
 }

 function moveFlowerToVase() {
  
   var flower = document.getElementById('ent-flower')
   flower.setAttribute('animation__move', 'property: position; to: 2.164 0.769 3.183; dur: 1500')
   flower.setAttribute('animation__rotate', 'property: rotation; to: 0 0 0; dur: 1500')
 }


 function clickRemote() {
   console.log('clicked remote!')
    AFRAME.scenes[0].emit('toggleRemote', {})
   NAF.connection.broadcastDataGuaranteed('remote-clicked', true)
  
   var vid = document.getElementById('tv-screen')
   if (!vid.paused) {
       vid.pause()
   } else {
       vid.play()
   }

 }

 function clickRadio() {
    AFRAME.scenes[0].emit('toggleRadio', {})
   NAF.connection.broadcastDataGuaranteed('radio-clicked', true)
   var radio = document.getElementById('radio-music')
   if (!radio.paused) {
       radio.pause()
   } else {
       radio.play()
   }

 }

 function exitRoom() {
   var state = document.getElementById('state')
   document.getElementById('has_done_remote').value = state.getAttribute('has_done_remote')
   document.getElementById('has_done_radio').value = state.getAttribute('has_done_radio')
   document.getElementById('has_done_arrange').value = state.getAttribute('has_done_arrange')
   document.getElementById('has_done_water').value = state.getAttribute('has_done_water')
   document.getElementById('post-session-form').submit()
 }
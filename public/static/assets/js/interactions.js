function clickWatercan() {
    AFRAME.scenes[0].emit('toggleWater', {})
   NAF.connection.broadcastDataGuaranteed('watercan-clicked', true)
   growFlower()
   AFRAME.scenes[0].emit('increaseScore', {points: 50});
   
   
 }

 function growFlower() {
  document.getElementById('sfx-water').play()
   var flower1 = document.getElementById('ent-flower1')
   var flower2 = document.getElementById('ent-flower2')
   var flower3 = document.getElementById('ent-flower3')
   var flower4 = document.getElementById('ent-flower4')
   flower1.setAttribute('animation__grow', 'property: scale; to: 0.1 0.1 0.1; dur: 5000')
  //  flower1.setAttribute('animation__adjust', 'property:position; to: 5.771 0.687 4.653; dur: 5000')

   flower2.setAttribute('animation__grow', 'property: scale; to: 0.05 0.05 0.05; dur: 5000')
   flower2.setAttribute('animation__adjust', 'property:position; to: 4.812 0.516 1.698; dur: 5000')

   flower3.setAttribute('animation__grow', 'property: scale; to: 0.1 0.1 0.1; dur: 5000')
   flower3.setAttribute('animation__adjust', 'property:position; to: 3.962 0.921 1.675; dur: 5000')
  

   flower4.setAttribute('animation__grow', 'property: scale; to: 0.125 0.125 0.125; dur: 5000')
  //  flower4.setAttribute('animation__adjust', 'property:position; to: 5.771 0.687 4.653; dur: 1500')

 }

 function clickFlower(id) {
   AFRAME.scenes[0].emit('toggleArrange', {})
   NAF.connection.broadcastDataGuaranteed('flower-clicked', true)
   moveFlowerToVase(id)
  
 }

 function moveFlowerToVase(id) {
  document.getElementById('sfx-flower').play()
   var flower = document.getElementById(`ent-flower${id}`)
  //  flower.setAttribute('animation__move', 'property: position; to: 2.164 0.769 3.183; dur: 1500')
  //  flower.setAttribute('animation__rotate', 'property: rotation; to: 0 0 0; dur: 1500')

   var position = ""
  //  var rotation = ""
   switch(id) {
     case "1":
       position = "6.657 1.095 1.774"
       break;
     case "2":
       position = "6.585 0.657 1.754"
       break;
     case "3":
       position = "6.605 1.060 1.663"
       break;
     case "4":
       position = "6.519 0.961 1.673"
       break;
     default:
       break;
   }
   // scrapbook_picture.setAttribute('animation__move', `property: position; to: 4.202 0.907 -1.436; dur: 1500`)

   flower.setAttribute('animation__move', `property: position; to: ${position}; dur: 1500`)
  //  flower.setAttribute('animation__rotate', `property: rotation; to: ${rotation}; dur: 1500`)

  //  add hover
  //  document.getElementById(`hover-flower${id}`).setAttribute('visible', 'false')
 }


 function clickRemote() {
   console.log('clicked remote!')
    AFRAME.scenes[0].emit('toggleRemote', {})
   NAF.connection.broadcastDataGuaranteed('remote-clicked', true)
   document.getElementById('sfx-remote').play()
  
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

   document.getElementById('sfx-radio').play()
   if (!radio.paused) {
       radio.pause()
   } else {
       radio.play()
   }

 }

 function clickCamera() {
   console.log('clicked camera!')
  //  document.getElementById('sfx-camera').play()
  var state = document.getElementById('state')
  var has_done_remote = state.getAttribute('has_done_remote')
  var has_done_radio = state.getAttribute('has_done_radio')
  var has_done_arrange = state.getAttribute('has_done_arrange')
  var has_done_water = state.getAttribute('has_done_water')
  var has_scrapbook_1 = state.getAttribute('has_scrapbook_1')
  var has_scrapbook_2 = state.getAttribute('has_scrapbook_2')
  var has_scrapbook_3 = state.getAttribute('has_scrapbook_3')
  var has_scrapbook_4 = state.getAttribute('has_scrapbook_4')
  
  if ((has_done_remote  == 'true') && (has_scrapbook_1 == 'false')) {
    console.log('getting scrapbook 1 !!')
    moveScrapbook('1')
  } 
  
  if ((has_done_radio  == 'true') && (has_scrapbook_2 == 'false')) {
    moveScrapbook('2')
  } 
  
  if ((has_done_arrange  == 'true') && (has_scrapbook_3 == 'false')) {
    moveScrapbook('3')
  } 
  
  if ((has_done_water == 'true')  && (has_scrapbook_4 == 'false')) {
    moveScrapbook('4')
  } 
   
}

function moveScrapbook(id) {
  console.log('moving scrapbook ' + id)
  var scrapbook_picture = document.getElementById(`ent-scrapbook-${id}`)
  document.getElementById('sfx-camera').play()
  console.log(scrapbook_picture)
  var position = ""
  switch(id) {
    case "1":
      position = "4.087 0 -6.129"
      break;
    case "2":
      position = "4.260 0 -5.847"
      break;
    case "3":
      position = "4.202 0 -5.055"
      break;
    case "4":
      position = "4.160 0 -4.367"
      break;
    default:
      break;
  }
  // scrapbook_picture.setAttribute('animation__move', `property: position; to: 4.202 0.907 -1.436; dur: 1500`)
  var picture = document.getElementById(`scrapbook-${id}`)
  scrapbook_picture.setAttribute('animation__move', `property: position; to: ${position}; dur: 1500`)
  picture.setAttribute('animation__opacity', 'property: opacity; to: 1.0; dur: 1500')
  AFRAME.scenes[0].emit(`toggleScrapbook${id}`, {})
  NAF.connection.broadcastDataGuaranteed(`get-scrapbook-${id}`, true)

}

 function exitRoom() {
   var state = document.getElementById('state')
   document.getElementById('has_done_remote').value = state.getAttribute('has_done_remote')
   document.getElementById('has_done_radio').value = state.getAttribute('has_done_radio')
   document.getElementById('has_done_arrange').value = state.getAttribute('has_done_arrange')
   document.getElementById('has_done_water').value = state.getAttribute('has_done_water')

  var scrapbook_1 = state.getAttribute('has_scrapbook_1')
  var scrapbook_2 = state.getAttribute('has_scrapbook_2')
  var scrapbook_3 = state.getAttribute('has_scrapbook_3')
  var scrapbook_4 = state.getAttribute('has_scrapbook_4')

  if ((scrapbook_1 == 'true') && (scrapbook_2 == 'true') && (scrapbook_3 == 'true') && (scrapbook_4 == 'true')) {
    document.getElementById('has_done_scrapbook').value = 'true'
  } else {
    document.getElementById('has_done_scrapbook').value = 'false'
  }


   document.getElementById('post-session-form').submit()
 }



function clickWatercan() {
    AFRAME.scenes[0].emit('toggleWater', {})
   NAF.connection.broadcastDataGuaranteed('watercan-clicked', true)
   growFlower()
   AFRAME.scenes[0].emit('increaseScore', {points: 50});
   
   
 }

 function growFlower() {
  document.getElementById('sfx-water').play()
   var flower = document.getElementById('ent-flower')
   flower.setAttribute('animation__grow', 'property: scale; to: 0.25 0.25 0.25; dur: 1500')
 }

 function clickFlower() {
   AFRAME.scenes[0].emit('toggleArrange', {})
   NAF.connection.broadcastDataGuaranteed('flower-clicked', true)
   moveFlowerToVase()
  
 }

 function moveFlowerToVase() {
  document.getElementById('sfx-flower').play()
   var flower = document.getElementById('ent-flower')
   flower.setAttribute('animation__move', 'property: position; to: 2.164 0.769 3.183; dur: 1500')
   flower.setAttribute('animation__rotate', 'property: rotation; to: 0 0 0; dur: 1500')
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
      position = "4.202 0.907 -1.436"
      break;
    case "2":
      position = "4.787 0.907 -1.436"
      break;
    case "3":
      position = "4.202 0.907 -0.928"
      break;
    case "4":
      position = "4.787 0.907 -0.928"
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



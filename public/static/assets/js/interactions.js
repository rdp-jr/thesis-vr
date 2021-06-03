function clickWatercan() {
  var state = document.getElementById('state')
  var check = state.getAttribute('has_done_water')
  if (check == 'true') {
    return
  }

  AFRAME.scenes[0].emit('toggleWater', {})
  NAF.connection.broadcastDataGuaranteed('watercan-clicked', true)
  growFlower()
  animateWatercan()
   
 }

 function animateWatercan() {
  var watercan = document.getElementById('water-can')
  watercan.setAttribute('animation__up', 'property: position; to: 2.307 1.516 1.611; dur: 1000')
  watercan.setAttribute('animation__tilt_down', 'property: rotation; to: 0 180 30; dur: 1000')
  watercan.setAttribute('animation__water_1', 'property: position; to: 6.287 1.516 1.611; dur: 2500; startEvents: animationcomplete__up')
  watercan.setAttribute('animation__water_2', 'property: position; to: 2.307 1.516 1.611; dur: 2500; startEvents: animationcomplete__water_1')
  watercan.setAttribute('animation__tilt_up', 'property: rotation; to: 0 180 0; dur: 1000; startEvents: animationcomplete__water_2')
  watercan.setAttribute('animation__down', 'property: position; to: 2.307 0.266 1.611; dur: 1000; startEvents: animationcomplete__water_2')
  
  document.getElementById(`hover-can`).setAttribute('visible', 'false')
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
  //  flower2.setAttribute('animation__adjust', 'property:position; to: 4.812 0.516 1.698; dur: 5000')

   flower3.setAttribute('animation__grow', 'property: scale; to: 0.1 0.1 0.1; dur: 5000')
  //  flower3.setAttribute('animation__adjust', 'property:position; to: 3.962 0.921 1.675; dur: 5000')
  

   flower4.setAttribute('animation__grow', 'property: scale; to: 0.125 0.125 0.125; dur: 5000')
  //  flower4.setAttribute('animation__adjust', 'property:position; to: 5.771 0.687 4.653; dur: 1500')

 }

 function clickFlower(id) {
   AFRAME.scenes[0].emit('toggleArrange', {})
   NAF.connection.broadcastDataGuaranteed(`flower-clicked${id}`, true)
   moveFlowerToVase(id)
  
 }

 function moveFlowerToVase(id) {
  document.getElementById('sfx-flower').play()
   var flower = document.getElementById(`ent-flower${id}`)

   var position = ""

   switch(id) {
     case "1":
       position = "6.730 1.152 1.774"
       break;
     case "2":
       position = "6.585 0.657 1.826"
       break;
     case "3":
       position = "6.688 1.060 1.785"
       break;
     case "4":
       position = "6.607 1.022 1.710"
       break;
     default:
       break;
   }

   var coord = position.split(' ')
   var newCoord = parseFloat(coord[1]) + 0.5
 
   flower.setAttribute('animation__up', `property: position; to: ${coord[0]} ${newCoord} ${coord[2]}; dur: 1500`)
   flower.setAttribute('animation__move', `property: position; to: ${position}; dur: 1500; startEvents: animationcomplete__up`)

   document.getElementById(`hover-flower${id}`).setAttribute('visible', 'false')
 }


 function clickRemote() {
   console.log('clicked remote!')
    AFRAME.scenes[0].emit('toggleRemote', {})
   NAF.connection.broadcastDataGuaranteed('remote-clicked', true)
   document.getElementById('sfx-remote').play()
  
   var vid = document.getElementById('tv-screen')
   var bg = document.getElementById("bg-music")
   if (!vid.paused) {
     console.log('pausing video...')
       vid.pause()
       bg.play()
   } else {
    console.log('playing video...')
       vid.play()
       bg.pause()
   }

 }

 function clickRadio() {
   AFRAME.scenes[0].emit('toggleRadio', {})
   NAF.connection.broadcastDataGuaranteed('radio-clicked', true)
   var radio = document.getElementById('radio-music')
   var bg = document.getElementById("bg-music")

   document.getElementById('sfx-radio').play()
   if (!radio.paused) {
       radio.pause()
       bg.play()
   } else {
       radio.play()
       bg.pause()
   }

 }

 function clickCamera() {
   console.log('clicked camera!')
   NAF.connection.broadcastDataGuaranteed('camera-clicked', true)
   document.getElementById('sfx-camera').play()
  var state = document.getElementById('state')
  var has_scrapbook_1 = state.getAttribute('has_scrapbook_1')

  if (has_scrapbook_1 == 'false') {
    moveScrapbook('1')
    moveScrapbook('2')
    moveScrapbook('3')
    moveScrapbook('4')
  } 
    
}

function moveScrapbook(id) {
  console.log('moving scrapbook ' + id)
  var scrapbook_picture = document.getElementById(`ent-scrapbook-${id}`)
 
  console.log(scrapbook_picture)
  var position = ""
  var rotation = ""
  switch(id) {
    case "1":
      position = "4.416 1.199 -5.899"
      rotation = "-10 0 0"
      break;
    case "2":
      position = "3.945 1.180 -5.899"
      rotation = "-10 0 0"
      break;
    case "3":
      position = "4.454 1.187 -5.190"
      rotation = "10 0 0"
      break;
    case "4":
      position = "4.006 1.188 -5.194"
      rotation = "10 0 0"
      break;
    default:
      break;
  }
 
  var picture = document.getElementById(`scrapbook-${id}`)
  scrapbook_picture.setAttribute('animation__move', `property: position; to: ${position}; dur: 1500`)
  scrapbook_picture.setAttribute('animation__rotate', `property: rotation; to: ${rotation}; dur: 1500`)
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
 
  if (scrapbook_1 == 'true') {
    document.getElementById('has_done_scrapbook').value = 'true'
  } else {
    document.getElementById('has_done_scrapbook').value = 'false'
  }


   document.getElementById('post-session-form').submit()
 }



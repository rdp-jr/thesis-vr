NAF.schemas.add({
  template: '#box-template',
  components: [
    'position',
    'rotation',
    'scale',
    {
      selector: '.blk',
      component: 'position'
    }
  ]
})

// NAF.schemas.add({
//   template: '#flower-template',
//   components: [
//     'position',
//     'rotation',
//     'scale'
//   ]
// })


NAF.schemas.add({
  template: '#avatar-template',
  components: [
    'position',
    'rotation',
    
  ]
});

// last person to go in the room gets ownership
NAF.connection.onConnect(() => {
  // const entBlock = document.getElementById('test-block')
  // NAF.utils.takeOwnership(entBlock)
})
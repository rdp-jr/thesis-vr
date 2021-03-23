// NAF.schemas.add({
//     template: '#text-template',
//     components: [
//         'position',
//         'rotation',
//         'scale',
//         'texttest'
//           ]
// });

NAF.schemas.add({
  template: '#box-template',
  components: [
    'position',
    'rotation',
    'scale',
    'isPlaying',
    {
      selector: '.blk',
      component: 'position'
    }
  ]
})

// NAF.connection.onConnect(() => {
//     const entRemote = document.getElementById('ent-remote')
//     NAF.utils.takeOwnership(entRemote)
//   })


// NAF.connection.onConnect(() => {
//   const entText = document.getElementById('ent-text')
//   NAF.utils.takeOwnership(entText)
// })


// last person to go in the room gets ownership
NAF.connection.onConnect(() => {
  const entBlock = document.getElementById('test-block')
  NAF.utils.takeOwnership(entBlock)
})
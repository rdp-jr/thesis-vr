AFRAME.registerComponent("block", {
    schema: {},
    init: function() {

        var el = this.el
        var addBlock = document.getElementById('addBlock')
        addBlock.addEventListener('click', function() {
            console.log('plus!')
           
            var { x, y, z } = el.getAttribute('position')
            el.setAttribute('position', {x: x, y: y + 1, z: z})
           
        });

        var minusBlock = document.getElementById('minusBlock')
        minusBlock.addEventListener('click', function() {
          console.log('minus!')
         
           var { x, y, z } = el.getAttribute('position')
            el.setAttribute('position', {x: x, y: y - 1, z: z})
        });
    }
})
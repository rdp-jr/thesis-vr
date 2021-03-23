AFRAME.registerComponent('texttest', {
    schema: {
         score : { type: 'number', default: 0 }
    },

    init: function() {
        var el = this.el
        var display = document.getElementById('text-display')
        var data = this.data
        var addBlock = document.getElementById('addBlock')
        display.setAttribute('value', data.score)
        addBlock.addEventListener('click', function() {
            el.setAttribute('score', this.data + 1)
            display.setAttribute('value', data.score)
        });

        var minusBlock = document.getElementById('minusBlock')
        minusBlock.addEventListener('click', function() {
            el.setAttribute('score', this.data - 1)
            display.setAttribute('value', data.score)
        });
    },
})
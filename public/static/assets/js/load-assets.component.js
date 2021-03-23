AFRAME.registerComponent("model-manager", {
    init: function() {
       this.childLoaded = this.childLoaded.bind(this)
       this.childrenReady = this.childrenReady.bind(this)
        for (let child of this.el.children) {
            child.addEventListener("model-loaded", this.childLoaded)
        }
     },
     childrenReady: function() {
        var splash = document.getElementById('splash');
        splash.style.display = 'none';
     },
     childLoaded: (function() {
        var counter = 0
        return function() {
            counter++
            if (counter >= this.el.children.length) {
                this.childrenReady()
            }
        }
     })()
})
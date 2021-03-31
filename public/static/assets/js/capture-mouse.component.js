AFRAME.registerComponent('capture-mouse', {
    init: function () {
      this.eventRepeater = this.eventRepeater.bind(this)
      this.el.sceneEl.addEventListener('loaded', () => {
        this.el.sceneEl.canvas.addEventListener('mousedown', this.eventRepeater)
        this.el.sceneEl.canvas.addEventListener('mouseup', this.eventRepeater)
        this.el.sceneEl.canvas.addEventListener('touchstart', this.eventRepeater)
        this.el.sceneEl.canvas.addEventListener('touchmove', this.eventRepeater)
        this.el.sceneEl.canvas.addEventListener('touchend', this.eventRepeater)
      }, {once: true})
    },
    eventRepeater: function (evt) {
      if (evt.type.startsWith('touch')) {
        evt.preventDefault()
        // avoid repeating touchmove because it interferes with look-controls
        if (evt.type === 'touchmove') { return }
      }
      this.el.emit(evt.type, evt.detail);
    }
});
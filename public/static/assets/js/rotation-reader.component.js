AFRAME.registerComponent('rotation-reader', {
    tick: function () {
      // `this.el` is the element.
      // `object3D` is the three.js object.
  
      // `rotation` is a three.js Euler using radians. `quaternion` also available.
    //   console.log(this.el.object3D.rotation);
  
      // `position` is a three.js Vector3.
    //   console.log(this.el.object3D.position);

    // this.el.object3D.rotation = document.getElementById('cam').object3D.rotation;
    // console.log(this.el.object3D.rotation);
    // console.log('=-=')
    // console.log(document.getElementById('cam').object3D.rotation)
    
    var camRot = document.getElementById('cam').object3D.rotation;
    // this.el.object3D.rotation
    this.el.setAttribute('rotation', {x: camRot._x, y: camRot._y, z: camRot._z})
    // this.el.setAttribute('rotation')
    // console.log(this.el.object3D.rotation)
    }
  });
(function(){
  'use strict';
  var fine=matchMedia('(hover:hover) and (pointer:fine)');
  var reduced=matchMedia('(prefers-reduced-motion:reduce)');
  function tilt(element,event,limit){
    if(!fine.matches||reduced.matches)return;
    var r=element.getBoundingClientRect();
    var x=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));
    var y=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));
    element.style.setProperty('--rx',(-y*limit).toFixed(2)+'deg');
    element.style.setProperty('--ry',(x*limit).toFixed(2)+'deg');
  }
  function reset(el){el.style.removeProperty('--rx');el.style.removeProperty('--ry');}
  document.querySelectorAll('.work').forEach(function(card){
    card.addEventListener('pointermove',function(e){tilt(card,e,5)});
    card.addEventListener('pointerleave',function(){reset(card)});
    card.addEventListener('blur',function(){reset(card)});
  });
  var modal=document.getElementById('lb');
  var image=document.getElementById('lbImg');
  modal.addEventListener('pointermove',function(e){if(modal.classList.contains('open'))tilt(image,e,9)});
  modal.addEventListener('pointerleave',function(){reset(image)});
  new MutationObserver(function(){reset(image)}).observe(image,{attributes:true,attributeFilter:['src']});
  // Keep keyboard navigation inside the enlarged image dialog.
  modal.addEventListener('keydown',function(e){
    if(e.key!=='Tab'||!modal.classList.contains('open'))return;
    var controls=Array.from(modal.querySelectorAll('button'));
    var index=controls.indexOf(document.activeElement);
    if(e.shiftKey&&index<=0){e.preventDefault();controls[controls.length-1].focus()}
    else if(!e.shiftKey&&index===controls.length-1){e.preventDefault();controls[0].focus()}
  });
})();

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

(function(){
 'use strict';
 var links=document.querySelectorAll('#nav a');
 var labels=['Portadas','Discotecas','Flyers','Logos','Miniaturas'];
 var paths=[
  'M9 18V5l11-2v13M9 8l11-2M9 18c0 1.7-1.6 3-3.5 3S2 19.7 2 18s1.6-3 3.5-3S9 16.3 9 18zm11-2c0 1.7-1.6 3-3.5 3S13 17.7 13 16s1.6-3 3.5-3 3.5 1.3 3.5 3z',
  'M9 3h6l-1 6 5 3-7 9-7-9 5-3-1-6zM5 12h14M12 12v9',
  'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5',
  'M12 2l10 10-10 10L2 12 12 2zM8 12l4-4 4 4-4 4-4-4z',
  'M3 5h18v14H3zM10 9l6 3-6 3V9z'
 ];
 links.forEach(function(link,i){
  var original=link.textContent;
  link.setAttribute('aria-label',original);
  link.innerHTML='<svg class="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="'+paths[i]+'"/></svg><span></span>';
  var label=link.querySelector('span');
  var compact=matchMedia('(max-width:1100px)');
  function updateLabel(){label.textContent=compact.matches?labels[i]:original}
  compact.addEventListener('change',updateLabel);updateLabel();
 });
 var modal=document.getElementById('lb');
 var image=document.getElementById('lbImg');
 var count=document.createElement('span');count.className='lb-count';count.setAttribute('aria-live','polite');modal.appendChild(count);
 function updateCount(){
  var selected=Array.from(document.querySelectorAll('.work img')).find(function(el){return el.getAttribute('src')===image.getAttribute('src')});
  if(!selected)return;
  var card=selected.closest('.work');
  var total=document.querySelectorAll('.work[data-folder="'+card.dataset.folder+'"]').length;
  count.textContent=(Number(card.dataset.i)+1)+' / '+total;
 }
 new MutationObserver(updateCount).observe(image,{attributes:true,attributeFilter:['src']});
 // Match the highlighted island option to the section nearest the top.
 var ticking=false;
 function highlight(){
  ticking=false;
  var sections=Array.from(document.querySelectorAll('.portfolio-section'));
  var active=null;
  sections.forEach(function(section){if(section.getBoundingClientRect().top<=innerHeight*.38)active=section});
  links.forEach(function(link){if(active&&link.hash==='#/'+active.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 }
 window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(highlight)}},{passive:true});
 window.addEventListener('resize',highlight);highlight();
})();

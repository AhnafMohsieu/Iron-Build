// render/modals.js — Toast and level-up modals
(function() {
  function openToastModal(html) {
    var ov = document.getElementById('toastOverlay');
    ov.innerHTML = '<div class="toast-box">' + html + '</div>';
    ov.style.display = 'flex';
    ov.classList.add('show');
    ov.style.pointerEvents = 'auto';
    ov.onclick = function() { closeToastOverlay(); };
  }

  function closeToastOverlay() {
    var ov = document.getElementById('toastOverlay');
    ov.classList.remove('show');
    setTimeout(function() { ov.style.display = 'none'; ov.innerHTML = ''; }, 400);
    ov.style.pointerEvents = 'none';
  }

  window.openToastModal = openToastModal;
  window.closeToastOverlay = closeToastOverlay;
})();

// 학생 안내 주소 상자: <div class="share" data-path="student.html"> 안의 [data-url] 에 주소, .qr 에 QR, [data-copy] 단추로 복사
(function () {
  document.querySelectorAll('[data-share]').forEach(function (box) {
    var url = new URL(box.getAttribute('data-share'), location.href).href;
    box.querySelectorAll('[data-url]').forEach(function (el) { el.textContent = url; });
    box.querySelectorAll('a[data-open]').forEach(function (a) { a.href = url; });
    var qr = box.querySelector('.qr');
    if (qr && window.QRCode) { try { new QRCode(qr, { text: url, width: 300, height: 300, correctLevel: QRCode.CorrectLevel.M }); } catch (e) { qr.textContent = 'QR을 만들지 못했어요'; } }
    var b = box.querySelector('[data-copy]');
    if (b) b.addEventListener('click', function () {
      var done = function () { var t = b.textContent; b.textContent = '✓ 복사했어요'; setTimeout(function () { b.textContent = t; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('주소를 복사해 주세요', url); });
      else prompt('주소를 복사해 주세요', url);
    });
  });
})();

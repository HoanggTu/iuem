// Tập hợp love được chạm
const loveTaps = new Set();
let userName = '';

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    return;
  }

  stages.startStage.style.display = 'none';
  stages.inputStage.style.display = 'block';
  stages.loveStage.style.display = 'none';
  stages.cardStage.style.display = 'none';

  document.getElementById('bgMusic')?.play().catch(err =>
    console.warn('Không thể phát nhạc:', err)
  );

  inipesan();
}

// Hiệu ứng gõ chữ
typeWriterEffect = (text, elementId, callback) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50;
  element.textContent = '';

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Hiệu ứng gõ hoàn tất');
      callback?.();
    }
  };

  type();
};

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden');
    setTimeout(() => {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
    }, 1000);
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}
const loveText = "LOVE"
function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id}) .love-letter`);
  loveIcon.classList.add('tapped');
  loveIcon.textContent = loveText[id - 1];
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 4) {
    Swal.fire({
      title: 'Đủ điều kiện rồi nè!',
      text: 'Xin hãy nhận lời chúc ạ! 💖',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      switchStage('loveStage', 'cardStage', true);

      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) return console.error('Không tìm thấy element loveMsg!');

      typeWriterEffect(
        // `Chúc ${userName} của anh  thật vui vẻ như một đứa trẻ, nhưng được anh yêu như một nữ hoàng 👑. Dù em có lớn bao nhiêu thì trong tim anh, em vẫn là công chúa bé bỏng cần được cưng chiều mỗi ngày! 💘`,
        `Chúc mừng sinh nhật ${userName} ! Chúc Dì ngập tràn năng lượng tích cực mỗi ngày. Mong tuổi mới sẽ mang đến cho cô thật nhiều niềm vui, công việc cũng như sự nghiệp phát triển hơn nữa cùng với những kỷ niệm đẹp và những điều bất ngờ tuyệt vời
         Chúc Dì một ngày sinh nhật thật ý nghĩa, trọn vẹn và đáng nhớ! 🎂💐💖.`,
        'loveMsg',
        () => {
          const fromTag = document.createElement("div");
          fromTag.id = 'fromTag';
          fromTag.textContent = "Cháu của Dì, Tú";
          fromTag.style.marginTop = "20px";
          fromTag.style.opacity = "0";
          fromTag.style.transition = "opacity 1s ease";
          loveMsg.appendChild(fromTag);

          setTimeout(() => {
            fromTag.style.opacity = "1";
          }, 500);
        }
      );
    });
  }
}

async function inipesan() {
  const { value: typedName } = await Swal.fire({
    title: 'Cần phải nhập tên đó ạ!',
    input: 'text',
    inputValue: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: true,
    didOpen: () => Swal.getInput()?.focus(),
    preConfirm: () => Swal.getInput()?.value?.trim()
  });

  if (typedName) {
    userName = typedName;
    loveTaps.clear();
    document.querySelectorAll('.love-icon').forEach(icon =>
      icon.classList.remove('tapped')
    );
    switchStage('inputStage', 'loveStage');
  } else {
    await Swal.fire({
      icon: 'warning',
      title: 'NÔ nô, không được bỏ trống!!',
      confirmButtonText: 'Nhập lại đi ạ'
    });
    inipesan();
  }
}

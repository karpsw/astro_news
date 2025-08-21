// Функция для получения Open Graph (og) метаданных
function getOgMeta(property) {
  const metaTag = document.querySelector(`meta[property="og:${property}"]`);
  return metaTag ? metaTag.getAttribute('content') : null;
}

// Формируем объект с данными для шаринга
const shareData = {
  title: getOgMeta('title') || document.title,
  text: getOgMeta('description') || 'Посмотрите на эту интересную статью!',
  url: getOgMeta('url') || window.location.href,
};

const generalShareBtns = document.querySelectorAll('.share-general');
const whatsappLinks = document.querySelectorAll('.share-whatsapp');
const telegramLinks = document.querySelectorAll('.share-telegram');
const viberLinks = document.querySelectorAll('.share-viber');
const vkLinks = document.querySelectorAll('.share-vk');
const okLinks = document.querySelectorAll('.share-ok');

const encodedUrl = encodeURIComponent(shareData.url);
const encodedTitle = encodeURIComponent(shareData.title);
const encodedText = encodeURIComponent(shareData.text);

// Проверяем поддержку Web Share API при загрузке страницы
if (navigator.share) {
  // Если поддерживается, показываем общие кнопки и добавляем обработчики
  generalShareBtns.forEach((btn) => {
    btn.style.display = 'block'; // Или 'inline-block', в зависимости от вашего CSS
    btn.addEventListener('click', async () => {
      try {
        await navigator.share(shareData);
        // console.log('Контент успешно отправлен');
      } catch (err) {
        // console.error(`Ошибка: ${err}`);
      }
    });
  });
} else {
  // console.log('Ваш браузер не поддерживает функцию нативного шаринга.');
  // Можно скрыть кнопки нативного шаринга, если нужно
  generalShareBtns.forEach((btn) => {
    //btn.style.display = 'none';
  });
}

// Устанавливаем атрибут href для всех WhatsApp ссылок
whatsappLinks.forEach((link) => {
  link.href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
});

// Устанавливаем атрибут href для всех Telegram ссылок
telegramLinks.forEach((link) => {
  link.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
});

// Устанавливаем атрибут href для всех Viber ссылок
viberLinks.forEach((link) => {
  link.href = `viber://forward?text=${encodedText}%20${encodedUrl}`;
});

// Устанавливаем атрибут href для всех VK ссылок
vkLinks.forEach((link) => {
  link.href = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}`;
});

// Устанавливаем атрибут href для всех OK ссылок
okLinks.forEach((link) => {
  link.href = `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${encodedUrl}`;
});

const apiUrl = `https://count-server.sharethis.com/v2.0/get_counts?url=${shareData.url}`;

// Получаем данные и обновляем элементы счетчиков
fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    const allClicks = data?.total || '13'; // Значение по умолчанию 13

    // Обновляем все элементы с классом count-share
    document.querySelectorAll('.count-share').forEach((element) => {
      element.textContent = allClicks;
    });
  })
  .catch((error) => {
    // console.error('There was a problem with the fetch operation:', error);
    // Устанавливаем значение по умолчанию при ошибке
    document.querySelectorAll('.count-share').forEach((element) => {
      element.textContent = '13';
    });
  });

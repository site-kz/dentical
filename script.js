'use strict';
const WHATSAPP_NUMBER = '77766632330';
document.querySelector('#year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const dialog = document.querySelector('#booking-dialog');
const form = document.querySelector('#booking-form');
const serviceSelect = document.querySelector('#service-select');
const dateInput = document.querySelector('#visit-date');
let openingButton;
function localDate() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
document.addEventListener('click', event => {
  const button = event.target.closest('[data-book]');
  if (!button) return;
  openingButton = button;
  closeMenu(); form.reset(); form.elements.name.setCustomValidity(''); dateInput.setCustomValidity('');
  serviceSelect.value = button.dataset.service || 'Консультация';
  dateInput.min = localDate();
  dialog.setAttribute('aria-labelledby', 'booking-title');
  dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('modal-open');
});
function closeDialog() { dialog.close(); }
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); form.reset(); openingButton?.focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(); } });
dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (dateInput.value < localDate()) { dateInput.setCustomValidity('Выберите сегодняшнюю или будущую дату.'); dateInput.reportValidity(); return; }
  const name = form.elements.name.value.trim();
  if (name.length < 2) { form.elements.name.setCustomValidity('Введите имя минимум из двух букв.'); form.elements.name.reportValidity(); return; }
  const formattedDate = new Date(dateInput.value + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const message = `Здравствуйте! Хочу записаться на приём.\nМеня зовут: ${name}.\nУслуга: ${serviceSelect.value}.\nЖелаемая дата: ${formattedDate}.\nЖелаемое время: ${form.elements.time.value}.\nПодскажите, пожалуйста, свободно ли это время и какова стоимость?`;
  // Посетитель самостоятельно подтверждает отправку сообщения в WhatsApp.
  window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));

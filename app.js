'use strict';
const filters = [...document.querySelectorAll('[data-filter]')];
const products = [...document.querySelectorAll('.product')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
filters.forEach(button => button.addEventListener('click',() => {
  const category = button.dataset.filter;
  filters.forEach(item => { const selected = item === button; item.classList.toggle('active',selected); item.setAttribute('aria-pressed',String(selected)); });
  let count = 0;
  products.forEach(product => { product.hidden = category !== 'all' && product.dataset.category !== category; if (!product.hidden) count++; });
  document.querySelector('#filter-status').textContent = 'Показано категорий: ' + count;
  if (!reducedMotion.matches) document.querySelector('.products').animate([{opacity:.5},{opacity:1}],{duration:180});
}));
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click',() => {
  document.querySelector('#product-type').value = button.dataset.product;
  document.querySelector('#request').scrollIntoView({behavior:reducedMotion.matches ? 'instant' : 'smooth',block:'start'});
  document.querySelector('#product-type').focus({preventScroll:true});
}));
const form = document.querySelector('#request-form');
const result = document.querySelector('#request-result');
const manualCopy = document.querySelector('#manual-copy');
form.addEventListener('input',() => { result.hidden = true; manualCopy.hidden = true; });
form.addEventListener('submit',async event => {
  event.preventDefault();
  const message = form.elements.message.value.trim();
  const text = 'Здравствуйте! Интересует: ' + form.elements.product.value + '.' + (message ? '\n' + message : '') + '\nПодскажите подходящие варианты и стоимость.';
  try {
    if (!navigator.clipboard || !isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    manualCopy.hidden = true;
    result.textContent = 'Запрос скопирован. Его можно отправить продавцу.';
  } catch {
    manualCopy.value = text;
    manualCopy.hidden = false;
    manualCopy.focus();
    manualCopy.select();
    result.textContent = 'Скопируйте выделенный текст вручную.';
  }
  result.hidden = false;
});

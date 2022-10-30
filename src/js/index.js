import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import '../css/styles.css';
import '../css/gallery.css';
import { ItemsApi } from './ItemsApi';
import { getItemMarkup } from './markup/get-item-markup';

const galleryRef = document.querySelector('.gallery');
const searchFormRef = document.querySelector('.search-form');
const loadMoreRef = document.querySelector('.load-more');

const itemsApi = new ItemsApi();

searchFormRef.addEventListener('submit', onSearchFormSubmit);
loadMoreRef.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  e.target.reset();
  await itemsApi
    .fetchItems(value)
    .then(res => {
      removeChildren(galleryRef);
      onSuccessFetchItems(res);
    })
    .catch(e => {
      removeChildren(galleryRef);
      Notify.failure(e.message);
    });

  if (!itemsApi.isLastPage()) {
    loadMoreRef.classList.remove('is-hidden');
  } else {
    loadMoreRef.classList.add('is-hidden');
  }
}

function onSuccessFetchItems(result) {
  renderList(result.data.hits);
}

async function onLoadMoreClick(e) {
  e.preventDefault();
  itemsApi.incrementPage();

  try {
    const res = await itemsApi.fetchItems();
    onSuccessFetchItems(res);
  } catch (e) {
    Notify.failure(e.message);
  }

  if (itemsApi.isLastPage()) {
    loadMoreRef.classList.add('is-hidden');
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    itemsApi.resetPage();
  }
}

function removeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function renderList(itemList) {
  galleryRef.insertAdjacentHTML('beforeend', getItemListMarkup(itemList));
}

function getItemListMarkup(itemList) {
  return itemList.map(it => getItemMarkup(it)).join('');
}

import axios from 'axios';

export class ItemsApi {
  page = 1;
  value = '';
  pageMax = 0;

  incrementPage() {
    if (this.page < this.pageMax) this.page++;
  }

  resetPage() {
    this.page = 1;
  }

  isLastPage() {
    return this.page >= this.pageMax;
  }

  async fetchItems(string) {
    this.value = string ?? this.value;

    const config = {
      params: {
        key: '30990142-02df30911bc49e76c2f735058',
        per_page: 40,
        q: this.value,
        image_type: 'photo', 
      page:this.page
      },
    };

    return await axios.get(`https://pixabay.com/api/`, config).then(res => {
      this.pageMax = Math.ceil(res.data.totalHits / config.params.per_page);

      if (res.data.totalHits === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      return res;
    });
  }
}

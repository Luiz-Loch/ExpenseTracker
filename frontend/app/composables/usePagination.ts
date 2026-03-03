import { ref, watch, type Ref } from 'vue'
import type { PaginatedResponse } from '~/types/pagination'

export function usePagination<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  perPage: number = 10,
): {
  items: Ref<Array<T>>;
  currentPage: Ref<number>;
  itemsPerPage: number;
  total: Ref<number>;
  loading: Ref<boolean>;
  fetchPage: () => Promise<void>;
  resetPage: () => void;
} {
  const items = ref<Array<T>>([]) as Ref<Array<T>>;
  const currentPage = ref(1);
  const total = ref(0);
  const loading = ref(true);
  const itemsPerPage = perPage;

  async function fetchPage(): Promise<void> {
    loading.value = true;
    try {
      const response = await fetchFn(currentPage.value, itemsPerPage);
      items.value = response.data;
      total.value = response.total;

      // If current page has no items but earlier pages exist, go back
      if (items.value.length === 0 && currentPage.value > 1) {
        currentPage.value = Math.max(1, response.totalPages);
      }
    } finally {
      loading.value = false;
    }
  }

  function resetPage(): void {
    if (currentPage.value === 1) {
      fetchPage();
    } else {
      currentPage.value = 1;
    }
  }

  watch(currentPage, () => { fetchPage() });

  return { items, currentPage, itemsPerPage, total, loading, fetchPage, resetPage }
}

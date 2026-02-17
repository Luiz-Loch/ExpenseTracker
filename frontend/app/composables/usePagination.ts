import { ref, computed, type ComputedRef } from 'vue'

export function usePagination<T>(filteredItems: ComputedRef<Array<T>>, perPage: number = 10) {
  const currentPage = ref(1);
  const itemsPerPage = perPage;

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredItems.value.slice(start, start + itemsPerPage)
  });

  function resetPage() {
    currentPage.value = 1;
  }

  return { currentPage, itemsPerPage, paginatedItems, resetPage }
}

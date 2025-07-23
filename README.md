## Swapping Between Mock Data and Real API

This project is designed to be metadata-driven and makes it easy to switch between mock data and a real Laravel API.

### Using Mock Data (Default)

The context providers for metadata and layouts import mock data from `src/mocks/`:

```ts
// Example: src/contexts/metadata-context.tsx
import { mockObjectsResponse } from "@/mocks";

useEffect(() => {
  // ...
  setObjects(mockObjectsResponse.data); // Uses mock data
  // ...
}, []);
```

### Switching to Real API

To use a real Laravel API, replace the mock import and assignment with an API call (e.g., using fetch or axios):

```ts
// Example: src/contexts/metadata-context.tsx
// import { mockObjectsResponse } from "@/mocks"; // Remove this

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Fetch from your Laravel API
      const response = await fetch("/api/objects");
      const apiResponse = await response.json();
      setObjects(apiResponse.data); // Uses real API data
    } catch (err) {
      setError("Failed to load metadata objects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, []);
```

> **Tip:** The API response shape should match the `ApiResponse<T>` or `PaginatedResponse<T>` types in `src/types/index.ts` for seamless integration.

## Note

The `@/` path alias points to the `src/` directory

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```

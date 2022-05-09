import { LocationQuery } from 'vue-router';

export const generateQueryParams = (
  limit: number,
  offset: number,
  query: LocationQuery
) => {
  const urlSearchParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  if (Object.keys(query).length > 0) {
    for (const key in query) {
      if (typeof query[key] === 'object') {
        (query[key] as string[]).forEach((val) =>
          urlSearchParams.append(key, val)
        );
        continue;
      }

      urlSearchParams.append(key, query[key] as string);
    }
  }

  return urlSearchParams;
};

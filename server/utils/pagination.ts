export function setPaginationHeaders(event: any, { total, page, limit }: any) {
  if (page === undefined || limit === undefined) {
    return;
  }
  setResponseHeaders(event, {
    "X-Total-Items": total,
    "X-Total-Pages": Math.ceil(total / limit),
    "X-Current-Page": page,
    "X-Per-Page": limit
  })
}
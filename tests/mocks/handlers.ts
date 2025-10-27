import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("http://localhost/api/transactions", () => {
    return HttpResponse.json([
      { id: 1, description: "Lunch", amount: 12.5 },
      { id: 2, description: "Coffee", amount: 4.25 },
    ])
  }),
]

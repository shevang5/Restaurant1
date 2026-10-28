import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 2 },
    { duration: "2m", target: 5 },
    { duration: "2m", target: 10 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

const baseURL = __ENV.BASE_URL || "https://restaurant1-g7zj.onrender.com/api";

export default function () {
  const response = http.get(`${baseURL}/products`);
  check(response, {
    "status is 200": (r) => r.status === 200,
  });
}
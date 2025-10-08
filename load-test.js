// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1s', target: 1 },
    { duration: '1s', target: 1 },
    { duration: '1s', target: 0 },
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<500'],
  },
};

export default function () {
  // Aponta para o endpoint interno do n8n

  const res = http.get('http://localhost:5678/healthz');

  check(res, {
    'status was 200': (r) => r.status == 200,
  });
}

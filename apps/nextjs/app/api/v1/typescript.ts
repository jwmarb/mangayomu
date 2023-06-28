import { Handler, Route } from '@mangayomu/request-handler';

const get: Route = (request, response) => {
  response.json('Hello from TypeScript');
};

export default Handler.builder().route('GET', get).build();

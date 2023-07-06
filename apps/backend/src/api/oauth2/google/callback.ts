import { Handler, Route } from '@mangayomu/request-handler';

const get: Route = (req, res) => {
  res.json('Hello');
};

export default Handler.builder().route('GET', get).build();

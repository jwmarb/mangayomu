import { Handler, Route } from '@mangayomu/request-handler';

const get: Route = (req, res) => {
  res.json({ status: 'work in progress', query: req.query() });
};

export default Handler.builder().route('GET', get).build();

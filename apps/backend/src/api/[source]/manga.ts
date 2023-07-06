import { Handler, Route } from '@mangayomu/request-handler';
import { redis } from '@main';

const get: Route = (req, res) => {
  redis.get('key');
  res.json({ status: 'work in progress', query: req.query() });
};

export default Handler.builder().route('GET', get).build();

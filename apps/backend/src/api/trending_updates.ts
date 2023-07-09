import '@mangayomu/mangascraper';
import { Handler, Route } from '@mangayomu/request-handler';
import { getListMangas, mongodb } from '@main';
import type { UpdatesParams } from '@main';
const get: Route = async (req, res) => {
  const query = req.query<UpdatesParams>();
  if (!Array.isArray(query.source)) query.source = [query.source];
  const data = getListMangas(query.source, 'trending_updates', 'listHotMangas');

  res.json(data);
};

export default Handler.builder()
  .middleware(mongodb())
  .route('GET', get)
  .build();

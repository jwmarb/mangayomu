import { Handler, Route } from '@mangayomu/request-handler';
import { googleClient } from '../../clients';

interface AuthQueryParams {
  code: string;
  state: string;
  scope: string;
  prompt: string;
}

const get: Route = async (request, response) => {
  const query = request.query<AuthQueryParams>();
  const { tokens } = await googleClient.getToken(query.code);

  response.json(tokens);
};

export default Handler.builder().route('GET', get).build();

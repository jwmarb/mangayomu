import env from '@mangayomu/vercel-env';
import * as Realm from 'realm-web';

const realm = new Realm.App({
  id: env().REACT_APP_REALM_ID,
});

export default realm;

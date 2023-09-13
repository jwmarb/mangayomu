import _Radio from './radio';
import Group from './group';

const Radio = _Radio as typeof _Radio & { Group: typeof Group };
Radio.Group = Group;

export default Radio;

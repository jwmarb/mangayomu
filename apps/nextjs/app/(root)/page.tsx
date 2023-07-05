import React from 'react';
import Text from '@app/components/Text';
import { GiBookshelf } from 'react-icons/gi';
import Button from '@app/components/Button';

const Home: React.FC = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center space-y-2 mx-auto absolute top-0 bottom-0 left-0 right-0 my-auto">
      <GiBookshelf className="text-primary w-20 h-20" />
      <div>
        <Text className="text-center" variant="header">
          No sources selected
        </Text>
        <Text className="text-center" color="text-secondary">
          Selected sources will have their updates shown here
        </Text>
      </div>
      <Button variant="contained" color="primary">
        Open Source Selector
      </Button>
    </div>
  );
};

export default Home;

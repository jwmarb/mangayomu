import Text from '@app/components/Text';
import { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';

interface SupportedLanguagesProps {
  languages: [ISOLangCode, string][];
}

export default function SupportedLanguages(props: SupportedLanguagesProps) {
  const { languages } = props;
  return (
    <div className="grid grid-cols-2 justify-between gap-2">
      <Text color="text-secondary">Supported languages</Text>
      <Text className="font-medium text-end">
        {languages.map(([lang, name]) => name).join(', ')}
      </Text>
    </div>
  );
}

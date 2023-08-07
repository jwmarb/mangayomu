import Modal, { ModalMethods } from '@app/components/Modal';
import Tabs from '@app/components/Tabs';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import Filter from '@app/components/Filter';
import { IMangaSchema, SortChaptersBy } from '@mangayomu/schemas';

interface FilterModalProps extends React.PropsWithChildren {
  supportedLanguages?: [ISOLangCode, string][] | null;
  onSelectLanguage: (val: IMangaSchema['selectedLanguage']) => void;
  selectedLanguage: IMangaSchema['selectedLanguage'];
  onSort: (val: SortChaptersBy, reversed: boolean) => void;
  sortBy: SortChaptersBy;
  reversed: boolean;
}

function FilterModal(
  props: FilterModalProps,
  ref: React.ForwardedRef<ModalMethods>,
) {
  const {
    supportedLanguages,
    onSelectLanguage,
    selectedLanguage,
    onSort,
    sortBy,
    reversed,
  } = props;

  if (supportedLanguages == null) return null;

  return (
    <Modal ref={ref} className="h-96">
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Sort</Tabs.Tab>
          <Tabs.Tab>Language</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <Filter
            type="sort"
            selected={sortBy}
            reversed={reversed}
            onChange={onSort}
          >
            <Filter.Sort value="Chapter number" />
            <Filter.Sort value="Timestamp" />
          </Filter>
        </Tabs.Panel>
        <Tabs.Panel>
          <Filter
            type="select"
            onChange={onSelectLanguage}
            selected={selectedLanguage}
          >
            <Filter.Select value="Use default language" />
            {supportedLanguages.map(([code, lang]) => (
              <Filter.Select
                key={code}
                value={code}
                text={`${lang} (${languages[code].nativeName})`}
              />
            ))}
          </Filter>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}

export default React.forwardRef(FilterModal);

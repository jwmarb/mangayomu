import Modal, { ModalMethods } from '@app/components/Modal';
import Tabs from '@app/components/Tabs';
import Text from '@app/components/Text';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { MdArrowUpward, MdCheck } from 'react-icons/md';
import Filter from '@app/components/Filter';
import useBoolean from '@app/hooks/useBoolean';
import { IMangaSchema, SortChaptersByType } from '@app/realm/Manga';

interface FilterModalProps extends React.PropsWithChildren {
  supportedLanguages: [ISOLangCode, string][];
  onSelectLanguage: (val: IMangaSchema['selectedLanguage']) => void;
  selectedLanguage: IMangaSchema['selectedLanguage'];
  onSort: (val: SortChaptersByType, reversed: boolean) => void;
  sortBy: SortChaptersByType;
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

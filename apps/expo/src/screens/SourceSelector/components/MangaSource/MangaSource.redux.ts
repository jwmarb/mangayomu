import { AppState } from '@redux/store';
import { MangaSourceProps } from '@screens/SourceSelector/components/MangaSource/MangaSource.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { setSource } from '@redux/reducers/settingsReducer';

const mapStateToProps = (state: AppState, props: MangaSourceProps) => props;

const connector = connect(mapStateToProps, { setSource });

export type ConnectedMangaSourceProps = ConnectedProps<typeof connector>;

export default connector;

import displayMessage from '@helpers/displayMessage';
import Clipboard from '@react-native-clipboard/clipboard';

export default function copyTextToClipboard(text: string) {
  Clipboard.setString(text);
  displayMessage('Copied to clipboard.');
}

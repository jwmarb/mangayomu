import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Contrast from '@/components/Contrast';
import useModeSelect from '@/hooks/useModeSelect';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import Text from '@/components/Text';
import Button from '@/components/Button';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  smallContainer: {
    padding: theme.style.size.m,
    flexShrink: 1,
    backgroundColor: theme.palette.background.default,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.style.size.m,
  },
}));

export default function ContrastFixture() {
  const mode = useModeSelect();
  const style = useStyles(styles, mode);
  const opposite = useStyles(styles, !mode);
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <Text color="secondary">Be advised when switching themes!</Text>
        <Text color="primary">
          This text does not have any contrast and will use system theme
        </Text>
        <Text color="textPrimary">
          It is a bit boring to show just the app colors...
        </Text>
        <Text color="textSecondary">
          So let's spice it up by showing regular text colors
        </Text>
        <Contrast contrast={mode}>
          <Text color="primary">But this text has contrast</Text>
          <Text color="secondary">So does this one</Text>
          <Text color="textPrimary">
            It is a bit boring to show just the app colors...
          </Text>
          <Text color="textSecondary">
            So let's spice it up by showing regular text colors
          </Text>
        </Contrast>
        <Text variant="h1" contrast={mode}>
          Header 1
        </Text>
        <Text contrast={mode} color="textSecondary">
          Passed into Text component.{'\n'}Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Quaerat nam blanditiis voluptate
          temporibus possimus labore, ipsum laboriosam necessitatibus omnis iste
          libero, dicta fuga eum inventore reiciendis in vero aperiam iure.
        </Text>
        <Contrast contrast={!mode}>
          <View style={opposite.smallContainer}>
            <Text variant="h2">Header 2</Text>
            <Text color="textSecondary">
              Everything here and its children use context-provided contrast.
              {'\n'}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
              saepe provident eos veniam error eveniet iure voluptas quam, quasi
              accusantium nisi laudantium. Voluptates delectus nobis rem
              consectetur velit similique corrupti?
            </Text>
            <View style={style.buttons}>
              <Button title="Continue as guest" />
              <Button title="Login" variant="contained" />
            </View>
            <Contrast contrast={mode}>
              <View style={style.smallContainer}>
                <Text variant="h3">Header 3</Text>
                <Text color="textSecondary">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Asperiores sint doloribus praesentium quaerat sit et. Sed
                  harum modi tempore quia, dolorem doloremque mollitia sunt!
                  Perspiciatis perferendis tenetur delectus accusantium amet.
                </Text>
                <View style={style.buttons}>
                  <Button title="Cancel" />
                  <Button title="Delete post" color="secondary" />
                </View>
                <Contrast contrast={!mode}>
                  <View style={opposite.smallContainer}>
                    <Text variant="h3">Header 3</Text>
                    <Text color="textSecondary">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Impedit sapiente unde odio rerum ratione autem accusamus
                      veniam sequi eaque, dolore cupiditate velit, ducimus totam
                      dolorem excepturi placeat blanditiis? Quidem, sed.
                    </Text>
                    <Button
                      title="Add to order"
                      variant="contained"
                      textAlignment="center"
                    />
                  </View>
                </Contrast>
              </View>
            </Contrast>
            <Text variant="h2">Header 2</Text>
            <Text color="textSecondary">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Obcaecati unde, libero expedita recusandae at laboriosam corporis
              ullam enim autem consectetur exercitationem, iure iusto, tempore
              fugiat consequatur nam dicta corrupti rerum?
            </Text>
          </View>
        </Contrast>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Box, VStack } from 'native-base';
import { Modal, StyleSheet } from 'react-native';
import ColorPicker, {
  HueCircular,
  Preview,
  SaturationSlider,
  type returnedResults,
} from 'reanimated-color-picker';

import Button from '../atoms/Button';

interface ColorPickerModalProps {
  setIsVisible(bool: boolean): void;
  onComplete(colors: returnedResults): void;
  isVisible: boolean;
}

function ColorPickerModal({
  isVisible,
  setIsVisible,
  onComplete,
}: ColorPickerModalProps) {
  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <Box flex={1} justifyContent="center" alignItems="center">
        <VStack
          bg="primary.700"
          borderColor="border.500"
          borderWidth="1"
          rounded="4"
        >
          <ColorPicker
            value="red"
            onComplete={onComplete}
            style={styles.colorPicker}
          >
            <VStack space="4">
              <HueCircular containerStyle={styles.hueCircularContainer} />

              <SaturationSlider />

              <Preview hideText hideInitialColor />

              <Button
                type="secondary"
                label="Select"
                onPress={() => setIsVisible(false)}
              />
            </VStack>
          </ColorPicker>
        </VStack>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  colorPicker: {
    width: 200,
    margin: 20,
    padding: 10,
  },
  hueCircularContainer: {
    backgroundColor: '#1C1C1C',
  },
});

export default ColorPickerModal;

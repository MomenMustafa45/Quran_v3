import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { styles } from './styles';
import AppText from '../AppText/AppText';
import AppIcon from '../AppIcon/AppIcon';
import { iconSizes } from '../../constants/desingSystem';
import { COLORS } from '../../constants/colors';

type AppModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  modalParentCustomStyles?: StyleProp<ViewStyle>;
};

export default function AppModal({
  visible,
  title,
  onClose,
  children,
  modalParentCustomStyles,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          {/* Prevent closing when tapping inside modal */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <AppText style={styles.title}>{title}</AppText>
                <TouchableOpacity onPress={onClose}>
                  <AppIcon
                    name="close"
                    type="Ionicons"
                    size={iconSizes['2xl']}
                    color={COLORS.lightCream}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[styles.modalContentContainer, modalParentCustomStyles]}
              >
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

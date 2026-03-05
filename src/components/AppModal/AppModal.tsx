import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Pressable,
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
  animationType?: 'none' | 'slide' | 'fade';
  customModalContentStyles?: StyleProp<ViewStyle>;
};

export default function AppModal({
  visible,
  title,
  onClose,
  children,
  modalParentCustomStyles,
  animationType = 'slide',
  customModalContentStyles,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      supportedOrientations={[
        'portrait',
        'landscape',
        'portrait-upside-down',
        'landscape-left',
        'landscape-right',
      ]}
    >
      <View style={styles.backdrop}>
        {/* Backdrop press */}
        <Pressable style={styles.absoluteFill} onPress={onClose} />

        {/* Modal */}
        <View style={[styles.modalContent, customModalContentStyles]}>
          {/* Header */}
          <View style={styles.header}>
            <AppText style={styles.title}>{title}</AppText>

            <TouchableOpacity onPress={onClose}>
              <AppIcon
                name="close"
                type="Ionicons"
                size={iconSizes['md']}
                color={COLORS.lightCream}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContentContainer, modalParentCustomStyles]}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

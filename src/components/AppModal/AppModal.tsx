import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { styles } from './styles';
import AppText from '../AppText/AppText';
import AppIcon from '../AppIcon/AppIcon';
import { iconSizes } from '../../constants/desingSystem';

type AppModalProps<T> = {
  visible: boolean;
  title: string;
  data?: T[];
  onClose: () => void;
  withSearch?: boolean;
  children?: ReactNode;
  onTextChange?: (text: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
};

export default function AppModal<T>({
  visible,
  title,
  data,
  onClose,
  withSearch = false,
  children,
  onTextChange,
  searchValue,
  searchPlaceholder,
}: AppModalProps<T>) {
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
                  />
                </TouchableOpacity>
              </View>

              {/* Search */}
              {withSearch && data && (
                <TextInput
                  style={styles.search}
                  placeholder={searchPlaceholder || 'ابحث...'}
                  value={searchValue}
                  onChangeText={onTextChange}
                />
              )}

              <View style={styles.modalContentContainer}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

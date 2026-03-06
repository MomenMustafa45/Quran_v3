import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import AppIcon from '../../../../components/AppIcon/AppIcon';
import { iconSizes } from '../../../../constants/desingSystem';
import { useAppSelector } from '../../../../store/hooks/storeHooks';

type LandScapeBtnProps = {
  scrollToIndex: (index: number) => void;
  direction: 'next' | 'prev';
};

const LandScapeBtn = ({ scrollToIndex, direction }: LandScapeBtnProps) => {
  const currentPage = useAppSelector(state => state.page.currentPage);

  const onPress = () => {
    const targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    scrollToIndex(targetPage);
  };

  return (
    <TouchableOpacity style={styles.landScapeBtn} onPress={onPress}>
      <AppIcon
        name={direction === 'next' ? 'arrow-left' : 'arrow-right'}
        type="FontAwesome5"
        size={iconSizes.sm}
      />
    </TouchableOpacity>
  );
};

export default LandScapeBtn;

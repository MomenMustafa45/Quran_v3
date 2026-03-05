import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import AppIcon from '../../../../components/AppIcon/AppIcon';
import { iconSizes } from '../../../../constants/desingSystem';

type LandScapeBtnsProps = {
  scrollToPrevPage: () => void;
  scrollToNextPage: () => void;
};

const LandScapeBtns = ({
  scrollToPrevPage,
  scrollToNextPage,
}: LandScapeBtnsProps) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.landScapeBtn, styles.landScapeBtnNext]}
        onPress={scrollToPrevPage}
      >
        <AppIcon name="arrow-right" type="FontAwesome5" size={iconSizes.md} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.landScapeBtn, styles.landScapeBtnPrev]}
        onPress={scrollToNextPage}
      >
        <AppIcon name="arrow-left" type="FontAwesome5" size={iconSizes.md} />
      </TouchableOpacity>
    </>
  );
};

export default LandScapeBtns;

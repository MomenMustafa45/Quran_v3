import React from 'react';
import QuranMenuItem from '../../../../ModalMainItem/ModalMainItem';
import { QuranMenuPageType } from '../../../../../database/types/quranPageData';
import { View } from 'react-native';

type PageItemProps = {
  item: QuranMenuPageType;
  onClickPageHandler: (item: QuranMenuPageType) => void;
};

const PageItem = ({ item, onClickPageHandler }: PageItemProps) => {
  // const [downloadProgress, setDownloadProgress] = useState(0);
  // const [isDownloading, setIsDownloading] = useState(false);

  // const isDownloaded = downloadedPages[item.page_id];
  // const downloadBtnTitle = isDownloaded ? 'تم التحميل' : 'تحميل';
  // const downloadBtnIcon = isDownloaded
  //   ? 'download-done'
  //   : 'download-for-offline';

  // const downloadPageHandler = (pageId: number) => {
  //   if (isDownloading) return; // prevent double-click
  //   setIsDownloading(true);
  //   setDownloadProgress(0);

  //   downloadManager
  //     .add(pageId, p => setDownloadProgress(p / 100)) // note: if you return 0–100, divide by 100 for Progress.Circle
  //     .then(() => {
  //       updateDownloadedPages({ ...downloadedPages, [pageId]: true });
  //     })
  //     .catch(error => {
  //       console.log('🚀 ~ downloadPageHandler ~ error:', error);
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Download failed',
  //         text2: error?.message || 'Something went wrong',
  //       });
  //     })
  //     .finally(() => {
  //       setIsDownloading(false);
  //     });
  // };

  return (
    <View>
      <QuranMenuItem onPress={() => onClickPageHandler(item)}>
        <QuranMenuItem.Page>{item.page_number}</QuranMenuItem.Page>
        <QuranMenuItem.Surah>{item.surah_name}</QuranMenuItem.Surah>
        <QuranMenuItem.Juz>{item.juz_id}</QuranMenuItem.Juz>

        {/* {isDownloading ? (
          <Progress.Circle
            size={30}
            progress={downloadProgress}
            showsText
            color={COLORS.deepGold}
            thickness={3}
            borderWidth={1}
            unfilledColor={COLORS.lightCream}
            textStyle={styles.progressText}
            style={styles.prgoressContainer}
          />
        ) : (
          <AppButton
            title={downloadBtnTitle}
            iconName={downloadBtnIcon}
            iconType="MaterialIcons"
            style={styles.downloadBtn}
            disabled={isDownloaded}
            onPress={() => downloadPageHandler(item.page_id)}
          />
        )} */}
      </QuranMenuItem>
    </View>
  );
};

export default PageItem;

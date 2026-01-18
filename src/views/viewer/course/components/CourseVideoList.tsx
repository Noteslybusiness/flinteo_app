// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ImageBackground,
// } from 'react-native';
// import { PlayCircle } from 'lucide-react-native';
// import { scaleX, scaleY } from '../../../../utils/baseDim';
// import { FONTS } from '../../../../assets/theme/appFonts';

// type VideoListProps = {
//   videos: any[];
//   onVideoPress: (slug: string) => void;
//   theme: any;
// };

// const VideoItem = ({ item, onPress, theme }: { item: any; onPress: () => void; theme: any }) => {
//   const hasThumbnail = item.thumbnail && typeof item.thumbnail === 'string';
//   console.log(item.thumbnail)

//   return (
//     <TouchableOpacity
//       style={[styles.videoItem, { backgroundColor: theme.colors.card }]}
//       onPress={onPress}
//     >
//       {/* Thumbnail / Placeholder */}
//       <View style={styles.thumbnailContainer}>
//         {hasThumbnail ? (
//           <Image
//             source={{ uri: item.thumbnail }}
//             style={styles.thumbnail}
//             resizeMode="cover"
//           />
//         ) : (
//           <View
//             style={styles.thumbnail}
            
//           >
//             <PlayCircle size={28} color="#FFFFFF" style={styles.playOverlay} />
//           </View>
//         )}
//       </View>

//       {/* Title and Meta */}
//       <View style={styles.videoInfo}>
//         <Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
//           {item.title}
//         </Text>
//         <Text style={[styles.videoMeta, { color: theme.colors.textSecondary }]}>
//           {item.duration || 'Video'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const CourseVideoList: React.FC<VideoListProps> = ({ videos, onVideoPress, theme }) => {
//   if (videos.length === 0) {
//     return (
//       <View style={styles.emptyState}>
//         <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
//           No videos available in this course.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
//         Course Videos
//       </Text>

//       {videos.map((video) => (
//         <VideoItem
//           key={video.id?.toString() || video.slug}
//           item={video}
//           onPress={() => onVideoPress(video)}
//           theme={theme}
//         />
//       ))}
//     </>
//   );
// };

// export default CourseVideoList;

// const styles = StyleSheet.create({
//   sectionTitle: {
//     marginHorizontal: scaleX(16),
//     marginTop: scaleY(20),
//     marginBottom: scaleY(10),
//     fontSize: scaleX(16),
//     fontFamily: FONTS.InterSemiBold,
//   },
//   videoItem: {
//     padding: scaleX(8),
//     borderRadius: scaleX(14),
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   thumbnailContainer: {
//     marginRight: scaleX(14),
//   },
//   thumbnail: {
//     width: scaleX(80),
//     height: scaleY(60),
//     borderRadius: scaleX(10),
//     backgroundColor: '#d1d1d1ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playOverlay: {
//     opacity: 0.9,
//   },
//   videoInfo: {
//     flex: 1,
//   },
//   videoTitle: {
//     fontSize: scaleX(15),
//     fontFamily: FONTS.InterMedium,
//     lineHeight: scaleY(20),
//   },
//   videoMeta: {
//     marginTop: scaleY(4),
//     fontSize: scaleX(13),
//     fontFamily: FONTS.InterRegular,
//   },
//   emptyState: {
//     padding: scaleY(40),
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: scaleX(14),
//     fontFamily: FONTS.InterRegular,
//   },
// });




import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play } from 'lucide-react-native';
import { scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';

type VideoListProps = {
  videos: any[];
  onVideoPress: (video: any) => void;
  theme: any;
};

const VideoItem = ({
  item,
  onPress,
  theme,
}: {
  item: any;
  onPress: () => void;
  theme: any;
}) => {
  const hasThumbnail = !!item.thumbnail;

  const formatDuration = (inputSeconds: number | string): string => {
  const totalSeconds = Math.floor(Number(inputSeconds));

  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    // hh:mm:ss
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // mm:ss
  return `${pad(minutes)}:${pad(seconds)}`;
};


  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        { backgroundColor: theme.colors.onPrimary },
      ]}
      onPress={onPress}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        {hasThumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]} />
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.45)']}
          style={styles.gradient}
        />

        {/* Play button */}
        <View style={styles.playButton}>
          <Play size={18} color="#fff" fill="#fff" />
        </View>

        {/* Duration Badge (direct value) */}
        {item.total_duration_sec ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {/* {item.total_duration_sec} */}
              {formatDuration(item.total_duration_sec)}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            { color: theme.colors.text },
          ]}
        >
          {item.title}
        </Text>

        <Text
          style={[
            styles.meta,
            { color: theme.colors.textSecondary },
          ]}
        >
          Tap to watch
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CourseVideoList: React.FC<VideoListProps> = ({
  videos,
  onVideoPress,
  theme,
}) => {
  if (!videos.length) {
    return (
      <View style={styles.emptyState}>
        <Text
          style={[
            styles.emptyText,
            { color: theme.colors.textSecondary },
          ]}
        >
          No videos available in this course
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text },
        ]}
      >
        Course Videos
      </Text>

      {videos.map((video) => (
        <VideoItem
          key={video.id?.toString() || video.slug}
          item={video}
          onPress={() => onVideoPress(video)}
          theme={theme}
        />
      ))}
    </>
  );
};

export default CourseVideoList;


const styles = StyleSheet.create({
  sectionTitle: {
    marginHorizontal: scaleX(16),
    marginBottom: scaleY(12),
    fontSize: scaleX(17),
    fontFamily: FONTS.InterSemiBold,
  },

  card: {
    flexDirection: 'row',
    marginHorizontal: scaleX(16),
    marginBottom: scaleY(14),
    padding: scaleX(10),
    borderRadius: scaleX(16),
    // Clean shadow (no glow)
    // shadowColor: '#000',
    // shadowOpacity: 0.12,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 4 },

    // elevation: 4,
  },

  thumbnailWrapper: {
    width: scaleX(96),
    height: scaleY(64),
    borderRadius: scaleX(12),
    overflow: 'hidden',
    marginRight: scaleX(14),
    backgroundColor: '#eee',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    backgroundColor: '#dcdcdc',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -18 },
      { translateY: -18 },
    ],
    width: scaleX(36),
    height: scaleX(36),
    borderRadius: scaleX(18),
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  durationBadge: {
    position: 'absolute',
    bottom: scaleY(6),
    right: scaleX(6),
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: scaleX(10),
    paddingVertical: scaleY(3),
    borderRadius: scaleX(12),
  },

  durationText: {
    color: '#fff',
    fontSize: scaleX(11),
    fontFamily: FONTS.InterMedium,
    letterSpacing: 0.3,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: scaleX(15),
    fontFamily: FONTS.InterMedium,
    lineHeight: scaleY(21),
    textTransform: 'capitalize',
  },

  meta: {
    marginTop: scaleY(6),
    fontSize: scaleX(12),
    fontFamily: FONTS.InterRegular,
    opacity: 0.7,
  },

  emptyState: {
    padding: scaleY(40),
    alignItems: 'center',
  },

  emptyText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterRegular,
  },
});

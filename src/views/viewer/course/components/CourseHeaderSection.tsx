import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';
import { Clock } from 'lucide-react-native';

type CourseHeaderSectionProps = {
    courseInfo: any;
    theme: any;
};

const CourseHeaderSection: React.FC<CourseHeaderSectionProps> = ({ courseInfo, theme }) => {
    const author = courseInfo?.author;

    return (
        <View>
            {/* Thumbnail */}
            <View style={styles.thumbnailWrapper}>
                {courseInfo.thumbnail ? (
                    <Image source={{ uri: courseInfo.thumbnail }} style={styles.thumbnail} />
                ) : (
                    <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                        <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
                            No Thumbnail
                        </Text>
                    </View>
                )}
            </View>

            {/* Info Card */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {courseInfo.title}
                </Text>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: courseInfo.status === 2 ? '#DCFCE7' : '#FEF3C7',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: courseInfo.status === 2 ? '#15803D' : '#B45309' },
                        ]}
                    >
                        {courseInfo.status === 2 ? 'Published' : 'Draft'}
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                    Description
                </Text>

                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    {courseInfo.description?.trim() || 'No description provided.'}
                </Text>

                {/* Duration */}
                <View style={styles.durationContainer}>
                    <Clock
                        width={scaleX(16)}
                        height={scaleY(16)}
                        color={theme.colors.grayField}
                    />
                    <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
                        {'2h 30m'}
                    </Text>
                </View>

                {/* Author Profile */}
                {author && (
                    <View style={styles.authorContainer}>
                        {author.profile_image ? (
                            <Image
                                source={{ uri: author.profile_image }}
                                style={styles.authorImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.authorImage,
                                    styles.authorImagePlaceholder,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.authorInitial,
                                        { color: theme.colors.textWhite },
                                    ]}
                                >
                                    {author.name?.charAt(0)}
                                </Text>
                            </View>
                        )}

                        <View style={styles.authorInfo}>
                            <Text
                                style={[
                                    styles.authorName,
                                    { color: theme.colors.surfaceText },
                                ]}
                            >
                                {author.name}
                            </Text>
                            <Text
                                style={[
                                    styles.authorRole,
                                    { color: theme.colors.textSecondary },
                                ]}
                            >
                                {author.role_name}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default CourseHeaderSection;


const styles = StyleSheet.create({
    thumbnailWrapper: {
        height: scaleY(180),
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    thumbnailPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
    },
    placeholderText: {
        fontFamily: FONTS.InterMedium,
        fontSize: scaleX(16),
    },
    infoCard: {
        marginHorizontal: scaleX(8),
        marginVertical: scaleX(6),
        padding: scaleX(12),
        borderRadius: scaleX(14),
        backgroundColor: '#FFFFFF'
    },
    title: {
        fontSize: scaleX(20),
        fontFamily: FONTS.InterBold
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: scaleX(12),
        paddingVertical: scaleY(6),
        borderRadius: scaleX(8),
        marginTop: scaleY(8),
    },
    statusText: {
        fontSize: scaleX(13),
        fontFamily: FONTS.InterMedium,
    },
    sectionTitle: {
        marginTop: scaleY(8),
        fontSize: scaleX(15),
        fontFamily: FONTS.InterSemiBold,
    },
    description: {
        marginTop: scaleY(8),
        fontSize: scaleX(14),
        fontFamily: FONTS.InterRegular,
        lineHeight: scaleY(22),
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: "center",
        columnGap: scaleX(8),
        marginTop: scaleY(12),
    },
    duration: {
        fontSize: scaleX(12),
        fontFamily: FONTS.InterRegular,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scaleY(18),
        columnGap: scaleX(12),
    },

    authorImage: {
        width: scaleX(44),
        height: scaleX(44),
        borderRadius: scaleX(22),
        resizeMode: 'cover',
    },

    authorImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
    },

    authorInitial: {
        fontFamily: FONTS.InterSemiBold,
        fontSize: scaleX(16),
    },

    authorInfo: {
        flex: 1,
    },

    authorName: {
        fontFamily: FONTS.InterMedium,
        fontSize: scaleX(14),
    },

    authorRole: {
        marginTop: scaleY(2),
        fontFamily: FONTS.InterRegular,
        fontSize: scaleX(12),
    },

});
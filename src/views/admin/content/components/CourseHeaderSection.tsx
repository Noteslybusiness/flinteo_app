import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';

type CourseHeaderSectionProps = {
    courseInfo: any;
    theme: any;
};

const CourseHeaderSection: React.FC<CourseHeaderSectionProps> = ({ courseInfo, theme }) => {
    return (
        <>
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
            <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
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

                <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>
                    Description
                </Text>
                <Text style={[styles.description, { color: theme.colors.surfaceText }]}>
                    {courseInfo.description?.trim() || 'No description provided.'}
                </Text>
            </View>
        </>
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
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5
    },
    title: {
        fontSize: scaleX(20),
        fontFamily: FONTS.InterBold,
        marginBottom: scaleY(8),
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: scaleX(12),
        paddingVertical: scaleY(6),
        borderRadius: scaleX(20),
        marginTop: scaleY(8),
    },
    statusText: {
        fontSize: scaleX(13),
        fontFamily: FONTS.InterMedium,
    },
    sectionTitle: {
        marginTop: scaleY(20),
        fontSize: scaleX(15),
        fontFamily: FONTS.InterSemiBold,
    },
    description: {
        marginTop: scaleY(8),
        fontSize: scaleX(14),
        fontFamily: FONTS.InterRegular,
        lineHeight: scaleY(22),
    },
});
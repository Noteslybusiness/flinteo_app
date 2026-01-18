import { DimensionValue, Dimensions, PixelRatio, Platform } from "react-native";


type MatrixStyle = {
    DIM_100:DimensionValue,
    DIM_95:DimensionValue,
    DIM_90:DimensionValue,
    DIM_85:DimensionValue,
    DIM_80:DimensionValue,
    DIM_75:DimensionValue,
    DIM_70:DimensionValue,
    DIM_65:DimensionValue,
    DIM_60:DimensionValue,
    DIM_55:DimensionValue,
    DIM_50:DimensionValue,
    DIM_45:DimensionValue,
    DIM_40:DimensionValue,
    DIM_35:DimensionValue,
    DIM_30:DimensionValue,
    DIM_25:DimensionValue,
    DIM_20:DimensionValue,
    DIM_15:DimensionValue,
    DIM_10:DimensionValue,
}

export const Matrix: MatrixStyle = {
    DIM_100: '100%',
    DIM_95: '95%',
    DIM_90: '90%',
    DIM_85: '85%',
    DIM_80: '80%',
    DIM_75: '75%',
    DIM_70: '70%',
    DIM_65: '65%',
    DIM_60: '60%',
    DIM_55: '55%',
    DIM_50: '50%',
    DIM_45: '45%',
    DIM_40: '40%',
    DIM_35: '35%',
    DIM_30: '30%',
    DIM_25: '25%',
    DIM_20: '20%',
    DIM_15: '15%',
    DIM_10: '10%',
}

export const SCREEN = {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height
}

const scaleXorizontal = SCREEN.WIDTH / 375
const scaleYertical = SCREEN.HEIGHT / 812

export const scaleX = (size:any) => {
    const newSize = size * scaleXorizontal
    if(Platform.OS === 'ios')
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    else
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
}

export const scaleY = (size:any) => {
    const newSize = size * scaleYertical
    if(Platform.OS === 'ios')
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    else
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
}

export const isScreenHeight770 = () => SCREEN.HEIGHT > 770

export const VIEWER_BAR_HEIGHT = SCREEN.HEIGHT/20 + 20
export const VIDEO_VIEWPORT_HEIGHT = SCREEN.HEIGHT - VIEWER_BAR_HEIGHT
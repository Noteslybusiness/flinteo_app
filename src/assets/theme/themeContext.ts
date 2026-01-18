import { createContext } from "react"

interface ThemeColors {
	primary: string
	primaryVarient: string
	surfaceTint: string
	onPrimary: string
	primaryContainer: string
	onPrimaryContainer: string
	secondary: string
	onSecondary: string
	secondaryContainer: string
	onSecondaryContainer: string
	tertiary: string
	onTertiary: string
	tertiaryContainer: string
	onTertiaryContainer: string
	error: string
	onError: string
	errorContainer: string
	onErrorContainer: string
	background: string
	onBackground: string
	surface: string
	onSurface: string
	surfaceVariant: string
	onSurfaceVariant: string
	outline: string
	outlineVariant: string
	shadow: string
	scrim: string
	inverseSurface: string
	inverseOnSurface: string
	inversePrimary: string
	primaryFixed: string
	onPrimaryFixed: string
	primaryFixedDim: string
	onPrimaryFixedVariant: string
	secondaryFixed: string
	onSecondaryFixed: string
	secondaryFixedDim: string
	onSecondaryFixedVariant: string
	tertiaryFixed: string
	onTertiaryFixed: string
	tertiaryFixedDim: string
	onTertiaryFixedVariant: string
	surfaceDim: string
	surfaceBright: string
	surfaceContainerLowest: string
	surfaceContainerLow: string
	surfaceContainer: string
	surfaceContainerHigh: string
	surfaceContainerHighest: string
	inputPlaceHolder: string
	text: string
	textBlack: string
	whiteColor: string
	surfaceText: string
	grayField: string
	border: string
}

export const LightTheme: ThemeColors = {
	primary: "#2563EB",              // Indigo Blue
	primaryVarient: "#1D4ED8",
	surfaceTint: "#2563EB",
	onPrimary: "#FFFFFF",
	primaryContainer: "#DBEAFE",
	onPrimaryContainer: "#1E3A8A",

	secondary: "#06B6D4",            // Cyan
	onSecondary: "#FFFFFF",
	secondaryContainer: "#CFFAFE",
	onSecondaryContainer: "#083344",

	tertiary: "#10B981",             // Emerald
	onTertiary: "#FFFFFF",
	tertiaryContainer: "#D1FAE5",
	onTertiaryContainer: "#064E3B",

	error: "#DC2626",
	onError: "#FFFFFF",
	errorContainer: "#FEE2E2",
	onErrorContainer: "#450A0A",

	background: "#F8FAFC",           // Cool light background
	onBackground: "#0F172A",
	surface: "#FFFFFF",
	onSurface: "#0F172A",
	surfaceVariant: "#E5E7EB",
	onSurfaceVariant: "#475569",

	outline: "#CBD5E1",
	outlineVariant: "#E2E8F0",
	shadow: "rgba(15, 23, 42, 0.15)",
	scrim: "rgba(15, 23, 42, 0.45)",

	inverseSurface: "#0F172A",
	inverseOnSurface: "#F8FAFC",
	inversePrimary: "#60A5FA",

	primaryFixed: "#DBEAFE",
	onPrimaryFixed: "#1E3A8A",
	primaryFixedDim: "#BFDBFE",
	onPrimaryFixedVariant: "#1D4ED8",

	secondaryFixed: "#CFFAFE",
	onSecondaryFixed: "#083344",
	secondaryFixedDim: "#67E8F9",
	onSecondaryFixedVariant: "#0891B2",

	tertiaryFixed: "#D1FAE5",
	onTertiaryFixed: "#064E3B",
	tertiaryFixedDim: "#6EE7B7",
	onTertiaryFixedVariant: "#047857",

	surfaceDim: "#E2E8F0",
	surfaceBright: "#FFFFFF",
	surfaceContainerLowest: "#FFFFFF",
	surfaceContainerLow: "#F8FAFC",
	surfaceContainer: "#F1F5F9",
	surfaceContainerHigh: "#E2E8F0",
	surfaceContainerHighest: "#CBD5E1",

	inputPlaceHolder: "#64748B",
	text: "#0F172A",
	textBlack: "#000000",
	whiteColor: "#FFFFFF",
	surfaceText: "#0F172A",
	grayField: "rgba(15, 23, 42, 0.45)",
	border: "#E2E8F0"
}

export const DarkTheme: ThemeColors = {
	primary: "#60A5FA",              // Soft Indigo
	primaryVarient: "#3B82F6",
	surfaceTint: "#60A5FA",
	onPrimary: "#0F172A",
	primaryContainer: "#1E3A8A",
	onPrimaryContainer: "#DBEAFE",

	secondary: "#22D3EE",
	onSecondary: "#083344",
	secondaryContainer: "#164E63",
	onSecondaryContainer: "#CFFAFE",

	tertiary: "#34D399",
	onTertiary: "#064E3B",
	tertiaryContainer: "#065F46",
	onTertiaryContainer: "#D1FAE5",

	error: "#FCA5A5",
	onError: "#450A0A",
	errorContainer: "#7F1D1D",
	onErrorContainer: "#FEE2E2",

	background: "#020617",           // Deep navy
	onBackground: "#E5E7EB",
	surface: "#020617",
	onSurface: "#E5E7EB",
	surfaceVariant: "#020617",
	onSurfaceVariant: "#94A3B8",

	outline: "#475569",
	outlineVariant: "#1E293B",
	shadow: "rgba(0, 0, 0, 0.85)",
	scrim: "rgba(0, 0, 0, 0.9)",

	inverseSurface: "#E5E7EB",
	inverseOnSurface: "#020617",
	inversePrimary: "#2563EB",

	primaryFixed: "#DBEAFE",
	onPrimaryFixed: "#1E3A8A",
	primaryFixedDim: "#BFDBFE",
	onPrimaryFixedVariant: "#1D4ED8",

	secondaryFixed: "#CFFAFE",
	onSecondaryFixed: "#083344",
	secondaryFixedDim: "#67E8F9",
	onSecondaryFixedVariant: "#0891B2",

	tertiaryFixed: "#D1FAE5",
	onTertiaryFixed: "#064E3B",
	tertiaryFixedDim: "#6EE7B7",
	onTertiaryFixedVariant: "#047857",

	surfaceDim: "#020617",
	surfaceBright: "#020617",
	surfaceContainerLowest: "#020617",
	surfaceContainerLow: "#020617",
	surfaceContainer: "#020617",
	surfaceContainerHigh: "#020617",
	surfaceContainerHighest: "#020617",

	inputPlaceHolder: "#94A3B8",
	text: "#E5E7EB",
	textBlack: "#000000",
	whiteColor: "#FFFFFF",
	surfaceText: "#E5E7EB",
	grayField: "rgba(229, 231, 235, 0.5)",
	border: "#1E293B"
}


export interface AppTheme {
	isDarkMode: boolean
	colors: ThemeColors
}

export const ThemeContext = createContext<AppTheme>({
	isDarkMode: false,
	colors: LightTheme
})

export const THEME_COLORS = LightTheme
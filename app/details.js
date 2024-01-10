import { useState, useEffect, useCallback } from 'react'
import {
    View,
    ScrollView,
    SafeAreaView,
    Text,
    ActivityIndicator,
    Image,
    RefreshControl,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';


import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn } from '../components';

const Details = () => {
    const params = useLocalSearchParams();
    const { baseString, cropImage } = params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState("")
    const [refreshing, setRefreshing] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState("english")
    const [hindiL, setHindiL] = useState("");

    useEffect(() => {
        postData()
    }, [])

    // Optional, if the data is not fetched at first it will try again
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        postData();
        setRefreshing(false);
    }, [])

    // API REQUEST
    const postData = async () => {
        setLoading(true);
        const url = 'https://susya.onrender.com';

        try {
            const response = await axios.post(url, {
                image: baseString,
            });

            setData(response.data)
            // Handle the response data as needed
        } catch (error) {
            // By default if server doesn't respond
            // alert("Error: " + error)
            setData(
                {
                    disease: "Septoria leaf spot",
                    plant: "Tomato",
                    remedy: "To remedy Septoria leaf spot in tomato plants, a combination of cultural practices and, if necessary, chemical controls can be employed. Start by practicing good sanitation by removing and disposing of infected leaves. This helps prevent further spread. Ensure proper spacing between plants for adequate air circulation, and water at the base to minimize splashing. \n\nThis is default remedy (Server isn't responding)"
                }
            )
            // Handle errors here
        } finally {
            setLoading(false);
        }
    };

    // Language Translation
    const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/translation/automatic_translation",
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWI4ZWVmYWUtZTg4ZS00MDIxLWFhNjItYjE5MTM1YjQwMzk0IiwidHlwZSI6ImFwaV90b2tlbiJ9.aTqPpqgzQ4V6NIbm0NNg2f2hrAoBnlSqOL4plcnBTec",
        },
        data: {
            show_original_response: false,
            fallback_providers: "",
            providers: "amazon",
            text: data.remedy,
            source_language: "en",
            target_language: "hi",
        },
    };

    // Translation REQUEST
    const postTranslate = () => {

        if (hindiL == "") {

            axios
                .request(options)
                .then((response) => {
                    setHindiL(response.data.amazon);
                })
                .catch((error) => {
                    alert("Error: " + error)
                });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.lightWhite,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn iconUrl={icons.agrodocLogo} dimension="100%" wid={140} />
                    ),
                    headerTitle: "",
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } >
                <View style={{ flex: 1, padding: SIZES.medium }}>
                    {loading ? (
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, height: 650 }}>
                            <Text style={{ fontFamily: FONT.medium, color: COLORS.gray }}>Analyzing your image...</Text>
                            <ActivityIndicator color={COLORS.primary} size={SIZES.xxLarge} style={{}} />
                        </View>
                    ) : (
                        <View>
                            <View style={{ flex: 1, }}>
                                <Image source={{ uri: cropImage }} style={{ width: 200, height: 200, marginVertical: 10 }} />
                            </View>
                            <View style={styles.languageStyle}>
                                <TouchableOpacity onPress={() => setSelectedLanguage("english")}>
                                    <Text style={styles.languageTextStyleE(selectedLanguage)}>English</Text>
                                </TouchableOpacity>
                                <Text style={styles.barStyle}> | </Text>
                                <TouchableOpacity onPress={() => {
                                    setSelectedLanguage("hindi");
                                    postTranslate();
                                }}>
                                    <Text style={styles.languageTextStyleH(selectedLanguage)}>&nbsp; हिंदी</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: "column", }}>
                                <View style={styles.headVStyle}>
                                    <Text style={styles.headTextStyle}>Plant - </Text>
                                    <Text style={styles.mainTextStyle}>{data.plant}</Text>
                                </View>
                                <View style={styles.headVStyle}>
                                    <Text style={styles.headTextStyle}>Disease - </Text>
                                    <Text style={styles.mainTextStyle}>{data.disease}</Text>
                                </View>
                            </View>
                            {selectedLanguage === "hindi" && hindiL ? (
                                <View style={styles.mainDStyle}>
                                    <Text style={styles.headTextStyle}>इलाज</Text>
                                    <Text style={styles.mainTextStyle2}>{hindiL.text}</Text>
                                </View>
                            ) : (
                                <View style={styles.mainDStyle}>
                                    <Text style={styles.headTextStyle}>Remedy</Text>
                                    <Text style={styles.mainTextStyle2}>{data.remedy}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    barStyle: {
        fontSize: SIZES.large * 1.3,
    },
    languageStyle: {
        fontFamily: FONT.medium,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 10,
    },
    languageTextStyleE: (selLang) => ({
        fontFamily: FONT.medium,
        fontSize: 18,
        color: selLang === "english" ? COLORS.tertiary : COLORS.gray,
        paddingRight: 15,
    }),
    languageTextStyleH: (selLang) => ({
        fontFamily: FONT.medium,
        fontSize: 18,
        color: selLang === "hindi" ? COLORS.tertiary : COLORS.gray,
        paddingRight: 15,
    }),
    headTextStyle: {
        fontFamily: FONT.regular,
        fontSize: 18,
        color: COLORS.gray,
        marginBottom: 10,
    },
    headVStyle: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    mainDStyle: {
        padding: 15,
        marginVertical: 25,
        backgroundColor: "#F5F5F5",
        borderRadius: SIZES.medium,
        elevation: 1,
    },
    mainTextStyle: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLORS.black,
        lineHeight: 23,
        textDecorationLine: "underline",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    mainTextStyle2: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLORS.black,
        lineHeight: 23,
    }
})


export default Details;
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { imageAnalysisModel } from '@/lib/sentimentService';

export default function HomeScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [question, setQuestion] = useState('');
    const [isAsking, setIsAsking] = useState(false);
    const [followUpResult, setFollowUpResult] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            console.log('Launching image picker...');
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            console.log('Image picker result:', result);

            if (!result.canceled && result.assets[0].base64) {
                setImage(result.assets[0].uri);
                console.log('Starting image analysis...');
                await analyzeImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Error picking image. Please try again.');
        }
    };

    const analyzeImage = async (base64Image: string) => {
        try {
            setLoading(true);
            const result = await imageAnalysisModel(base64Image,"请识别这张图片中手相或面相并给出分析结果");
            console.log('Parsed result:', result);
            setResult(JSON.parse(result));
        } catch (error: any) {
            console.error('Error analyzing image:', error);
            let errorMessage = 'Error analyzing image. Please try again.';

            if (error.response) {
                console.error('API Error Response:', error.response.data);
                errorMessage = `API Error: ${error.response.data?.error?.message || error.response.statusText}`;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const askFollowUpQuestion = async (base64Image: string) => {
        if (!question.trim() || !result) return;
        
        try {
            setIsAsking(true);
            // 这里需要调用你的API进行追问
            const response = await imageAnalysisModel(base64Image,question);
            setFollowUpResult(response);
            setQuestion('');
        } catch (error) {
            console.error('Error asking follow-up question:', error);
            alert('提问失败，请重试');
        } finally {
            setIsAsking(false);
        }
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.title}>
                <ThemedText type="title">算命大师</ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <ThemedText style={styles.buttonText}>选择图片</ThemedText>
                </TouchableOpacity>

                {image && (
                    <Image source={{ uri: image }} style={styles.image} />
                )}

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <ThemedText style={styles.loadingText}>正在分析图片...</ThemedText>
                    </View>
                )}

                {result && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await analyzeImage(image!);
                        }}>
                            <ThemedText style={styles.buttonText}>重新生成</ThemedText>
                        </TouchableOpacity>

                        <ThemedView style={styles.resultContainer}>
                            <ThemedText type="subtitle">识别结果：</ThemedText>
                            <ThemedText style={styles.resultText}>
                                {"掌型"}:{result.掌型}{'\n'}
                                {"生命线"}:{result.生命线}{'\n'}
                                {"智慧线"}:{result.智慧线}{'\n'}
                                {"感情线"}:{result.感情线}{'\n'}
                                {"事业线"}:{result.事业线}{'\n'}
                                {"指型"}:{result.指型}{'\n'}
                                {"特殊纹"}:{result.特殊纹}{'\n'}
                                {"评价"}:{result.评价+"(仅供参考)"}{'\n'}
                                {"得分"}: {result.得分}{'\n'}
                                
                            </ThemedText>

                            <View style={styles.followUpContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="有什么想问的？"
                                    value={question}
                                    onChangeText={setQuestion}
                                    multiline
                                />
                                <TouchableOpacity 
                                    style={[styles.followUpButton, !question.trim() && styles.disabledButton]} 
                                    onPress={() => askFollowUpQuestion(image!)}
                                    disabled={!question.trim() || isAsking}
                                >
                                    <ThemedText style={styles.buttonText}>
                                        {isAsking ? '提问中...' : '追问'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>

                            {followUpResult && (
                                <ThemedView style={styles.followUpResult}>
                                    <ThemedText type="subtitle">追问回答：</ThemedText>
                                    <ThemedText style={styles.resultText}>{followUpResult}</ThemedText>
                                </ThemedView>
                            )}
                        </ThemedView>
                    </>
                )}
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    title: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        flex: 1,
        padding: 16,
        gap: 16,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    image: {
        width: 320,
        height: 320,
        borderRadius: 16,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loadingContainer: {
        marginVertical: 24,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    resultContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
        marginTop: 12,
    },
    followUpContainer: {
        marginTop: 20,
        width: '100%',
        gap: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    followUpButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    followUpResult: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});



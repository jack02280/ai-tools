import { wordsAnalysisModel } from '@/lib/sentimentService';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SoundAnalysisScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pickSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const { uri } = result.assets[0];
      setSoundUri(uri);
      
      // 加载音频文件
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error picking sound:', error);
      setError('选择音频文件失败，请重试');
    }
  };

  const playSound = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('播放音频失败，请重试');
    }
  };

  const analyzeSound = async () => {
    if (!soundUri) {
      setError('请先选择音频文件');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await wordsAnalysisModel(soundUri);
      setResult(response);
    } catch (error) {
      console.error('Error analyzing sound:', error);
      setError('音频分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件卸载时清理音频资源
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>语音转文字</Text>
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={pickSound}
          disabled={loading}
        >
          <Text style={styles.buttonText}>选择音频文件</Text>
        </TouchableOpacity>

        {soundUri && (
          <View style={styles.previewContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.playButton, loading && styles.disabledButton]} 
              onPress={playSound}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? '暂停' : '播放'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {soundUri && (
          <TouchableOpacity 
            style={[styles.button, styles.analyzeButton, loading && styles.disabledButton]} 
            onPress={analyzeSound}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>开始转写</Text>
            )}
          </TouchableOpacity>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
        
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>转写结果：</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
      </View>
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
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  analyzeButton: {
    backgroundColor: '#5856D6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

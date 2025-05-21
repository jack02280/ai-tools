import { articleAnalysisModel } from '@/lib/sentimentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AnalysisResult {
  文章结构: string;
  时间: string;
  人物: string;
  事件: string;
  得分: string;
}

interface HistoryItem {
  id: string;
  date: string;
  article: string;
  result: AnalysisResult;
}

const GRADE_OPTIONS = [
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '初一', '初二', '初三',
  '高一', '高二', '高三',
  '大一', '大二', '大三', '大四'
];

export default function ArticleAnalysis() {
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  useEffect(() => {
    loadHistory();
    loadGrade();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('analysisHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  };

  const loadGrade = async () => {
    try {
      const savedGrade = await AsyncStorage.getItem('grade');
      if (savedGrade) {
        setSelectedGrade(savedGrade);
      }
    } catch (error) {
      console.error('加载年级设置失败:', error);
    }
  };

  const saveToHistory = async (analysisResult: AnalysisResult) => {
    try {
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        article,
        result: analysisResult,
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      await AsyncStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      Alert.alert('成功', '分析结果已保存');
      window.location.reload();
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const saveGrade = async (grade: string) => {
    try {
      await AsyncStorage.setItem('grade', grade);
      setSelectedGrade(grade);
      Alert.alert('成功', '年级设置已保存');
    } catch (error) {
      console.error('保存年级设置失败:', error);
      Alert.alert('错误', '保存设置失败，请重试');
    }
  };

  const handleAnalysis = async () => {
    if (!article.trim()) {
      alert('请输入文章内容');
      return;
    }

    setLoading(true);
    try {
      const analysis = await articleAnalysisModel(article,selectedGrade);
      const parsedResult = JSON.parse(analysis);
      setResult(parsedResult);
    } catch (error) {
      alert('分析失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('analysisHistory');
      setHistory([]);
      Alert.alert('成功', '历史记录已清空');
    } catch (error) {
      console.error('清空历史记录失败:', error);
      Alert.alert('错误', '清空历史记录失败');
    }
  };

  const handleHistoryItemPress = (item: HistoryItem) => {
    setSelectedHistory(item);
    setShowDetail(true);
  };

  const renderDetailModal = () => (
    <Modal
      visible={showDetail}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDetail(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>历史记录详情</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetail(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
          
          {selectedHistory && (
            <ScrollView style={styles.modalScroll}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>分析时间：</Text>
                <Text style={styles.detailText}>{selectedHistory.date}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>原文内容：</Text>
                <Text style={styles.detailText}>{selectedHistory.article}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>分析结果：</Text>
                <View style={styles.resultForm}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>文章结构：</Text>
                    <Text style={styles.formValue}>{selectedHistory.result.文章结构}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>时间：</Text>
                    <Text style={styles.formValue}>{selectedHistory.result.时间}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>人物：</Text>
                    <Text style={styles.formValue}>{selectedHistory.result.人物}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>事件：</Text>
                    <Text style={styles.formValue}>{selectedHistory.result.事件}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>得分：</Text>
                    <Text style={styles.formValue}>{selectedHistory.result.得分}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>设置</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>选择年级</Text>
              <View style={styles.gradeGrid}>
                {GRADE_OPTIONS.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.gradeButton,
                      selectedGrade === grade && styles.selectedGradeButton,
                    ]}
                    onPress={() => saveGrade(grade)}
                  >
                    <Text
                      style={[
                        styles.gradeButtonText,
                        selectedGrade === grade && styles.selectedGradeButtonText,
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>文章分析</Text>
        <Text style={styles.subtitle}>智能提取文章中的关键信息</Text>
        {selectedGrade && (
          <Text style={styles.gradeText}>当前年级：{selectedGrade}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, showHistory && styles.activeButton]}
          onPress={() => setShowHistory(!showHistory)}
        >
          <Text style={styles.secondaryButtonText}>
            {showHistory ? '返回分析' : '查看历史'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.secondaryButtonText}>设置</Text>
        </TouchableOpacity>
        {showHistory && (
          <TouchableOpacity style={styles.secondaryButton} onPress={clearHistory}>
            <Text style={styles.secondaryButtonText}>清空历史</Text>
          </TouchableOpacity>
        )}
      </View>

      {!showHistory ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={6}
              placeholder="请输入要分析的文章内容..."
              value={article}
              onChangeText={setArticle}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleAnalysis}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>开始分析</Text>
              )}
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.formContainer}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>文章结构：</Text>
                  <Text style={styles.formValue}>{result.文章结构}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>时间：</Text>
                  <Text style={styles.formValue}>{result.时间}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>人物：</Text>
                  <Text style={styles.formValue}>{result.人物}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>事件：</Text>
                  <Text style={styles.formValue}>{result.事件}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>得分：</Text>
                  <Text style={styles.formValue}>{result.得分+"(仅供参考学习)"}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => saveToHistory(result)}
              >
                <Text style={styles.saveButtonText}>保存结果</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.historyContainer}>
          {history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => handleHistoryItemPress(item)}
            >
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyArticle} numberOfLines={2}>
                {item.article}
              </Text>
              <View style={styles.historyResult}>
                <Text style={styles.historyResultText}>
                  得分：{item.result.得分}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {history.length === 0 && (
            <Text style={styles.noHistory}>暂无历史记录</Text>
          )}
        </View>
      )}
      {renderDetailModal()}
      {renderSettingsModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formLabel: {
    width: 80,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  formValue: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  historyArticle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  historyResult: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
  },
  historyResultText: {
    fontSize: 14,
    color: '#666',
  },
  noHistory: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  resultForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  gradeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedGradeButton: {
    backgroundColor: '#007AFF',
  },
  gradeButtonText: {
    color: '#333',
    fontSize: 14,
  },
  selectedGradeButtonText: {
    color: '#fff',
  },
});

export const screenOptions = {
  title: '文章分析',
};

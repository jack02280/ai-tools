import { wordsAnalysisModel } from '@/lib/sentimentService';
import { useState } from 'react';

export default function SentimentScreen() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('请输入一些文字');
      return;
    }

    setLoading(true);
    setError(null);
    try {
       const response = await wordsAnalysisModel(text);
       setResult(JSON.parse(response));
    } catch (err) {
      console.log(err);
      setError('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>情绪分析</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="请输入一句话..."
        multiline
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>分析情绪</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result.情绪状态}</Text>
          <Text style={styles.scoreText}>情绪得分: {result.情绪得分}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
}); 
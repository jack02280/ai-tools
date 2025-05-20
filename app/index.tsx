import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>AI 助手</Text>
          <Text style={styles.subtitle}>智能分析，轻松生活</Text>
        </View>

        <View style={styles.features}>
          <Link href="/Ai/wordsAnalysis" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>😊</Text>
              </View>
              <Text style={styles.featureTitle}>情绪分析</Text>
              <Text style={styles.featureDescription}>
                输入一句话，AI帮你分析情绪状态
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/Ai/imageAnalysis" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>🔮</Text>
              </View>
              <Text style={styles.featureTitle}>算命大师</Text>
              <Text style={styles.featureDescription}>
                输入手相，AI帮你算命
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/Ai/soundAnalysis" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>🖼️</Text>
              </View>
              <Text style={styles.featureTitle}>文字转图</Text>
              <Text style={styles.featureDescription}>
                输入文字，AI帮你生成图片
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>更多功能开发中...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  features: {
    flex: 1,
    gap: 20,
    paddingVertical: 10,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconText: {
    fontSize: 30,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
}); 
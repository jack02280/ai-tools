'use client';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { toImageAnalysisModel } from '@/lib/sentimentService';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface ImageResponse {
  b64_json: string;
}

export default function ToImageAnalysis() {
  const [prompt, setPrompt] = useState('');
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setLoading(true);
    try {
      const result = await toImageAnalysisModel(prompt);

      if (result ) {
        setImageData(`data:image/png;base64,${result}`);
      }else{
        setImageData('生成失败');
      }
      console.log("完成图片定义");
      console.log(imageData);

    } catch (error) {
      console.error('生成图片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">AI 文字生成图片</h1>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Textarea
                placeholder="请输入图片描述..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>生成中...</span>
                </div>
              ) : (
                '生成图片'
              )}
            </Button>

            {imageData !==''? (
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-4">
                  <img 
                    width={200}
                    height={200}
                    src={imageData} 
                    alt="生成的图片" 
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            ):(
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">请输入图片描述</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">正在生成图片，请稍候...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

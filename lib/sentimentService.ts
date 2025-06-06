import OpenAI from 'openai';

export const wordsAnalysisModel = async (content: string): Promise<string> => {

  const systemMessage = `
    你是一个专业的情绪分析专家，请根据用户输入的文字，分析用户的情绪状态，并给出相应的分析结果。
    结果以JSON格式返回，格式如下：
    {
      "情绪状态": "用户情绪状态(例如:积极，消极，愤怒，悲伤，快乐，焦虑，平静，兴奋，沮丧，失望，希望，绝望，等等)",
      "情绪得分": "用户情绪分析得分(0-100)(0为消极，100为积极)"
    }
    `;

  // // 创建消息数组


  const openai = new OpenAI({
    apiKey: "eb2ae97c-cae5-49a0-bee0-0383be29f7c4",
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: content },
    ],
    model: 'ep-20250517175804-nb4dk',
  });

  const result = completion.choices[0]?.message?.content;
  console.log(result);
  return result!;

}

export const imageAnalysisModel = async (content: string,question:string): Promise<string> => {
  const systemMessage = `
  如果用户输入的并不是'请识别这张图片中手相或面相并给出分析结果'，请根据用户输入的追问，给出相应的分析结果,并不是json格式。  
  你是一个专业的中国算命大师。请分析图片中的手相特征：掌型[方形掌/火型掌]、生命线[深长/断续/分叉]、智慧线[平直/锁链状/岛纹]、感情线[双叉/波浪形]、事业线[清晰/模糊/偏斜]，需结合指型（食指[长于无名指/过短]、小指[弯曲/端正]）、特殊纹（[三角纹/十字纹]位置），论断健康运/职业运/感情波折.
  结果以JSON格式返回，格式如下：
  {
    "掌型": "木型掌",
    "生命线": "深长无杂纹",
    "智慧线": "平直过掌",
    "感情线": "末端分叉",
    "事业线": "从坎宫升起",
    "指型": "食指长于无名指",
    "特殊纹": "掌心三角纹",
    "评价" : "你的事业线清晰，说明你是一个有事业心的人，你的感情线末端分叉，说明你是一个多情的人，你的生命线深长无杂纹，说明你是一个健康的人，你的智慧线平直过掌，说明你是一个聪明的人，你的财运线清晰，说明你是一个财运好的人"
    "得分": "你的得分是(0-100)分(仅供参考)"
  }
  如果用户输入的并不是'请识别这张图片中手相或面相并给出分析结果'，请根据用户输入的追问，给出相应的分析结果,并不是json格式。  
    `;
  const openai = new OpenAI({
    apiKey: "eb2ae97c-cae5-49a0-bee0-0383be29f7c4",
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    dangerouslyAllowBrowser: true,
  });
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemMessage,
      },
      {
        role: 'user',
        content: [
          {
            type: "text",
            text: question
          },
          {
            type: "image_url",
            image_url: {
              url: content,
              detail: "high",
            },
          },
        ],
      },
    ],
    model: 'ep-20250517113822-525f5',
  });
  console.log(response.choices[0]);
  return response.choices[0].message.content!;
}
export const soundAnalysisModel = async (content: string): Promise<string> => {
  const systemMessage = `
  你是一个专业的语言转写专家，请将用户输入的音频文件转换为文字。
  结果以JSON格式返回，格式如下：
  {
    "文字": "用户输入的音频文件转换为文字"
  }
  `;
  return "你好";
}
    

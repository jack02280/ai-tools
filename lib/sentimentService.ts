// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatOpenAI } from "@langchain/openai";
// export const verifyReceiptModel = async (base64urlString: string): Promise<string> => {

//     const systemMessage = `
//     你是一个专业的情绪分析专家，请根据用户输入的文字，分析用户的情绪状态，并给出相应的分析结果。
//     结果以JSON格式返回，格式如下：
//     {
//       "情绪状态": "用户情绪状态(例如:积极，消极，愤怒，悲伤，快乐，焦虑，平静，兴奋，沮丧，失望，希望，绝望，等等)",
//       "情绪得分": "用户情绪分析得分(0-100)(0为消极，100为积极)"
//     }
//     `;
//     // 创建消息数组
//     const messages = [
//       new SystemMessage(systemMessage),
//       new HumanMessage({
//         content: [
//           {
//             type: "text",
//             text: base64urlString+'请分析用户输入的文字，并给出相应的分析结果',
//           },
//         ],
//       }),
//     ];
//     console.log(process.env.EXPO_PUBLIC_OPENAI_API_KEY);
//     console.log(process.env.EXPO_PUBLIC_AI_MODEL_NAME);
//     console.log(process.env.EXPO_PUBLIC_AI_BASE_URL);
  
//     // 使用OpenAI解析发票信息
//     // 创建 ChatOpenAI 实例，使用GPT-4-Vision
//     const chatModel = new ChatOpenAI({
//         openAIApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
//         modelName: process.env.EXPO_PUBLIC_AI_MODEL_NAME,
//         temperature: 0,
//         streaming: false, // 关闭流式响应
//         configuration: {
//           baseURL: process.env.EXPO_PUBLIC_AI_BASE_URL,
//         },
//       });
  
//      const response = await chatModel.invoke(messages);
  
//      return  response.content.toString();
//   }
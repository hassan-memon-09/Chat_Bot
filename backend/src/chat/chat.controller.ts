// chat.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as dotenv from 'dotenv';

dotenv.config();

// Configure axios-retry
axiosRetry(axios, {
  retries: 3, // Retry 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Wait 1s, 2s, 3s between retries
  retryCondition: (error) => {
    // Retry on 503 errors or network errors
    return error.response?.status === 503 || !error.response;
  },
});

@Controller('chat')
export class ChatController {
  @Post()
  async getChatResponse(@Body('prompt') prompt: string) {
    if (!prompt || !prompt.trim()) {
      throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new HttpException('API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const result = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: process.env.GEMINI_API_KEY,
          },
        },
      );

      if (!result.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Unexpected API response structure');
      }

      const response = result.data.candidates[0].content.parts[0].text;
      return { response };
    } catch (error) {
      console.error('Error from Gemini API:', error.response?.data || error.message);
      throw new HttpException(
        `Failed to get response from Gemini API: ${error.response?.data?.message || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
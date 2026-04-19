import { z } from 'zod'

/** 中国大陆 11 位手机号（1 开头，第二位 3–9） */
export const cnMobileString = z
  .string()
  .min(1, '请输入手机号。')
  .regex(/^1[3-9]\d{9}$/, '请输入有效的 11 位中国大陆手机号。')

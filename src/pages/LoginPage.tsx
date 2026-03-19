import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { fadeUp, staggerContainer } from '../lib/animations';
import { saveToken } from '../services/token-manager';
import apiClient from '../services/api-client';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('请填写用户名和密码');
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      saveToken(response.data.access_token);
      toast.success('登录成功');
      navigate('/todos');
    } catch (error: any) {
      let message = '登录失败，请检查用户名和密码';
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        const firstError = detail[0];
        if (typeof firstError === 'string') {
          message = firstError;
        } else if (firstError?.msg) {
          message = firstError.msg;
        }
      } else if (detail?.msg) {
        message = detail.msg;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full sm:w-[480px] px-4 sm:px-0"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <Card className="w-full">
        <CardHeader className="space-y-4">
          {/* Logo 区域 */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold">任务清单</span>
          </div>

          <div className="text-center">
            <CardTitle className="text-2xl">欢迎回来</CardTitle>
            <CardDescription>登录你的账户</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center text-sm">
              <span className="text-muted-foreground">还没有账户？</span>{' '}
              <Link to="/register" className="text-primary hover:underline">
                立即注册
              </Link>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

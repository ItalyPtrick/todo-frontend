import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { fadeUp, staggerContainer } from '../lib/animations';
import apiClient from '../services/api-client';
import { AuthLayout } from '../layouts/AuthLayout';

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('两次密码输入不一致');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/register', {
        username,
        password,
      });

      toast.success('注册成功，请登录');
      navigate('/login');
    } catch (error: any) {
      let message = '注册失败，请稍后重试';
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
      className="w-full max-w-md"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <Card>
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
            <CardTitle className="text-2xl">创建账户</CardTitle>
            <CardDescription>注册一个新账户</CardDescription>
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

            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '注册中...' : '注册'}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center text-sm">
              <span className="text-muted-foreground">已有账户？</span>{' '}
              <Link to="/login" className="text-primary hover:underline">
                立即登录
              </Link>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

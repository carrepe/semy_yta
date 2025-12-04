import React, { useState, FormEvent } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';

interface LoginModalProps {
    onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const adminId = import.meta.env.VITE_ADMIN_ID;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (username === adminId && password === adminPassword) {
            // 로그인 성공
            onLogin();
        } else {
            // 로그인 실패
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setPassword(''); // 비밀번호 초기화
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-ss animate-fadeIn">
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden ${isShaking ? 'animate-shake' : ''
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center">로그인</h2>
                    <p className="text-red-100 text-center text-sm mt-1">
                        계속하려면 로그인이 필요합니다
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="mb-5">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                            아이디
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                placeholder="아이디를 입력하세요"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            비밀번호
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        로그인
                    </button>

                    {/* Info Text */}
                    <p className="mt-6 text-xs text-center text-gray-500">
                        관리자 계정으로 로그인하세요
                    </p>
                </form>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default LoginModal;

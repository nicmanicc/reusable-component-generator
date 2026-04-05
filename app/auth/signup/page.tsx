'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthProviderSignIn } from '../components/AuthProviderSignIn';
import { signInWithGoogle, signInWithGithub, signup } from '@/lib/auth-actions';
import { useRouter } from 'next/navigation';
import { authErrorMessageFromCode } from '@/lib/auth/errors';
import ToggleThemeButton from '../../components/ToggleThemeButton';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await signup(formData);
    if (response.error.code) {
      setError(
        authErrorMessageFromCode(response.error.code) ??
          'Unable to create account.',
      );
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="relative font-dm-mono bg-parchment text-ink min-h-dvh flex flex-col overflow-x-hidden lp-crosshatch">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 max-md:px-6 h-13 border-b border-rule">
        <button
          className="font-dm-mono text-[0.78rem] font-medium tracking-[0.22em] uppercase text-ink flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer hover:text-teal transition-colors"
          onClick={() => router.push('/')}
        >
          <span className="text-teal text-[1.05rem]">[/]</span>
          ShareUI
        </button>
        <nav className="flex items-center gap-6">
          <span className="font-dm-mono text-[0.7rem] tracking-widest text-mid">
            Have an account?
          </span>
          <ToggleThemeButton />
          <button
            className="font-dm-mono text-[0.7rem] font-medium tracking-[0.12em] uppercase bg-ink text-parchment px-5 py-2 cursor-pointer hover:bg-teal hover:text-ink transition-all"
            onClick={() => router.push('/auth/login')}
          >
            Sign in
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-10 max-md:px-6 py-12">
          {/* Eyebrow */}
          <div className="opacity-0 animate-ca-in-left [animation-delay:0.05s] text-[0.62rem] tracking-[0.28em] uppercase text-teal mb-5 flex items-center gap-2.5 lp-label-line">
            New account
          </div>

          {/* Title */}
          <h1 className="opacity-0 animate-ca-in-left [animation-delay:0.15s] font-dm-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] font-normal text-ink tracking-[-0.02em]">
            Start
            <br />
            <span className="italic text-teal">building.</span>
          </h1>

          <div className="opacity-0 animate-ca-in-up [animation-delay:0.25s] border-t border-rule mt-6 mb-7" />

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="opacity-0 animate-ca-in-up [animation-delay:0.3s] flex flex-col gap-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-[0.6rem] tracking-[0.22em] uppercase text-mid mb-1.5"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-rule bg-transparent text-ink font-dm-mono text-[0.82rem] px-3.5 py-2.5 focus:outline-none focus:border-teal transition-colors placeholder:text-mid/40"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[0.6rem] tracking-[0.22em] uppercase text-mid mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-rule bg-transparent text-ink font-dm-mono text-[0.82rem] px-3.5 py-2.5 focus:outline-none focus:border-teal transition-colors placeholder:text-mid/40"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[0.6rem] tracking-[0.22em] uppercase text-mid mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-rule bg-transparent text-ink font-dm-mono text-[0.82rem] px-3.5 py-2.5 focus:outline-none focus:border-teal transition-colors placeholder:text-mid/40"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[0.6rem] tracking-[0.22em] uppercase text-mid mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-rule bg-transparent text-ink font-dm-mono text-[0.82rem] px-3.5 py-2.5 focus:outline-none focus:border-teal transition-colors placeholder:text-mid/40"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-[0.65rem] tracking-[0.08em] text-red-500">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="lp-cta-slide font-dm-mono text-[0.72rem] font-medium tracking-[0.14em] uppercase bg-ink text-parchment px-7.5 py-3.25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1 w-full"
            >
              <span className="relative z-1">
                {isLoading ? 'Creating account…' : 'Create account →'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="opacity-0 animate-ca-in-up [animation-delay:0.45s] flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-rule" />
            <span className="text-[0.58rem] tracking-[0.2em] uppercase text-mid">
              or
            </span>
            <div className="flex-1 h-px bg-rule" />
          </div>

          {/* Social */}
          <div className="opacity-0 animate-ca-in-up [animation-delay:0.55s] grid grid-cols-2 gap-3">
            <AuthProviderSignIn
              AuthProviderFunc={signInWithGoogle}
              AuthProviderName="Google"
            />
            <AuthProviderSignIn
              AuthProviderFunc={signInWithGithub}
              AuthProviderName="GitHub"
            />
          </div>

          {/* Sign in link */}
          <p className="opacity-0 animate-ca-in-up [animation-delay:0.65s] text-[0.62rem] tracking-[0.08em] text-mid text-center mt-7">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-teal hover:text-ink transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-rule px-10 max-md:px-6 h-11 flex items-center justify-between">
        <span className="text-[0.6rem] tracking-[0.12em] text-mid">
          © 2026 ShareUI · Built for developers
        </span>
        <div className="flex items-center gap-5">
          <span className="text-[0.6rem] tracking-[0.12em] text-mid">v1.0</span>
          <span className="text-[0.6rem] tracking-[0.12em] text-teal">
            ● All systems normal
          </span>
        </div>
      </footer>
    </div>
  );
}

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { hashPassword, verifyPassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(new AppError('Email already in use', 400));

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ status: 'success', data: { user: { id: user.id, email: user.email, name: user.name } } });
  } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return next(new AppError('Invalid credentials', 401));

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return next(new AppError('Invalid credentials', 401));

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ status: 'success', data: { user: { id: user.id, email: user.email, name: user.name } } });
  } catch (error) { next(error); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new AppError('No refresh token provided', 401));

    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return next(new AppError('User not found', 401));

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ status: 'success' });
  } catch (error) { next(new AppError('Invalid refresh token', 401)); }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ status: 'success' });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json({ status: 'success', data: { user: { id: user.id, email: user.email, name: user.name } } });
  } catch (error) { next(error); }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });
    res.status(200).json({ status: 'success', data: { user: { id: user.id, email: user.email, name: user.name } } });
  } catch (error) { next(error); }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    const isValid = await verifyPassword(oldPassword, user!.password!);
    if (!isValid) return next(new AppError('Incorrect old password', 400));

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user!.id },
      data: { password: hashedPassword },
    });
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

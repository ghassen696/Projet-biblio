import { lazy, Suspense } from 'react';
import { Navigate, useRoutes, BrowserRouter, Outlet } from 'react-router-dom';
import React from 'react';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard/layout';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const BookDetailPage = lazy(() => import('src/pages/BookDetailPage'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
import { useAuth } from 'src/app';

// ----------------------------------------------------------------------

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

interface ProtectedRouteProps {
    requiredRole?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { token, role } = useAuth();
    if (!token) {
      return <Navigate to="/sign-in" />;
    }
     if (requiredRole && role !== requiredRole) {
         return <Navigate to="/blog" />;
     }
    return <>{children}</>;
};
function RouterComponent() {
    return useRoutes([
        {
            element: (
                <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                {
                     path: '/',
                    element: <ProtectedRoute requiredRole="admin"><HomePage /></ProtectedRoute>, index: true
                },
                {
                    path: 'user',
                   element: <ProtectedRoute requiredRole="admin"><UserPage /></ProtectedRoute>
                },
                {
                    path: 'blog',
                    element: <ProtectedRoute><BlogPage /></ProtectedRoute>
                },
                {
                    path: 'book/:id',
                    element: <ProtectedRoute><BookDetailPage /></ProtectedRoute>
                },
            ],
        },
        {
            path: 'sign-in',
            element: (
                <AuthLayout>
                    <SignInPage />
                </AuthLayout>
            ),
        },
        {
            path: 'register',
            element: (
                <AuthLayout>
                    <RegisterPage />
                </AuthLayout>
            ),
        },
        {
            path: '404',
            element: <Page404 />,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);
}
export function Router() {
    return (
        <RouterComponent />
    );
}
export function AppRouter() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}
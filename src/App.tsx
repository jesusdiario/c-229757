
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import ExegeseCapitulo from "./pages/ExegeseCapitulo";
import CriarPregacaoExpositiva from "./pages/CriarPregacaoExpositiva";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Componente de proteção de rota
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900">Carregando...</div>;
    if (!session) return <Navigate to="/auth" replace />;
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={session ? <Navigate to="/" replace /> : <Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/exegese-capitulo" element={
              <ProtectedRoute>
                <ExegeseCapitulo />
              </ProtectedRoute>
            } />
            <Route path="/criar-pregacao-expositiva" element={
              <ProtectedRoute>
                <CriarPregacaoExpositiva />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-red-100 max-w-lg w-full">
                        <h1 className="text-2xl font-black text-red-600 mb-2">Algo deu errado!</h1>
                        <p className="text-slate-600 mb-6 font-medium">Ocorreu um erro inesperado na aplicação.</p>

                        <div className="bg-slate-900 text-slate-50 p-4 rounded-xl text-left text-xs font-mono overflow-auto max-h-48 mb-6 border border-slate-800">
                            {this.state.error && this.state.error.toString()}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                            >
                                Limpar Dados e Reiniciar
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-slate-300 transition-all"
                            >
                                Apenas Recarregar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

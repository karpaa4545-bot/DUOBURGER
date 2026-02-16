"use client";

import React, { useState, useEffect } from 'react';

/**
 * VERSÃO DE DIAGNÓSTICO
 * Se esta tela carregar, o erro está nos componentes internos.
 * Se esta tela NÃO carregar, o erro está nas bibliotecas (Next/React/Lucide).
 */
export default function AdminDashboard() {
    const [status, setStatus] = useState("Iniciando...");

    useEffect(() => {
        setStatus("Componente montado com sucesso.");
        console.log("DIAGNOSTICO: Painel montado.");
    }, []);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ color: '#ef4444' }}>Diagnóstico de Sistema</h1>
            <p>{status}</p>
            <button
                onClick={() => window.location.reload()}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Recarregar Página
            </button>
            <p style={{ marginTop: '40px', fontSize: '12px', opacity: 0.5 }}>
                URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}
            </p>
        </div>
    );
}

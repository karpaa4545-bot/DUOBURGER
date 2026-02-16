"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, LayoutDashboard, Utensils, Settings, LogOut, ChevronRight, Upload, ImageIcon, X, Images, ShoppingCart, Clock, MapPin, Monitor, Search, CreditCard, Banknote, User, Phone, Ticket, BarChart3, PieChart, DollarSign, TrendingUp, MessageCircle, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product, Category, StoreConfig } from '../lib/data';
import { BRANDING } from '../lib/branding';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'products' | 'categories' | 'config' | 'banners' | 'coupons' | 'analytics' | 'pdv'>('home');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [printableOrder, setPrintableOrder] = useState<any>(null);
    const [printType, setPrintType] = useState<'kitchen' | 'customer' | null>(null);
    const [activeAdminCategory, setActiveAdminCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const lastOrderCount = React.useRef<number>(0);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [lockError, setLockError] = useState(false);
    const [cashierModal, setCashierModal] = useState({ show: false, initialValue: 0 });

    // PDV States
    const [pdvCart, setPdvCart] = useState<any[]>([]);
    const [pdvSearch, setPdvSearch] = useState("");
    const [pdvCustomer, setPdvCustomer] = useState({ name: "", phone: "", address: "", neighborhood: "" });
    const [pdvPayment, setPdvPayment] = useState("Dinheiro");
    const [pdvObservation, setPdvObservation] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // SENHA DEFINIDA AQUI: "KARPA4545"
        if (passwordInput === "KARPA4545") {
            setIsAuthenticated(true);
        } else {
            setLockError(true);
            setTimeout(() => setLockError(false), 2000);
        }
    };

    const fetchOrders = (isPolling = false) => {
        if (!isPolling) setLoading(true);
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                if (!isPolling) setLoading(false);
            })
            .catch(() => {
                if (!isPolling) setLoading(false);
            });
    };

    // Polling de pedidos (a cada 30 segundos)
    useEffect(() => {
        const interval = setInterval(() => {
            // Pausa o polling se estiver na aba de produtos ou configurações para evitar sobrescrever edições
            // Também pausa se estiver salvando algo (evita corrida de dados)
            if (activeTab === 'products' || activeTab === 'config' || activeTab === 'categories' || activeTab === 'coupons' || saving) {
                console.log("Polling pausado durante edição ou salvamento.");
                return;
            }
            fetchOrders(true);
        }, 30000);

        // Desbloquear áudio no mobile no primeiro clique
        const unlockAudio = () => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS56+OdTgwOUKXh8LZjHAU7k9nyz3osBSh+zPLaizsKFGCz6OyrWBUIR6Hh8r5sIAUsgs/y2Ik2Bxdlu+vjnU4LDlCl4fC2YxwFO5PZ8s96LAUofszy2os7ChRgs+jsq1gVCEeh4fK+bCAFLILP8tiJNgcXZbvr451OCw5QpeHwtmMcBTuT2fLPeiwFKH7M8tqLOwoUYLPo7KtYFQhHoeHyvmwgBSyCz/LYiTYHF2W76+OdTgsOUKXh8LZjHAU7k9nyz3osBSh+zPLaizsKFGCz6OyrWBUIR6Hh8r5sIAUsgs/y2Ik2Bxdlu+vjnU4LDlCl4fC2YxwFO5PZ8s96LAUofszy2os7ChRgs+jsq1gVCEeh4fK+bCAFLILP8tiJNgcXZbvr451OCw5QpeHwtmMcBTuT2fLPeiwFKH7M8tqLOwoUYLPo7KtYFQhHoeHyvmwgBSyCz/LYiTYHF2W76+OdTgsOUKXh8LZjHAU7k9nyz3osBSh+zPLaizsKFGCz6OyrWBUIR6Hh8r5sIAUsgs/y2Ik2Bxdlu+vjnU4LDlCl4fC2YxwFO5PZ8s96LAUofszy2os7ChRgs+jsq1gVCEeh4fK+bCAFLILP8tiJNgcXZbvr451OCw5QpeHwtmMcBTuT2fLPeiwFKH7M8tqLOwoUYLPo7KtYFQhHoeHyvmwgBSyCz/LYiTYHF2W76+OdTgsOUKXh8LZjHAU7k9nyz3osBSh+zPLaizsKFGCz6OyrWBUIR6Hh8r5sIAUsgs/y2Ik2Bxdlu+vjnU4LDlCl4fC2YxwFO5PZ8s96LAUofszy2os7ChRgs+jsq1gVCEeh4fK+bCAFLILP8tiJNgcXZbvr451OCw5QpeHwtmMcBTuT2fLPeiwFKH7M8tqLOwoUYLPo7KtYFQ==');
            audio.volume = 0.0;
            audio.play().then(() => {
                console.log("Audio desbloqueado");
                window.removeEventListener('click', unlockAudio);
            }).catch(() => { });
        };
        window.addEventListener('click', unlockAudio);

        return () => window.removeEventListener('click', unlockAudio);
    }, []);

    // Polling de pedidos (a cada 30 segundos)
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeTab === 'products' || activeTab === 'config' || activeTab === 'categories' || activeTab === 'coupons' || saving) {
                return;
            }
            fetchOrders(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [activeTab, saving]);

    /*
     - [x] Estabilizar versões do Next.js e React no `package.json`
     - [x] Implementar CSS robusto para impressão térmica em `globals.css`
     - [x] Refatorar `AdminDashboard.tsx`:
         - [x] Implementar `try-catch` de renderização global
         - [x] Corrigir lógica de impressão com `useEffect` e `printableOrder`
         - [x] Garantir compatibilidade de CSS com `.no-print`
         - [x] Corrigir fechamento de tags e aninhamento de abas
     - [x] Sincronizar alterações pendentes no Git (Limpar notificação azul 51)
     - [x] Verificar funcionamento de todas as abas no ambiente de produção (Manualmente pelo usuário)
    */

    // Monitorar novos pedidos para tocar som
    // Efeito para disparar a impressão logo após a renderização do recibo
    useEffect(() => {
        if (printableOrder && printType) {
            console.log(`Iniciando impressão do pedido #${printableOrder.id} - Tipo: ${printType}`);
            const timer = setTimeout(() => {
                window.print();
                // Não limpamos mais aqui para evitar que o conteúdo suma da prévia
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [printableOrder, printType]);

    // Estado para controlar se o áudio foi desbloqueado pelo usuário
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    // Contexto de áudio persistente
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

    // Função para tocar uma sirene gerada via código (Sem arquivos)
    const playAlarm = () => {
        try {
            const ctx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();

            // Se o contexto estiver suspenso, tenta retomar
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            if (!audioCtx) setAudioCtx(ctx);

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Configuração da Sirene "Escandalosa"
            osc.type = 'sawtooth'; // Som mais agudo/irritante que sine
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
            osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.0);

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); // Toca por 1.5s

            osc.start();
            osc.stop(ctx.currentTime + 1.5);

            return ctx;
        } catch (e) {
            console.error("Erro ao gerar som:", e);
        }
    };

    // Função para desbloquear o áudio (Toca um bipe curto silêncioso para ativar o contexto)
    const enableAudio = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            ctx.resume().then(() => {
                setAudioCtx(ctx);
                setAudioUnlocked(true);
                console.log("🔊 Áudio desbloqueado com sucesso!");

                // Toca um bipe de confirmação
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 600;
                gain.gain.value = 0.1;
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            });
        } catch (e) {
            console.error("Erro ao desbloquear áudio:", e);
        }
    };

    // Monitorar novos pedidos para tocar som
    useEffect(() => {
        if (!audioUnlocked) return;

        if (data?.orders && data.orders.length > lastOrderCount.current) {
            if (lastOrderCount.current > 0 && soundEnabled) {
                console.log("🔔 Novo pedido! Tocando sirene...");
                // Loop de 3 toques
                playAlarm();
                setTimeout(playAlarm, 1000);
                setTimeout(playAlarm, 2000);
            }
            lastOrderCount.current = data.orders.length;
        }
    }, [data, soundEnabled, audioUnlocked, playAlarm]); // Added playAlarm to dependencies

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateCategory = (id: string, name: string) => {
        setData((prev: any) => ({
            ...prev,
            categories: prev.categories.map((c: Category) => c.id === id ? { ...c, name } : c)
        }));
    };

    const addCategory = () => {
        const newCat: Category = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Nova Categoria",
            icon: "Utensils"
        };
        setData((prev: any) => ({ ...prev, categories: [...prev.categories, newCat] }));
    };

    const deleteCategory = (id: string) => {
        if (confirm("Tem certeza? Isso pode afetar os produtos vinculados a esta categoria.")) {
            setData((prev: any) => ({
                ...prev,
                categories: prev.categories.filter((c: Category) => c.id !== id)
            }));
        }
    };

    // Estado para feedback visual
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showFeedback = (type: 'success' | 'error', message: string, duration = 3000) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), duration);
    };

    const handleImageUpload = async (file: File, path: string, callback: (url: string) => void) => {
        const formData = new FormData();
        formData.append('file', file);

        setUploading(path); // Mostra estado de carregando

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Falha no upload');
            }

            const result = await res.json();
            callback(result.url);
            showFeedback('success', 'Imagem enviada com sucesso!');
        } catch (error: any) {
            showFeedback('error', `Erro: ${error.message}`);
            alert(`Aviso: ${error.message}\n\nDica: Copie o link da imagem e cole direto no campo de texto.`);
        } finally {
            setUploading(null); // Remove estado de carregando
        }
    };

    const handleSave = async (customData?: any) => {
        setSaving(true);
        try {
            const dataToSave = customData || data;
            const result = await saveData(dataToSave);

            if (result.success) {
                // Se salvou com sucesso (mesmo que localmente), mostra feedback positivo
                showFeedback('success', result.message || 'Alterações salvas com sucesso!');
            } else {
                // Se falhou
                showFeedback('error', result.message || 'Erro ao salvar alterações.');
                alert('Erro: ' + result.message);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            showFeedback('error', 'Erro inesperado ao salvar.');
        } finally {
            setSaving(false);
        }
    };


    const addToPdvCart = (product: Product) => {
        setPdvCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1, observation: "" }];
        });
    };

    const updatePdvQuantity = (id: string, delta: number) => {
        setPdvCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const finishPdvSale = () => {
        if (pdvCart.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        const total = pdvCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const newOrder = {
            id: Math.floor(Math.random() * 10000).toString(),
            date: new Date().toLocaleString('pt-BR'),
            status: 'Entregue',
            total: total,
            payment: pdvPayment,
            items: pdvCart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                observation: item.observation
            })),
            customer: {
                name: pdvCustomer.name || "Cliente Balcão",
                phone: pdvCustomer.phone,
                address: pdvCustomer.address || "Retirada no Local",
                neighborhood: pdvCustomer.neighborhood
            },
            type: 'PDV',
            observation: pdvObservation
        };

        // Dedução de estoque
        const updatedProducts = data.products.map((p: Product) => {
            const cartItem = pdvCart.find(item => item.id === p.id);
            if (cartItem && p.trackStock) {
                return { ...p, stock: Math.max(0, (p.stock || 0) - cartItem.quantity) };
            }
            return p;
        });

        const newOrders = [newOrder, ...(data.orders || [])];
        const newData = { ...data, orders: newOrders, products: updatedProducts };
        setData(newData);
        handleSave(newData);

        // Limpar PDV
        setPdvCart([]);
        setPdvCustomer({ name: "", phone: "", address: "", neighborhood: "" });
        setPdvObservation("");
        alert("Venda registrada com sucesso!");
    };

    const updateProduct = (id: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            products: prev.products.map((p: Product) => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const addProduct = () => {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Novo Produto",
            description: "Descrição aqui",
            price: 0,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
            category: activeAdminCategory === "all" ? data?.categories?.[0]?.id : activeAdminCategory,
            available: true
        };
        setData((prev: any) => ({ ...prev, products: [...prev.products, newProduct] }));
    };

    const deleteProduct = (id: string) => {
        if (confirm("Tem certeza que deseja excluir?")) {
            setData((prev: any) => ({
                ...prev,
                products: prev.products.filter((p: Product) => p.id !== id)
            }));
        }
    };

    const addProductExtra = (productId: string) => {
        const newExtra = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Novo Adicional",
            price: 0
        };
        setData((prev: any) => ({
            ...prev,
            products: prev.products.map((p: Product) =>
                p.id === productId ? { ...p, extras: [...(p.extras || []), newExtra] } : p
            )
        }));
    };

    const updateProductExtra = (productId: string, extraId: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            products: prev.products.map((p: Product) =>
                p.id === productId ? {
                    ...p,
                    extras: p.extras?.map(e => e.id === extraId ? { ...e, [field]: value } : e) || []
                } : p
            )
        }));
    };

    const deleteProductExtra = (productId: string, extraId: string) => {
        setData((prev: any) => ({
            ...prev,
            products: prev.products.map((p: Product) =>
                p.id === productId ? {
                    ...p,
                    extras: p.extras?.filter(e => e.id !== extraId) || []
                } : p
            )
        }));
    };

    const addCoupon = () => {
        const newCoupon = { code: "BEMVINDO", discount: 10, type: 'percent' as const };
        setData((prev: any) => ({
            ...prev,
            store: { ...prev.store, coupons: [...(prev.store.coupons || []), newCoupon] }
        }));
    };

    const updateCoupon = (index: number, field: string, value: any) => {
        setData((prev: any) => {
            const newCoupons = [...(prev.store.coupons || [])];
            newCoupons[index] = { ...newCoupons[index], [field]: value };
            return { ...prev, store: { ...prev.store, coupons: newCoupons } };
        });
    };

    const deleteCoupon = (index: number) => {
        setData((prev: any) => {
            const newCoupons = prev.store.coupons.filter((_: any, i: number) => i !== index);
            return { ...prev, store: { ...prev.store, coupons: newCoupons } };
        });
    };

    const handleOpenCashier = (initialBalance: number) => {
        const newStatus = {
            isOpen: true,
            openingTime: new Date().toLocaleString('pt-BR'),
            initialBalance,
            currentBalance: initialBalance
        };
        const newData = { ...data, store: { ...data.store, cashierStatus: newStatus } };
        setData(newData);
        handleSave(newData);
    };

    const handleCloseCashier = () => {
        if (confirm("Deseja realmente fechar o caixa?")) {
            const newStatus = {
                ...(data?.store?.cashierStatus || {}),
                isOpen: false,
                closingTime: new Date().toLocaleString('pt-BR')
            };
            const newData = { ...data, store: { ...data?.store, cashierStatus: newStatus } };
            setData(newData);
            handleSave(newData);
            alert(`Caixa fechado com sucesso! Saldo Final: R$ ${(data?.store?.cashierStatus?.currentBalance || 0).toFixed(2)}`);
        }
    };

    // --- RENDER SAFETY WRAPPER ---
    try {
        if (loading) return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

        if (!isAuthenticated) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                    <form onSubmit={handleLogin} className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl space-y-6">
                        <div className="text-center space-y-2">
                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Utensils className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="font-bold text-2xl text-slate-800">Painel do Restaurante</h1>
                            <p className="text-slate-500 text-sm">Digite sua senha para acessar</p>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="password"
                                autoFocus
                                placeholder="Senha de acesso"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className={cn(
                                    "w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold text-center text-lg outline-none transition-all placeholder:font-normal",
                                    lockError ? "border-red-500 bg-red-50 text-red-500 animate-shake" : "border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                )}
                            />
                            {lockError && <p className="text-xs text-center text-red-500 font-bold">Senha incorreta</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            );
        }

        if (!data || !data.store) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                    <div className="bg-red-50 text-red-500 p-6 rounded-3xl mb-4">
                        <X className="w-12 h-12 mx-auto mb-2" />
                        <h2 className="font-bold text-xl">Erro ao carregar dados</h2>
                    </div>
                    <p className="text-slate-500 mb-6 max-w-md">Não foi possível conectar ao banco de dados ou os dados estão incompletos.
                        <br /><span className="text-xs mt-2 block opacity-70">Detalhe: {JSON.stringify(data).substring(0, 50)}</span>
                    </p>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        return (
            <>
                <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans relative no-print">
                    {/* Dashboard Desktop/Mobile */}
                    {/* Header Mobile */}
                    <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-[60] shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-xs">AD</div>
                            <h1 className="font-black text-lg tracking-tight uppercase">Painel App</h1>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Overlay para fechar o menu ao clicar fora no mobile */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden animate-in fade-in duration-300"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar (Desktop fixo, Mobile Drawer) */}
                    <aside className={cn(
                        "fixed inset-y-0 left-0 bg-slate-900 text-white p-6 flex flex-col gap-8 shadow-xl transition-all duration-300 z-[55] w-64 md:relative md:translate-x-0 md:flex shrink-0",
                        isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black">AD</div>
                            <h1 className="font-black text-xl tracking-tight uppercase">Painel App</h1>
                        </div>

                        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
                            <button
                                onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'home' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Início
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'home' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'orders' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Pedidos
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'orders' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('pdv'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'pdv' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Monitor className="w-5 h-5" />
                                Ponto de Venda
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'pdv' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'products' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Utensils className="w-5 h-5" />
                                Cardápio
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'products' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'categories' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Categorias
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'categories' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('config'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'config' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Settings className="w-5 h-5" />
                                Configurações
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'config' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('banners'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'banners' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Images className="w-5 h-5" />
                                Banners
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'banners' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('coupons'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'coupons' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Ticket className="w-5 h-5" />
                                Cupons
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'coupons' ? "rotate-90" : "")} />
                            </button>
                            <button
                                onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold group text-sm",
                                    activeTab === 'analytics' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                )}
                            >
                                <BarChart3 className="w-5 h-5" />
                                Relatórios
                                <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeTab === 'analytics' ? "rotate-90" : "")} />
                            </button>
                        </nav>

                        <button className="flex items-center gap-3 p-4 rounded-2xl opacity-40 hover:opacity-100 hover:bg-red-500/10 text-red-400 font-bold transition-all mt-auto border-t border-white/5 pt-6">
                            <LogOut className="w-5 h-5" /> Sair
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
                        {/* Toast Notification */}
                        {feedback && (
                            <div className={cn(
                                "fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300",
                                feedback.type === 'success' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            )}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                <p className="font-bold pr-2">{feedback.message}</p>
                                <button onClick={() => setFeedback(null)} className="ml-2 opacity-80 hover:opacity-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                                    {activeTab === 'orders' ? 'Pedidos Recebidos' :
                                        activeTab === 'products' ? 'Gerenciar Cardápio' :
                                            activeTab === 'categories' ? 'Gerenciar Categorias' :
                                                activeTab === 'banners' ? 'Gerenciar Banners' :
                                                    activeTab === 'coupons' ? 'Cupons de Desconto' :
                                                        activeTab === 'analytics' ? 'Relatórios de Vendas' :
                                                            'Configurações da Loja'}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-muted-foreground">Administre sua loja em tempo real.</p>
                                    {activeTab === 'orders' && (
                                        <button onClick={() => fetchOrders()} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold hover:bg-primary/20 transition-all uppercase">
                                            🔄 Atualizar Lista
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className={cn(
                                        "p-4 rounded-2xl shadow-xl transition-all font-bold flex items-center gap-2",
                                        soundEnabled ? "bg-blue-600 text-white shadow-blue-600/20" : "bg-slate-200 text-slate-500"
                                    )}
                                >
                                    {soundEnabled ? "🔊 Som Ativado" : "🔇 Som Mudo"}
                                </button>
                                {!audioUnlocked ? (
                                    <button
                                        onClick={enableAudio}
                                        className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-red-500/20 font-bold hover:bg-red-600 transition-all animate-pulse flex items-center gap-2"
                                    >
                                        🔇 CLIQUE P/ ATIVAR SOM
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            playAlarm();
                                            setTimeout(playAlarm, 800);
                                        }}
                                        className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-green-600/20 font-bold hover:bg-green-700 transition-all"
                                    >
                                        🔔 Testar Som (Sirene)
                                    </button>
                                )}

                            </div>
                        </header>

                        {/* MODAL DE CAIXA */}
                        {cashierModal.show && (
                            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                                <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                                    <h3 className="font-black text-2xl text-slate-800 mb-2 uppercase tracking-tight">Abrir Caixa</h3>
                                    <p className="text-slate-500 text-sm mb-6 font-medium">Informe o saldo inicial em dinheiro.</p>

                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-primary/20">
                                            <label className="text-[10px] font-black uppercase text-primary mb-2 block">Saldo Inicial (R$)</label>
                                            <input
                                                type="number"
                                                autoFocus
                                                value={cashierModal.initialValue}
                                                onChange={(e) => setCashierModal({ ...cashierModal, initialValue: parseFloat(e.target.value) || 0 })}
                                                className="w-full bg-transparent border-none font-black text-3xl text-slate-800 outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => {
                                                handleOpenCashier(cashierModal.initialValue);
                                                setCashierModal({ show: false, initialValue: 0 });
                                            }}
                                            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95"
                                        >
                                            Confirmar Abertura
                                        </button>
                                        <button
                                            onClick={() => setCashierModal({ show: false, initialValue: 0 })}
                                            className="w-full text-slate-400 py-2 font-bold hover:text-slate-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EDIÇÃO RÁPIDA DO NOME - LOGO NO TOPO */}
                        <div className="mb-8 bg-primary/5 p-6 rounded-[2.5rem] border-2 border-primary/20">
                            <div className="flex items-center justify-between mb-2 px-2">
                                <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Nome do Aplicativo / Restaurante</label>
                                <button
                                    onClick={() => {
                                        if (confirm("Restaurar nome padrão do sistema?")) {
                                            setData({ ...data, store: { ...data.store, name: BRANDING.name } });
                                        }
                                    }}
                                    className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform"
                                >
                                    Resetar para o Código
                                </button>
                            </div>
                            <input
                                value={data?.store?.name || ""}
                                onChange={(e) => setData({ ...data, store: { ...data.store, name: e.target.value } })}
                                className="w-full bg-white border-none rounded-3xl p-5 font-black text-2xl text-slate-800 shadow-sm focus:ring-4 focus:ring-primary/20 outline-none"
                                placeholder="Escreva o nome aqui..."
                            />
                        </div>

                        {activeTab === 'home' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        {
                                            label: 'Abrir/Fechar Caixa', desc: 'Gerenciar turno e saldo', icon: <ShoppingCart className="w-8 h-8" />, color: 'bg-emerald-500', action: () => {
                                                if (data.store.cashierStatus?.isOpen) {
                                                    handleCloseCashier();
                                                } else {
                                                    setCashierModal({ ...cashierModal, show: true });
                                                }
                                            }
                                        },
                                        { label: 'Novo Pedido', desc: 'Lançar venda manual (PDV)', icon: <Plus className="w-8 h-8" />, color: 'bg-blue-500', action: () => setActiveTab('pdv') },
                                        { label: 'Gerenciar Estoque', desc: 'Controle de quantidades', icon: <TrendingUp className="w-8 h-8" />, color: 'bg-orange-500', action: () => setActiveTab('products') },
                                        { label: 'Relatórios Pro', desc: 'Vendas e lucratividade', icon: <BarChart3 className="w-8 h-8" />, color: 'bg-slate-800', action: () => setActiveTab('analytics') },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={item.action}
                                            className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group text-left flex flex-col gap-4"
                                        >
                                            <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-xl uppercase tracking-tighter">{item.label}</h3>
                                                <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Status Rápido */}
                                <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Status do Sistema</p>
                                            <h4 className="text-xl font-black uppercase">Loja Aberta & Caixa {data.store.cashierStatus?.isOpen ? 'Aberto' : 'Fechado'}</h4>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-6">
                                        {data.store.cashierStatus?.isOpen && (
                                            <>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Saldo em Caixa</p>
                                                    <h4 className="text-xl font-black text-green-400">R$ {data.store.cashierStatus.currentBalance.toFixed(2)}</h4>
                                                </div>
                                                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                                            </>
                                        )}
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Vendas Hoje</p>
                                            <h4 className="text-xl font-black text-primary">R$ {(data.orders || []).filter((o: any) => o.date.includes(new Date().toLocaleDateString('pt-BR'))).reduce((acc: number, o: any) => acc + o.total, 0).toFixed(2)}</h4>
                                        </div>
                                        <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pendentes</p>
                                            <h4 className="text-xl font-black text-orange-400">{(data.orders || []).filter((o: any) => o.status === 'Pendente').length}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                {(!data.orders || data.orders.length === 0) ? (
                                    <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold">Nenhum pedido recebido ainda.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {data.orders.map((order: any) => (
                                            <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                                                <div className="space-y-1 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-slate-100 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider text-slate-500">#{order.id}</span>
                                                        <span className="text-xs text-slate-400">{order.date}</span>
                                                    </div>
                                                    <div className="font-black text-slate-800 text-lg">
                                                        {order.items.length} itens - R$ {order.total.toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium">
                                                        Pagamento: <span className="text-primary font-bold uppercase">{order.payment}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 no-print">
                                                    <button
                                                        onClick={() => {
                                                            setPrintType('kitchen');
                                                            setPrintableOrder(order);
                                                        }}
                                                        className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-600 transition-all"
                                                    >
                                                        🍳 Cozinha
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setPrintType('customer');
                                                            setPrintableOrder(order);
                                                        }}
                                                        className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
                                                    >
                                                        🧾 Cliente
                                                    </button>

                                                    {/* Seletor de Status */}
                                                    <select
                                                        value={order.status || 'Pendente'}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            const newOrders = data.orders.map((o: any) =>
                                                                o.id === order.id ? { ...o, status: newStatus } : o
                                                            );

                                                            let updatedCashier = data.store.cashierStatus;
                                                            let updatedProducts = [...data.products];

                                                            // --- LOGIC: ENTERING PRONTO ---
                                                            if (newStatus === 'Pronto' && order.status !== 'Pronto') {
                                                                // Update Cashier (Ingresso)
                                                                if (updatedCashier?.isOpen) {
                                                                    updatedCashier = {
                                                                        ...updatedCashier,
                                                                        currentBalance: updatedCashier.currentBalance + order.total
                                                                    };
                                                                }

                                                                // Deduct Stock
                                                                order.items.forEach((orderItem: any) => {
                                                                    const productIndex = updatedProducts.findIndex(p => p.name === orderItem.name);
                                                                    if (productIndex !== -1) {
                                                                        const product = updatedProducts[productIndex];
                                                                        if (product.trackStock) {
                                                                            updatedProducts[productIndex] = {
                                                                                ...product,
                                                                                stock: Math.max(0, (product.stock || 0) - orderItem.quantity)
                                                                            };
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            // --- LOGIC: REVERSING PRONTO ---
                                                            if (order.status === 'Pronto' && newStatus !== 'Pronto') {
                                                                // Update Cashier (Extorno)
                                                                if (updatedCashier?.isOpen) {
                                                                    updatedCashier = {
                                                                        ...updatedCashier,
                                                                        currentBalance: Math.max(0, updatedCashier.currentBalance - order.total)
                                                                    };
                                                                }

                                                                // Restore Stock
                                                                order.items.forEach((orderItem: any) => {
                                                                    const productIndex = updatedProducts.findIndex(p => p.name === orderItem.name);
                                                                    if (productIndex !== -1) {
                                                                        const product = updatedProducts[productIndex];
                                                                        if (product.trackStock) {
                                                                            updatedProducts[productIndex] = {
                                                                                ...product,
                                                                                stock: (product.stock || 0) + orderItem.quantity
                                                                            };
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            const newData = {
                                                                ...data,
                                                                orders: newOrders,
                                                                products: updatedProducts,
                                                                store: { ...data.store, cashierStatus: updatedCashier }
                                                            };
                                                            setData(newData);
                                                            handleSave(newData);

                                                            // Se o status for "Saindo para Entrega", avisa no Zap
                                                            if (newStatus === 'Saindo para Entrega') {
                                                                const msg = encodeURIComponent(`*Olá! Seu pedido do ${data.store.name} está saindo para entrega agora!* 🛵🍔`);
                                                                window.open(`https://wa.me/${data.store.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
                                                            }
                                                        }}
                                                        className={cn(
                                                            "text-[10px] font-bold px-3 py-2 rounded-xl border-none ring-1 ring-slate-200 focus:ring-primary/20",
                                                            order.status === 'Pronto' ? "bg-green-50 text-green-600" :
                                                                order.status === 'Saindo para Entrega' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                                        )}
                                                    >
                                                        <option value="Pendente">⏳ Pendente</option>
                                                        <option value="Preparando">🔥 Preparando</option>
                                                        <option value="Saindo para Entrega">🛵 Saiu para Entrega</option>
                                                        <option value="Pronto">✅ Entregue</option>
                                                    </select>

                                                    {/* Botão de Avaliação (Redireciona para o WhatsApp do Cliente) */}
                                                    {order.status === 'Pronto' && (
                                                        <button
                                                            onClick={() => {
                                                                let customerPhone = order.customer?.phone?.replace(/\D/g, '');

                                                                // Se não encontrar o telefone no pedido (pedidos antigos), pede ao usuário
                                                                if (!customerPhone) {
                                                                    const manualPhone = prompt("Número do cliente não encontrado neste pedido antigo. Digite o WhatsApp do cliente (com DDD):", "");
                                                                    if (!manualPhone) return;
                                                                    customerPhone = manualPhone.replace(/\D/g, '');
                                                                }

                                                                const msg = encodeURIComponent(`*Oi! Esperamos que tenha gostado do seu pedido no ${data.store.name}!* 😍\n\nSua avaliação é muito importante para nós. Se puder dedicar um minutinho para nos avaliar, ficaremos muito gratos!`);
                                                                window.open(`https://wa.me/${customerPhone}?text=${msg}`, '_blank');
                                                            }}
                                                            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-200 transition-all flex items-center gap-2"
                                                        >
                                                            ⭐ Pedir Avaliação
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Deseja excluir este pedido? Para sua segurança, ele será apagado permanentemente após a confirmação.")) {
                                                                const newOrders = data.orders.filter((o: any) => o.id !== order.id);
                                                                const newData = { ...data, orders: newOrders };
                                                                setData(newData);
                                                                handleSave(newData);
                                                            }
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                {/* Category Selector for Admin */}
                                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                                    <button
                                        onClick={() => setActiveAdminCategory("all")}
                                        className={cn(
                                            "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                                            activeAdminCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50 text-slate-500"
                                        )}
                                    >
                                        TODOS
                                    </button>
                                    {data.categories.map((cat: Category) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveAdminCategory(cat.id)}
                                            className={cn(
                                                "px-6 py-2 rounded-xl font-bold text-sm transition-all uppercase",
                                                activeAdminCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50 text-slate-500"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={addProduct}
                                    className="w-full border-2 border-dashed border-primary/30 text-primary p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                                >
                                    <Plus className="w-6 h-6" /> Adicionar em {activeAdminCategory === "all" ? "Geral" : data.categories.find((c: any) => c.id === activeAdminCategory)?.name}
                                </button>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {data.products
                                        .filter((p: Product) => activeAdminCategory === "all" || p.category === activeAdminCategory)
                                        .map((p: Product) => (
                                            <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4 hover:shadow-xl hover:border-primary/10 transition-all group">
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-inner flex-shrink-0 relative group/img">
                                                        <img
                                                            src={p.image}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"; // Default placeholder
                                                            }}
                                                        />
                                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity">
                                                            <Upload className="w-6 h-6 text-white" />
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleImageUpload(file, 'products', (url) => updateProduct(p.id, 'image', url));
                                                                }}
                                                            />
                                                        </label>
                                                        {uploading === 'products' && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <input
                                                            value={p.name}
                                                            onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                                                            className="font-bold text-lg w-full bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20"
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <select
                                                                value={p.category}
                                                                onChange={(e) => updateProduct(p.id, 'category', e.target.value)}
                                                                className="text-[10px] font-black uppercase tracking-widest bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary/20"
                                                            >
                                                                {data.categories.map((c: any) => (
                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                            <span className="text-sm font-bold text-slate-400">R$</span>
                                                            <input
                                                                type="number"
                                                                value={p.price}
                                                                onChange={(e) => updateProduct(p.id, 'price', parseFloat(e.target.value))}
                                                                className="font-black text-primary text-xl w-32 bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20"
                                                            />
                                                        </div>
                                                        {p.image.startsWith('/uploads/') && (
                                                            <div className="bg-orange-50 border border-orange-200 p-2 rounded-lg mt-1">
                                                                <p className="text-[9px] text-orange-600 font-bold leading-tight flex items-center gap-1">
                                                                    ⚠️ Imagem salva apenas NESTE computador. Configure o Supabase para funcionar Online.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <textarea
                                                    value={p.description}
                                                    onChange={(e) => updateProduct(p.id, 'description', e.target.value)}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm text-slate-600 min-h-[80px] focus:ring-2 focus:ring-primary/20"
                                                    placeholder="Descrição do produto..."
                                                />

                                                {/* Gerenciamento de Adicionais */}
                                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                            <Plus className="w-3 h-3" /> Adicionais / Opções
                                                        </label>
                                                        <button
                                                            onClick={() => addProductExtra(p.id)}
                                                            className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold hover:bg-primary/20 transition-all uppercase"
                                                        >
                                                            + Adicionar
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {(!p.extras || p.extras.length === 0) ? (
                                                            <p className="text-[10px] text-slate-400 italic text-center py-2">Nenhum adicional cadastrado.</p>
                                                        ) : (
                                                            p.extras.map((extra: any) => (
                                                                <div key={extra.id} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                                                                    <input
                                                                        className="flex-1 bg-slate-50 border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-primary/20"
                                                                        value={extra.name}
                                                                        placeholder="Ex: Queijo Extra"
                                                                        onChange={(e) => updateProductExtra(p.id, extra.id, 'name', e.target.value)}
                                                                    />
                                                                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2">
                                                                        <span className="text-[10px] font-bold text-slate-400">R$</span>
                                                                        <input
                                                                            type="number"
                                                                            className="w-14 bg-transparent border-none p-1 text-xs font-black text-primary"
                                                                            value={extra.price}
                                                                            onChange={(e) => updateProductExtra(p.id, extra.id, 'price', parseFloat(e.target.value))}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => deleteProductExtra(p.id, extra.id)}
                                                                        className="p-1 text-red-300 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <label className="text-xs font-black uppercase text-slate-400">Disponível</label>
                                                            <input
                                                                type="checkbox"
                                                                checked={p.available}
                                                                onChange={(e) => updateProduct(p.id, 'available', e.target.checked)}
                                                                className="w-6 h-6 text-primary rounded-lg border-slate-200 focus:ring-primary/20"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Controlar Estoque</label>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={p.trackStock}
                                                                    onChange={(e) => updateProduct(p.id, 'trackStock', e.target.checked)}
                                                                    className="w-4 h-4 text-primary rounded border-slate-300"
                                                                />
                                                            </div>
                                                            {p.trackStock && (
                                                                <div className="flex items-center gap-2 border-l pl-3">
                                                                    <label className="text-[10px] font-black uppercase text-slate-400">Qtd:</label>
                                                                    <input
                                                                        type="number"
                                                                        value={p.stock || 0}
                                                                        onChange={(e) => updateProduct(p.id, 'stock', parseInt(e.target.value) || 0)}
                                                                        className="w-16 bg-white border rounded-lg px-2 py-1 text-sm font-bold text-center"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteProduct(p.id)}
                                                        className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'categories' && (
                            <div className="space-y-6">
                                <button
                                    onClick={addCategory}
                                    className="w-full border-2 border-dashed border-primary/30 text-primary p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                                >
                                    <Plus className="w-6 h-6" /> Adicionar Categoria
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.categories.map((cat: Category) => (
                                        <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all font-black">
                                                {cat.name[0]}
                                            </div>
                                            <input
                                                value={cat.name}
                                                onChange={(e) => updateCategory(cat.id, e.target.value)}
                                                className="font-bold text-lg w-full bg-transparent border-none focus:ring-0"
                                            />
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'coupons' && (
                            <div className="space-y-6">
                                <button
                                    onClick={addCoupon}
                                    className="w-full border-2 border-dashed border-primary/30 text-primary p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                                >
                                    <Plus className="w-6 h-6" /> Adicionar Cupom
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(data.store.coupons || []).map((coupon: any, index: number) => (
                                        <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="bg-primary/10 text-primary p-3 rounded-xl">
                                                    <X className="w-6 h-6 rotate-45" />
                                                </div>
                                                <button onClick={() => deleteCoupon(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Código do Cupom</label>
                                                <input
                                                    value={coupon.code}
                                                    onChange={(e) => updateCoupon(index, 'code', e.target.value.toUpperCase())}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-black text-lg focus:ring-2 focus:ring-primary/20"
                                                    placeholder="EX: PROMO10"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valor</label>
                                                        <input
                                                            type="number"
                                                            value={coupon.discount}
                                                            onChange={(e) => updateCoupon(index, 'discount', parseFloat(e.target.value))}
                                                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo</label>
                                                        <select
                                                            value={coupon.type}
                                                            onChange={(e) => updateCoupon(index, 'type', e.target.value)}
                                                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="percent">% Porcentagem</option>
                                                            <option value="fixed">R$ Valor Fixo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {
                            activeTab === 'config' && (
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl space-y-8">
                                    <div className="grid gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between pl-2">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nome da Loja</label>
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Deseja voltar para o nome padrão do Branding?")) {
                                                            setData({ ...data, store: { ...data.store, name: BRANDING.name } });
                                                        }
                                                    }}
                                                    className="text-[10px] text-primary hover:underline font-bold"
                                                >
                                                    Resgatar do Branding
                                                </button>
                                            </div>
                                            <input
                                                value={data.store.name}
                                                onChange={(e) => setData({ ...data, store: { ...data.store, name: e.target.value } })}
                                                placeholder="Digite o nome do restaurante aqui..."
                                                className="w-full bg-slate-50 border-2 border-primary/10 rounded-2xl p-5 font-bold text-xl text-primary focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">WhatsApp (com DDD)</label>
                                            <input
                                                value={data.store.whatsapp}
                                                onChange={(e) => setData({ ...data, store: { ...data.store, whatsapp: e.target.value } })}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> Tempo Médio de Entrega
                                            </label>
                                            <input
                                                value={data.store.deliveryTime || ''}
                                                onChange={(e) => setData({ ...data, store: { ...data.store, deliveryTime: e.target.value } })}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                                placeholder="Ex: 40-60 min"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center justify-between">
                                                <span>URL da Logomarca</span>
                                                <label className="text-primary cursor-pointer hover:underline flex items-center gap-1 lowercase">
                                                    <Upload className="w-3 h-3" />
                                                    {uploading === 'logo' ? 'Enviando...' : 'Fazer Upload'}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'logo', (url: string) => setData({ ...data, store: { ...data.store, logo: url } }));
                                                        }}
                                                    />
                                                </label>
                                            </label>
                                            <input
                                                value={data.store.logo}
                                                onChange={(e) => setData({ ...data, store: { ...data.store, logo: e.target.value } })}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">Endereço</label>
                                            <textarea
                                                value={data.store.address}
                                                onChange={(e) => setData({ ...data, store: { ...data.store, address: e.target.value } })}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <h3 className="font-bold text-slate-900">Formas de Pagamento</h3>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2">Chave PIX (E-mail, CPF ou Telefone)</label>
                                                <input
                                                    value={data.store.pixKey || ''}
                                                    onChange={(e) => setData({ ...data, store: { ...data.store, pixKey: e.target.value } })}
                                                    placeholder="Ex: 11999999999"
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                                />
                                                <p className="text-xs text-slate-400 pl-2">Deixe em branco se não quiser aceitar PIX</p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center justify-between">
                                                    <span>QR Code do PIX (Opcional)</span>
                                                    <label className="text-primary cursor-pointer hover:underline flex items-center gap-1 lowercase">
                                                        <Upload className="w-3 h-3" />
                                                        {uploading === 'qrcode' ? 'Enviando...' : 'Fazer Upload'}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleImageUpload(file, 'qrcode', (url) => setData({ ...data, store: { ...data.store, pixQrCode: url } }));
                                                            }}
                                                        />
                                                    </label>
                                                </label>
                                                {data.store.pixQrCode && (
                                                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-center mb-2 relative group">
                                                        <img src={data.store.pixQrCode} alt="QR Code" className="w-32 h-32 object-contain" />
                                                        <button
                                                            onClick={() => setData({ ...data, store: { ...data.store, pixQrCode: "" } })}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.store.acceptsCard !== false}
                                                        onChange={(e) => setData({ ...data, store: { ...data.store, acceptsCard: e.target.checked } })}
                                                        className="w-5 h-5 text-primary rounded-lg border-slate-300 focus:ring-primary/20"
                                                    />
                                                    <span className="font-bold text-slate-700">Aceitar Cartão (Crédito/Débito)</span>
                                                </label>

                                                <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.store.acceptsCash !== false}
                                                        onChange={(e) => setData({ ...data, store: { ...data.store, acceptsCash: e.target.checked } })}
                                                        className="w-5 h-5 text-primary rounded-lg border-slate-300 focus:ring-primary/20"
                                                    />
                                                    <span className="font-bold text-slate-700">Aceitar Dinheiro</span>
                                                </label>
                                            </div>

                                            {/* Horário de Funcionamento */}
                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-slate-900">Horário de Funcionamento</h3>
                                                    <Clock className="w-5 h-5 text-slate-400" />
                                                </div>

                                                <div className="grid gap-3">
                                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                        const labels: any = {
                                                            monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
                                                            thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo'
                                                        };
                                                        const schedule = (data.store.openingHours && data.store.openingHours[day]) || (BRANDING as any).openingHours[day];
                                                        return (
                                                            <div key={day} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl">
                                                                <span className="w-20 font-bold text-xs uppercase text-slate-500">{labels[day]}</span>

                                                                {!schedule.closed ? (
                                                                    <div className="flex items-center gap-2 flex-1">
                                                                        <input
                                                                            type="time"
                                                                            value={schedule.open}
                                                                            onChange={(e) => setData({
                                                                                ...data,
                                                                                store: {
                                                                                    ...data.store,
                                                                                    openingHours: {
                                                                                        ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                                        [day]: { ...schedule, open: e.target.value }
                                                                                    }
                                                                                }
                                                                            })}
                                                                            className="bg-white border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                                                                        />
                                                                        <span className="text-slate-300">até</span>
                                                                        <input
                                                                            type="time"
                                                                            value={schedule.close}
                                                                            onChange={(e) => setData({
                                                                                ...data,
                                                                                store: {
                                                                                    ...data.store,
                                                                                    openingHours: {
                                                                                        ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                                        [day]: { ...schedule, close: e.target.value }
                                                                                    }
                                                                                }
                                                                            })}
                                                                            className="bg-white border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <span className="flex-1 text-center font-bold text-red-400 text-xs italic">FECHADO O DIA TODO</span>
                                                                )}

                                                                <button
                                                                    onClick={() => setData({
                                                                        ...data,
                                                                        store: {
                                                                            ...data.store,
                                                                            openingHours: {
                                                                                ...(data.store.openingHours || (BRANDING as any).openingHours),
                                                                                [day]: { ...schedule, closed: !schedule.closed }
                                                                            }
                                                                        }
                                                                    })}
                                                                    className={cn(
                                                                        "ml-auto text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all",
                                                                        schedule.closed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                                    )}
                                                                >
                                                                    {schedule.closed ? "Abrir" : "Fechar"}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Taxas de Entrega por Bairro */}
                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-slate-900">Taxas de Entrega (Bairros)</h3>
                                                    <MapPin className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div className="grid gap-2">
                                                    {(data.store.deliveryFees || []).map((bairro: any, index: number) => (
                                                        <div key={bairro.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl">
                                                            <input
                                                                className="flex-1 bg-white border-none rounded-lg p-2 text-xs font-bold"
                                                                value={bairro.name}
                                                                onChange={(e) => {
                                                                    const newFees = [...data.store.deliveryFees];
                                                                    newFees[index].name = e.target.value;
                                                                    setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                                }}
                                                            />
                                                            <div className="flex items-center bg-white rounded-lg px-2">
                                                                <span className="text-[10px] font-bold text-slate-400 mr-1">R$</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-16 bg-white border-none rounded-lg p-2 text-xs font-bold text-right"
                                                                    value={bairro.fee}
                                                                    onChange={(e) => {
                                                                        const newFees = [...data.store.deliveryFees];
                                                                        newFees[index].fee = parseFloat(e.target.value) || 0;
                                                                        setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const newFees = data.store.deliveryFees.filter((_: any, i: number) => i !== index);
                                                                    setData({ ...data, store: { ...data.store, deliveryFees: newFees } });
                                                                }}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => {
                                                            const newBairro = { id: Math.random().toString(36).substr(2, 9), name: "Novo Bairro", fee: 0 };
                                                            setData({ ...data, store: { ...data.store, deliveryFees: [...(data.store.deliveryFees || []), newBairro] } });
                                                        }}
                                                        className="text-xs font-bold text-primary flex items-center gap-1 p-2 hover:bg-primary/5 rounded-xl w-fit transition-all active:scale-95"
                                                    >
                                                        <Plus className="w-4 h-4" /> Adicionar Bairro
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Link de Avaliação */}
                                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center gap-2">
                                                    <ShoppingCart className="w-3 h-3" /> Link de Avaliação (Google/Outro)
                                                </label>
                                                <input
                                                    value={data.store.reviewLink || ''}
                                                    onChange={(e) => setData({ ...data, store: { ...data.store, reviewLink: e.target.value } })}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary/20"
                                                    placeholder="https://g.page/sua-loja/review"
                                                />
                                            </div>

                                            {/* QR Code do Cardápio */}
                                            <div className="space-y-4 pt-6 border-t border-slate-100 flex flex-col items-center bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20">
                                                <div className="text-center space-y-2">
                                                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">📱 QR Code do Cardápio Digital</h3>
                                                    <p className="text-xs text-slate-500 font-bold max-w-md">Clientes escaneiam este QR Code para acessar o cardápio no celular</p>
                                                </div>

                                                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-white">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://192.168.18.2:3000`}
                                                        alt="QR Code"
                                                        className="w-48 h-48"
                                                    />
                                                </div>

                                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 w-full max-w-md">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2 text-center">URL do Cardápio:</p>
                                                    <div className="bg-slate-100 p-3 rounded-xl">
                                                        <p className="text-sm font-mono font-bold text-center text-primary break-all">http://192.168.18.2:3000</p>
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 mt-2 text-center italic">
                                                        ⚠️ Este endereço funciona apenas na sua rede Wi-Fi local
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 flex-wrap justify-center">
                                                    <button
                                                        onClick={() => {
                                                            const win = window.open();
                                                            win?.document.write(`
                                                    <html>
                                                        <head>
                                                            <style>
                                                                body { 
                                                                    display:flex; 
                                                                    flex-direction:column; 
                                                                    align-items:center; 
                                                                    justify-content:center; 
                                                                    height:100vh; 
                                                                    font-family:sans-serif;
                                                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                                    margin:0;
                                                                    padding:40px;
                                                                }
                                                                .container {
                                                                    background:white;
                                                                    padding:60px;
                                                                    border-radius:40px;
                                                                    box-shadow:0 20px 60px rgba(0,0,0,0.3);
                                                                    text-align:center;
                                                                }
                                                                h1 { 
                                                                    margin-bottom:10px;
                                                                    color:#333;
                                                                    font-size:32px;
                                                                }
                                                                .subtitle {
                                                                    color:#666;
                                                                    margin-bottom:40px;
                                                                    font-size:18px;
                                                                }
                                                                img {
                                                                    border:15px solid white;
                                                                    box-shadow:0 10px 40px rgba(0,0,0,0.2);
                                                                    border-radius:30px;
                                                                }
                                                                .url {
                                                                    margin-top:30px;
                                                                    font-size:20px;
                                                                    color:#667eea;
                                                                    font-weight:bold;
                                                                }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            <div class="container">
                                                                <h1>🍔 ${data.store.name}</h1>
                                                                <p class="subtitle">Cardápio Digital</p>
                                                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=http://192.168.18.2:3000" />
                                                                <p class="url">http://192.168.18.2:3000</p>
                                                                <p style="margin-top:20px; color:#999; font-size:14px;">Aponte a câmera do celular para fazer o pedido!</p>
                                                            </div>
                                                            <script>setTimeout(() => { window.print(); }, 500);</script>
                                                        </body>
                                                    </html>
                                                `);
                                                        }}
                                                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-wider hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
                                                    >
                                                        🖨️ Imprimir QR Code
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText('http://192.168.18.2:3000');
                                                            alert('✅ Link copiado! Cole no WhatsApp ou redes sociais.');
                                                        }}
                                                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-wider hover:bg-green-700 transition-all shadow-xl shadow-green-600/30 flex items-center gap-2"
                                                    >
                                                        📋 Copiar Link
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Configuração de Impressão Pro */}
                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                                                        <Save className="w-4 h-4 text-primary" /> Perfis de Impressão
                                                    </h3>
                                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">PRO</span>
                                                </div>

                                                <div className="grid gap-3">
                                                    {[
                                                        { id: 'kitchen', label: 'Cozinha (Somente Itens)', icon: <Utensils className="w-4 h-4" /> },
                                                        { id: 'delivery', label: 'Entrega (Endereço + Itens)', icon: <MapPin className="w-4 h-4" /> },
                                                        { id: 'customer', label: 'Cliente (Recibo Completo)', icon: <ShoppingCart className="w-4 h-4" /> }
                                                    ].map((profile) => (
                                                        <div key={profile.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                                                                    {profile.icon}
                                                                </div>
                                                                <span className="font-bold text-slate-700 text-sm">{profile.label}</span>
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={data.store.printerProfiles?.[profile.id] !== false}
                                                                onChange={(e) => {
                                                                    const profiles = data.store.printerProfiles || {};
                                                                    setData({
                                                                        ...data,
                                                                        store: {
                                                                            ...data.store,
                                                                            printerProfiles: { ...profiles, [profile.id]: e.target.checked }
                                                                        }
                                                                    });
                                                                }}
                                                                className="w-6 h-6 text-primary rounded-lg border-slate-300 focus:ring-primary/20"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(data.orders?.[0] || null);
                                                        setTimeout(() => window.print(), 100);
                                                    }}
                                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-2"
                                                >
                                                    Imprimir Página de Teste
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'banners' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Novo Banner */}
                                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 gap-4">
                                            <div className="p-4 bg-primary/5 rounded-full">
                                                <Images className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-black text-slate-800">Adicionar Novo Banner</h3>
                                                <p className="text-sm text-slate-400">Cole a URL da imagem ou faça upload</p>
                                            </div>
                                            <div className="flex gap-2 w-full max-w-md">
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = (e.target as HTMLInputElement).value;
                                                            if (val) setData((prev: any) => ({ ...prev, banners: [...(prev.banners || []), val] }));
                                                            (e.target as HTMLInputElement).value = '';
                                                        }
                                                    }}
                                                />
                                                <label className="bg-primary text-white px-6 rounded-xl flex items-center justify-center font-bold cursor-pointer hover:bg-primary/90 transition-all">
                                                    Upload
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'banners', (url) => setData((prev: any) => ({ ...prev, banners: [...(prev.banners || []), url] })));
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Lista de Banners */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data.banners?.map((banner: string, index: number) => (
                                                <div key={index} className="relative group rounded-2xl overflow-hidden shadow-md aspect-video bg-slate-100">
                                                    <img src={banner} className="w-full h-full object-cover" alt="Banner" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const newBanners = [...data.banners];
                                                                newBanners.splice(index, 1);
                                                                setData({ ...data, banners: newBanners });
                                                            }}
                                                            className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'coupons' && (
                                <div className="space-y-6">
                                    <button
                                        onClick={addCoupon}
                                        className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98] transition-all"
                                    >
                                        <Plus className="w-5 h-5 text-primary" /> Criar Novo Cupom
                                    </button>

                                    <div className="grid grid-cols-1 gap-4">
                                        {(data.store.coupons || []).map((coupon: any, idx: number) => (
                                            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Código</label>
                                                        <input
                                                            type="text"
                                                            value={coupon.code}
                                                            onChange={(e) => updateCoupon(idx, 'code', e.target.value.toUpperCase())}
                                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 font-black text-slate-700 focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Desconto</label>
                                                        <input
                                                            type="number"
                                                            value={coupon.discount}
                                                            onChange={(e) => updateCoupon(idx, 'discount', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 font-black text-primary focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo</label>
                                                        <select
                                                            value={coupon.type}
                                                            onChange={(e) => updateCoupon(idx, 'type', e.target.value)}
                                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 font-bold text-slate-600 focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="percent">Porcentagem (%)</option>
                                                            <option value="fixed">Valor Fixo (R$)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => deleteCoupon(idx)}
                                                    className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === 'analytics' && (
                                <div className="space-y-10">
                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Vendas Totais', value: `R$ ${data.orders.reduce((acc: number, o: any) => acc + o.total, 0).toFixed(2)}`, icon: <DollarSign />, color: 'bg-green-500' },
                                            { label: 'Total de Pedidos', value: data.orders.length, icon: <ShoppingCart />, color: 'bg-blue-500' },
                                            { label: 'Ticket Médio', value: `R$ ${(data.orders.reduce((acc: number, o: any) => acc + o.total, 0) / (data.orders.length || 1)).toFixed(2)}`, icon: <TrendingUp />, color: 'bg-purple-500' },
                                            { label: 'Bairros Atendidos', value: Array.from(new Set(data.orders.map((o: any) => o.neighborhood))).filter(n => n).length, icon: <MapPin />, color: 'bg-orange-500' }
                                        ].map((kpi, i) => (
                                            <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative group">
                                                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 blur-2xl", kpi.color)}></div>
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg", kpi.color)}>
                                                    {kpi.icon}
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</h3>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Mais Vendidos */}
                                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                                <Utensils className="w-6 h-6 text-primary" /> Produtos Mais Vendidos
                                            </h3>
                                            <div className="space-y-4">
                                                {Object.entries(
                                                    data.orders.flatMap((o: any) => o.items).reduce((acc: any, item: any) => {
                                                        acc[item.name] = (acc[item.name] || 0) + item.quantity;
                                                        return acc;
                                                    }, {})
                                                ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([name, qty]: [any, any], i) => {
                                                    const maxQty = Math.max(...Object.values(data.orders.flatMap((o: any) => o.items).reduce((acc: any, item: any) => { acc[item.name] = (acc[item.name] || 0) + item.quantity; return acc; }, {})) as number[]);
                                                    return (
                                                        <div key={i} className="space-y-2">
                                                            <div className="flex justify-between text-sm font-bold">
                                                                <span className="text-slate-600">{name}</span>
                                                                <span className="text-primary">{qty} un</span>
                                                            </div>
                                                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(qty / maxQty) * 100}%` }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Formas de Pagamento */}
                                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                                <PieChart className="w-6 h-6 text-primary" /> Métodos de Pagamento
                                            </h3>
                                            <div className="space-y-4">
                                                {['PIX', 'CARD', 'CASH'].map((method) => {
                                                    const count = data.orders.filter((o: any) => o.payment === method).length;
                                                    const percentage = (count / (data.orders.length || 1)) * 100;
                                                    return (
                                                        <div key={method} className="flex items-center gap-4">
                                                            <div className="w-12 text-xs font-black text-slate-400 capitalize">{method === 'CASH' ? 'Dinheiro' : method === 'CARD' ? 'Cartão' : 'PIX'}</div>
                                                            <div className="flex-1 h-8 bg-slate-50 rounded-xl overflow-hidden relative">
                                                                <div className={cn(
                                                                    "h-full transition-all duration-1000",
                                                                    method === 'PIX' ? 'bg-green-400' : method === 'CARD' ? 'bg-blue-400' : 'bg-orange-400'
                                                                )} style={{ width: `${percentage}%` }}></div>
                                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-600">
                                                                    {count} pedidos ({percentage.toFixed(0)}%)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            activeTab === 'pdv' && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-2xl">
                                        <h3 className="text-3xl font-black uppercase tracking-tight mb-2">🛒 Ponto de Venda (PDV)</h3>
                                        <p className="text-blue-100 font-medium">Registrar vendas diretas no balcão ou por telefone</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Coluna Esquerda: Produtos */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Busca */}
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar produtos..."
                                                    value={pdvSearch}
                                                    onChange={(e) => setPdvSearch(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm text-lg font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Grid de Produtos */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {data.products
                                                    .filter((p: Product) => p.available && p.name.toLowerCase().includes(pdvSearch.toLowerCase()))
                                                    .map((p: Product) => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => addToPdvCart(p)}
                                                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-500/30 hover:-translate-y-1 transition-all text-left group flex flex-col h-full"
                                                        >
                                                            <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                                                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                                                    <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all" />
                                                                </div>
                                                            </div>
                                                            <h4 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{p.name}</h4>
                                                            <p className="text-blue-600 font-black mt-auto">R$ {p.price.toFixed(2).replace('.', ',')}</p>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Coluna Direita: Carrinho */}
                                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
                                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-[2.5rem]">
                                                <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                                                    <ShoppingCart className="w-5 h-5" /> Carrinho
                                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{pdvCart.reduce((acc, item) => acc + item.quantity, 0)} itens</span>
                                                </h3>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                                {pdvCart.length === 0 ? (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                                        <ShoppingCart className="w-16 h-16 opacity-20" />
                                                        <p className="font-medium text-sm">Seu carrinho está vazio</p>
                                                    </div>
                                                ) : (
                                                    pdvCart.map((item) => (
                                                        <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-2xl group">
                                                            <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-bold text-sm text-slate-800 truncate pr-2">{item.name}</h4>
                                                                    <p className="font-black text-xs text-slate-600 whitespace-nowrap">
                                                                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="flex items-center bg-white rounded-lg border border-slate-200">
                                                                        <button
                                                                            onClick={() => updatePdvQuantity(item.id, -1)}
                                                                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors"
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                                                        <button
                                                                            onClick={() => updatePdvQuantity(item.id, 1)}
                                                                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                    <input
                                                                        placeholder="Obs..."
                                                                        value={item.observation}
                                                                        onChange={(e) => {
                                                                            setPdvCart(prev => prev.map(i => i.id === item.id ? { ...i, observation: e.target.value } : i));
                                                                        }}
                                                                        className="flex-1 bg-transparent text-[10px] border-b border-transparent focus:border-slate-300 outline-none px-1"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem] space-y-4">
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <input
                                                                placeholder="Nome do Cliente (Opcional)"
                                                                value={pdvCustomer.name}
                                                                onChange={(e) => setPdvCustomer({ ...pdvCustomer, name: e.target.value })}
                                                                className="w-full pl-9 pr-3 py-2 rounded-xl border-none text-xs font-bold focus:ring-2 focus:ring-blue-500/20"
                                                            />
                                                        </div>
                                                        <div className="relative w-1/3">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <input
                                                                placeholder="Telefone"
                                                                value={pdvCustomer.phone}
                                                                onChange={(e) => setPdvCustomer({ ...pdvCustomer, phone: e.target.value })}
                                                                className="w-full pl-9 pr-3 py-2 rounded-xl border-none text-xs font-bold focus:ring-2 focus:ring-blue-500/20"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2">
                                                        {['Dinheiro', 'Cartão', 'PIX'].map(method => (
                                                            <button
                                                                key={method}
                                                                onClick={() => setPdvPayment(method)}
                                                                className={cn(
                                                                    "py-2 rounded-xl text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1",
                                                                    pdvPayment === method
                                                                        ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20 scale-105"
                                                                        : "bg-white text-slate-400 hover:bg-white hover:text-slate-600"
                                                                )}
                                                            >
                                                                {method === 'Dinheiro' && <Banknote className="w-4 h-4" />}
                                                                {method === 'Cartão' && <CreditCard className="w-4 h-4" />}
                                                                {method === 'PIX' && <TrendingUp className="w-4 h-4" />}
                                                                {method}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-end justify-between border-t border-slate-200 pt-4">
                                                    <div>
                                                        <p className="text-xs text-slate-400 font-bold uppercase">Total a Pagar</p>
                                                        <p className="text-3xl font-black text-slate-800">
                                                            R$ {pdvCart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={finishPdvSale}
                                                        disabled={pdvCart.length === 0}
                                                        className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-green-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        <Save className="w-5 h-5" /> Finalizar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </main>
                </div>

                {printableOrder && (
                    <div id="printable-area" className="text-black bg-white">
                        {printType === 'kitchen' && (
                            <div className="receipt-section kitchen h-auto mb-10 border-b-2 border-dashed border-black pb-8">
                                <div className="text-[14px] font-black text-center mb-2 uppercase">*** VIA COZINHA ***</div>
                                <div className="text-center mb-4">
                                    <p className="text-[12px] font-bold">PEDIDO: #{printableOrder.id}</p>
                                    <p className="text-[10px]">{printableOrder.date}</p>
                                </div>
                                <div className="space-y-2">
                                    {Array.isArray(printableOrder.items) && printableOrder.items.map((item: any, i: number) => (
                                        <div key={i} className="border-b border-black pb-1 last:border-0">
                                            <div className="flex justify-between font-black text-[13px]">
                                                <span>{item.quantity}x {item.name}</span>
                                            </div>
                                            {item.extras && item.extras.length > 0 && (
                                                <div className="pl-4 text-[11px] font-bold italic">
                                                    + {item.extras.map((e: any) => e.name).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {printableOrder.observation && (
                                    <div className="mt-4 p-2 border-2 border-black rounded-lg">
                                        <p className="text-[11px] font-black uppercase">OBSERVAÇÕES:</p>
                                        <p className="text-[12px] font-bold">{printableOrder.observation}</p>
                                    </div>
                                )}
                                <div className="text-center mt-6 text-[10px] font-black uppercase">-- FIM DA VIA COZINHA --</div>
                            </div>
                        )}

                        {printType === 'customer' && (
                            <>
                                <div className="receipt-section delivery h-auto mb-10 border-b-2 border-dashed border-black pb-8">
                                    <div className="text-[14px] font-black text-center mb-2 uppercase">*** VIA ENTREGA ***</div>
                                    <div className="text-center mb-4">
                                        <p className="text-[12px] font-bold">{data?.store?.name || 'Sistema'}</p>
                                        <p className="text-[12px] font-black">PEDIDO: #{printableOrder.id}</p>
                                    </div>

                                    <div className="mb-4 p-2 bg-black text-white rounded-lg">
                                        <p className="text-[11px] font-black uppercase">CLIENTE / ENDEREÇO:</p>
                                        <p className="text-[13px] font-black">{printableOrder.customer?.name || "Cliente"}</p>
                                        <p className="text-[13px] font-bold">{printableOrder.customer?.address || printableOrder.address || "Retirada no Local"}</p>
                                        {printableOrder.customer?.neighborhood && <p className="text-[12px] font-bold">Bairro: {printableOrder.customer.neighborhood}</p>}
                                    </div>

                                    <div className="space-y-1 mb-4">
                                        {Array.isArray(printableOrder.items) && printableOrder.items.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-[11px]">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-black pt-2 font-black">
                                        <div className="flex justify-between text-[14px]">
                                            <span>TOTAL A COBRAR:</span>
                                            <span>R$ {(printableOrder.total || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="text-[13px] uppercase mt-1">PAGAMENTO: {printableOrder.payment || 'N/A'}</div>
                                    </div>
                                    <div className="text-center mt-6 text-[10px] font-black uppercase">-- FIM DA VIA ENTREGA --</div>
                                </div>

                                <div className="receipt-section customer h-auto">
                                    <div className="text-[12px] font-black text-center mb-2 uppercase">*** RECIBO DO CLIENTE ***</div>
                                    <div className="text-center mb-4">
                                        <h3 className="font-black text-[16px] uppercase">{data?.store?.name || 'Sistema'}</h3>
                                        <p className="text-[10px] font-normal">{data?.store?.address || ''}</p>
                                        <p className="text-[10px] font-normal">{printableOrder.date}</p>
                                    </div>

                                    <div className="space-y-1 mb-4 border-t border-b border-black py-2">
                                        {Array.isArray(printableOrder.items) && printableOrder.items.map((item: any, i: number) => (
                                            <div key={i} className="space-y-0.5">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    <span>R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                                </div>
                                                {Array.isArray(item.extras) && item.extras.map((e: any, ei: number) => (
                                                    <div key={ei} className="flex justify-between text-[10px] pl-4 italic opacity-80">
                                                        <span>+ {e.name}</span>
                                                        <span>R$ {(e.price || 0).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-1 text-[11px] font-black">
                                        <div className="flex justify-between text-[15px]">
                                            <span>TOTAL:</span>
                                            <span>R$ {(printableOrder.total || 0).toFixed(2)}</span>
                                        </div>
                                        <p className="uppercase">PAGAMENTO: {printableOrder.payment || 'N/A'}</p>
                                    </div>

                                    <div className="text-center mt-6 pt-4 border-t border-dashed border-black">
                                        <p className="text-[11px] font-bold">Obrigado pela preferência!</p>
                                        <p className="text-[10px] mt-1">Siga-nos no Instagram</p>
                                    </div>
                                    <div className="text-center mt-8 text-[9px] font-black opacity-30 tracking-widest">
                                        - DELIVERY PRO SYSTEM -
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="h-20 no-print"></div>
                        <button
                            onClick={() => { setPrintableOrder(null); setPrintType(null); }}
                            className="no-print mt-4 w-full bg-slate-100 text-slate-400 py-2 text-[10px] font-bold uppercase rounded-lg"
                        >
                            Fechar Visualização
                        </button>
                    </div>
                )}
            </>
        );
    } catch (e: any) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-500 text-white p-10">
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-4">CRITICAL ERROR</h1>
                    <p className="font-mono bg-black/20 p-4 rounded-xl">{e.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 bg-white text-red-600 px-6 py-3 rounded-xl font-bold">RECARREGAR</button>
                </div>
            </div>
        );
    }
}

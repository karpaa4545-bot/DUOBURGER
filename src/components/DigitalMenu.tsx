"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Info, User, Plus, Minus, X, ArrowRight, MessageCircle, ChevronRight, MapPin, Copy, Check, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../lib/data';
import { BRANDING } from '../lib/branding';

export default function DigitalMenu() {
    const [data, setData] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [cart, setCart] = useState<{ product: Product; quantity: number; selectedExtras: any[] }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<string>("");
    const [observation, setObservation] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [savingOrder, setSavingOrder] = useState(false);
    const [neighborhood, setNeighborhood] = useState<{ name: string; fee: number } | null>(null);

    // Modal de Produto
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedExtras, setSelectedExtras] = useState<any[]>([]);

    // Acompanhamento de Pedido
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [lastOrder, setLastOrder] = useState<any>(null);

    // Cupons
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState("");

    // Carregar pedido do localStorage
    useEffect(() => {
        const savedId = localStorage.getItem('last_order_id');
        if (savedId) setLastOrderId(savedId);
    }, []);

    // Polling do status do pedido (a cada 20 segundos se houver um pedido ativo)
    useEffect(() => {
        if (!lastOrderId) return;

        const checkStatus = () => {
            fetch('/api/data')
                .then(res => res.json())
                .then(json => {
                    const order = json.orders?.find((o: any) => o.id === lastOrderId);
                    if (order) setLastOrder(order);
                });
        };

        checkStatus();
        const interval = setInterval(checkStatus, 20000);
        return () => clearInterval(interval);
    }, [lastOrderId]);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, []);

    const isStoreOpen = () => {
        const hours = data?.store?.openingHours || (BRANDING as any).openingHours;
        if (!hours) return true;

        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[now.getDay()];
        const schedule = hours[today];

        if (!schedule || schedule.closed) return false;

        const nowTotal = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = schedule.open.split(':').map(Number);
        const [closeH, closeM] = schedule.close.split(':').map(Number);

        const openTotal = openH * 60 + openM;
        const closeTotal = closeH * 60 + closeM;

        if (closeTotal < openTotal) {
            return nowTotal >= openTotal || nowTotal <= closeTotal;
        }

        return nowTotal >= openTotal && nowTotal <= closeTotal;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const filteredProducts = data.products.filter((p: Product) =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        p.available
    );

    const addToCart = (product: Product, extras: any[] = []) => {
        setCart(prev => {
            // Verifica se já existe o mesmo produto com EXATAMENTE os mesmos adicionais
            const existing = prev.find(item =>
                item.product.id === product.id &&
                JSON.stringify(item.selectedExtras.sort()) === JSON.stringify(extras.sort())
            );

            if (existing) {
                return prev.map(item =>
                    (item.product.id === product.id && JSON.stringify(item.selectedExtras.sort()) === JSON.stringify(extras.sort()))
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, selectedExtras: extras }];
        });
    };

    const removeFromCart = (productId: string, extras: any[] = []) => {
        setCart(prev => {
            const existing = prev.find(item =>
                item.product.id === productId &&
                JSON.stringify(item.selectedExtras.sort()) === JSON.stringify(extras.sort())
            );

            if (existing && existing.quantity > 1) {
                return prev.map(item =>
                    (item.product.id === productId && JSON.stringify(item.selectedExtras.sort()) === JSON.stringify(extras.sort()))
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            return prev.filter(item =>
                !(item.product.id === productId && JSON.stringify(item.selectedExtras.sort()) === JSON.stringify(extras.sort()))
            );
        });
    };

    const getItemPrice = (item: any) => {
        const extrasTotal = item.selectedExtras.reduce((acc: number, e: any) => acc + e.price, 0);
        return (item.product.price + extrasTotal) * item.quantity;
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + getItemPrice(item), 0);

    const discountAmount = appliedCoupon ? (
        appliedCoupon.type === 'percent'
            ? subtotal * (appliedCoupon.discount / 100)
            : appliedCoupon.discount
    ) : 0;

    const totalPrice = Math.max(0, subtotal - discountAmount + (neighborhood?.fee || 0));

    const applyCoupon = () => {
        const coupon = data.store.coupons?.find((c: any) => c.code.toUpperCase() === couponCode.toUpperCase());
        if (coupon) {
            setAppliedCoupon(coupon);
            setCouponError("");
        } else {
            setAppliedCoupon(null);
            setCouponError("Cupom inválido");
        }
    };

    const getLocation = () => {
        setLocationStatus("Obtendo localização...");
        if (!navigator.geolocation) {
            setLocationStatus("Seu navegador não suporta GPS.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationStatus("Localização obtida com sucesso!");
            },
            () => {
                setLocationStatus("Erro ao obter localização. Verifique as permissões.");
            }
        );
    };

    const formatWhatsAppMessage = () => {
        let message = `*Pedido - ${data.store.name}*\n\n`;
        message += `*Cliente:* ${customerName || 'Não informado'}\n`;
        message += `*Telefone:* ${customerPhone || 'Não informado'}\n\n`;
        cart.forEach(item => {
            const extrasText = item.selectedExtras.length > 0
                ? `\n   + ${item.selectedExtras.map(e => e.name).join(', ')}`
                : '';
            const itemTotal = getItemPrice(item);
            message += `• ${item.quantity}x ${item.product.name}${extrasText} - R$ ${itemTotal.toFixed(2)}\n`;
        });
        message += `\n*Subtotal: R$ ${subtotal.toFixed(2)}*`;
        if (appliedCoupon) {
            message += `\n*Desconto (${appliedCoupon.code}): - R$ ${discountAmount.toFixed(2)}*`;
        }
        if (neighborhood) {
            message += `\n*Entrega (${neighborhood.name}): R$ ${neighborhood.fee.toFixed(2)}*`;
        }
        message += `\n*Total: R$ ${totalPrice.toFixed(2)}*\n\n`;

        if (location) {
            message += `*Localização GPS:* https://maps.google.com/?q=${location.lat},${location.lng}\n`;
        } else {
            message += `*Endereço:* (Cliente não enviou GPS)\n`;
        }

        if (neighborhood) {
            message += `*Bairro:* ${neighborhood.name}\n`;
        }

        if (observation) {
            message += `\n*Observação / Mesa:* ${observation}\n`;
        }

        message += `*Forma de Pagamento:* ${paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'CARD' ? 'Cartão (Levar Maquininha)' : 'Dinheiro'}\n`;

        if (paymentMethod === 'PIX') {
            message += `\n🚨 *Atenção:* Por favor, envie o *COMPROVANTE DO PIX* logo abaixo para podermos preparar o seu pedido!`;
        }

        return encodeURIComponent(message);
    };

    const checkout = async () => {
        setSavingOrder(true);
        const orderData = {
            id: Math.random().toString(36).substr(2, 9),
            customer: {
                name: customerName,
                phone: customerPhone
            },
            items: cart.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price + item.selectedExtras.reduce((acc, e) => acc + e.price, 0),
                extras: item.selectedExtras.map(e => e.name).join(', ')
            })),
            total: totalPrice,
            subtotal: subtotal,
            discount: discountAmount,
            coupon: appliedCoupon?.code || '',
            deliveryFee: neighborhood?.fee || 0,
            neighborhood: neighborhood?.name || '',
            payment: paymentMethod,
            observation: observation,
            location: location,
            date: new Date().toLocaleString('pt-BR'),
            status: 'Pendente'
        };

        // Dedução de estoque
        const updatedProducts = data.products.map((p: Product) => {
            const cartItems = cart.filter(item => item.product.id === p.id);
            if (cartItems.length > 0 && p.trackStock) {
                const totalSold = cartItems.reduce((acc, item) => acc + item.quantity, 0);
                return { ...p, stock: Math.max(0, (p.stock || 0) - totalSold) };
            }
            return p;
        });

        try {
            // Salva o pedido no banco de dados (Gist) e atualiza o estoque
            const newData = { ...data, orders: [orderData, ...(data.orders || [])], products: updatedProducts };
            const response = await fetch('/api/data', {
                method: 'POST',
                body: JSON.stringify(newData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar pedido");
            }

            // Salva ID para acompanhamento
            localStorage.setItem('last_order_id', orderData.id);
            setLastOrderId(orderData.id);
            setLastOrder(orderData);

            const cleanPhone = data.store.whatsapp.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${formatWhatsAppMessage()}`;
            window.location.href = whatsappUrl;

            // Limpa o carrinho e avisa o cliente (pode ser um alert simples ou apenas redirecionar)
            setCart([]);
            setObservation("");
            setPaymentMethod("");
            setIsCartOpen(false);
        } catch (error: any) {
            console.error("Erro ao salvar pedido:", error);

            // Alerta o erro real para o dono saber o que falta configurar
            alert(`Aviso: O pedido será enviado ao WhatsApp, mas não foi salvo no Painel Admin.\nMotivo: ${error.message}`);

            // Mesmo com erro no Admin, abre o WhatsApp para não perder a venda
            const cleanPhone = data.store.whatsapp.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${formatWhatsAppMessage()}`;
            window.location.href = whatsappUrl;

            setCart([]);
            setIsCartOpen(false);
        } finally {
            setSavingOrder(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-muted/30 pb-20 font-sans text-foreground">


            {/* Header Area */}
            <header className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white p-4 sticky top-0 z-50 shadow-xl overflow-hidden print:hidden">
                {/* Efeito de brilho de fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center shrink-0">
                            {data.store.logo ? (
                                <img
                                    src={data.store.logo}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-primary font-black text-xl">${data.store.name[0]}</span>`;
                                    }}
                                />
                            ) : (
                                <span className="text-primary font-black text-xl">{data.store.name[0]}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">{data.store.name}</h1>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[10px] text-white/80 flex items-center gap-1 font-medium">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full animate-pulse",
                                        isStoreOpen() ? "bg-green-400" : "bg-red-400"
                                    )}></span>
                                    {isStoreOpen() ? "ESTAMOS ABERTOS" : "FECHADO AGORA"}
                                </p>
                                {data.store.deliveryTime && (
                                    <p className="text-[9px] text-white/70 flex items-center gap-1 font-bold">
                                        <Clock className="w-2.5 h-2.5" /> MÉDIA: {data.store.deliveryTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Info className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><User className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="O que você deseja pedir?"
                        className="w-full bg-white text-foreground rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-inner border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Banners Carousel */}
            {data.banners && data.banners.length > 0 && (
                <div className="pt-4 px-4 overflow-x-auto no-scrollbar flex gap-4 snap-x print:hidden">
                    {data.banners.map((banner: string, idx: number) => (
                        <div key={idx} className="min-w-[85%] sm:min-w-[400px] h-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg border border-black/5 snap-center shrink-0">
                            <img src={banner} className="w-full h-full object-cover" alt="Banner" />
                        </div>
                    ))}
                </div>
            )}

            {/* Categories Horizontal Scroll */}
            <div className="bg-white shadow-sm sticky top-[138px] z-40 overflow-x-auto no-scrollbar flex items-center gap-4 p-4 border-b print:hidden">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                        "flex flex-col items-center min-w-[70px] transition-all",
                        activeCategory === "all" ? "text-primary scale-105" : "text-muted-foreground opacity-60"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-1 border-2 transition-all",
                        activeCategory === "all" ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30"
                    )}>
                        <Menu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">TODAS</span>
                </button>

                {data.categories.map((cat: any) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "flex flex-col items-center min-w-[70px] transition-all",
                            activeCategory === cat.id ? "text-primary scale-105" : "text-muted-foreground opacity-60"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-1 border-2 transition-all",
                            activeCategory === cat.id ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30"
                        )}>
                            <span className="font-black text-lg">{cat.name[0]}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Product List */}
            <main className="p-4 flex flex-col gap-4 max-w-3xl mx-auto w-full">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic">
                        <Search className="w-12 h-12 mb-2 opacity-10" />
                        <p>Nenhum produto encontrado...</p>
                    </div>
                ) : (
                    filteredProducts.map((product: Product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex items-stretch h-32 hover:border-primary/20 transition-all hover:shadow-md group active:scale-[0.98]"
                        >
                            <div className="w-32 h-full flex-shrink-0 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"; // Classic Burger fallback
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="flex-1 p-3 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-foreground text-sm leading-tight">{product.name}</h3>
                                    </div>
                                    <p className="text-muted-foreground text-[11px] line-clamp-2 mt-1 leading-snug">{product.description}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary font-black text-base">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <button
                                        disabled={product.trackStock && (product.stock || 0) <= 0}
                                        onClick={() => {
                                            if (product.extras && product.extras.length > 0) {
                                                setSelectedProduct(product);
                                                setSelectedExtras([]);
                                            } else {
                                                addToCart(product);
                                            }
                                        }}
                                        className={cn(
                                            "bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-90 transition-all",
                                            product.trackStock && (product.stock || 0) <= 0 && "opacity-20 grayscale pointer-events-none"
                                        )}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500 max-w-lg mx-auto">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-primary text-white h-16 rounded-2xl shadow-2xl flex items-center justify-between px-6 font-bold group hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative bg-white/10 p-2 rounded-xl">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                                    {totalItems}
                                </span>
                            </div>
                            <span className="uppercase tracking-tight">Ver Carrinho</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-secondary text-lg">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            )}

            {/* Cart Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom duration-500">
                        <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                            <h2 className="font-bold text-xl flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-primary" />
                                Seu Carrinho
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-4 py-2 border-b border-muted/50 last:border-0">
                                    <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{item.product.name}</h4>
                                        {item.selectedExtras.length > 0 && (
                                            <p className="text-[10px] text-slate-400 line-clamp-1">
                                                + {item.selectedExtras.map((e: any) => e.name).join(', ')}
                                            </p>
                                        )}
                                        <p className="text-primary font-bold text-sm">R$ {getItemPrice(item).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-muted/30 rounded-full px-2 py-1">
                                        <button
                                            onClick={() => removeFromCart(item.product.id, item.selectedExtras)}
                                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item.product, item.selectedExtras)}
                                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-dashed border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3">Observações / Mesa</h4>
                                <textarea
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    placeholder="Ex: Sem cebola, ou Mesa 12..."
                                    className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                />
                            </div>

                            <div className="pt-4 border-t border-dashed border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Entrega
                                </h4>
                                <button
                                    onClick={getLocation}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold mb-4",
                                        location ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 hover:border-primary text-slate-600 hover:text-primary"
                                    )}
                                >
                                    <MapPin className="w-5 h-5" />
                                    {location ? "Localização Salva!" : "Usar Minha Localização GPS"}
                                </button>
                                {locationStatus && <p className="text-xs text-center text-slate-500 -mt-2 mb-4">{locationStatus}</p>}

                                {/* Seleção de Bairro / Taxa de Entrega */}
                                {data.store.deliveryFees && data.store.deliveryFees.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Selecione seu Bairro</p>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-primary focus:ring-0 transition-all cursor-pointer"
                                            value={neighborhood?.name || ""}
                                            onChange={(e) => {
                                                const selected = data.store.deliveryFees.find((f: any) => f.name === e.target.value);
                                                setNeighborhood(selected || null);
                                            }}
                                        >
                                            <option value="">Selecione seu bairro...</option>
                                            {data.store.deliveryFees.map((f: any) => (
                                                <option key={f.id} value={f.name}>
                                                    {f.name} - R$ {f.fee.toFixed(2)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-dashed border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                    <X className="w-4 h-4 text-primary rotate-45" /> Cupom de Desconto
                                </h4>
                                <div className="flex gap-2">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Código do Cupom"
                                        className="flex-1 bg-slate-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-slate-900 text-white px-4 rounded-xl text-xs font-bold uppercase transition-all active:scale-95"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                                {couponError && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{couponError}</p>}
                                {appliedCoupon && (
                                    <p className="text-[10px] text-green-600 font-bold mt-1 ml-1 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Cupom {appliedCoupon.code} aplicado! (- R$ {discountAmount.toFixed(2)})
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-dashed border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3">Forma de Pagamento</h4>
                                <div className="space-y-2">
                                    {data.store.pixKey && (
                                        <label className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            paymentMethod === 'PIX' ? "border-green-500 bg-green-50" : "border-slate-100 hover:border-slate-200"
                                        )}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-4 h-4 text-green-500 focus:ring-green-500"
                                                checked={paymentMethod === 'PIX'}
                                                onChange={() => setPaymentMethod('PIX')}
                                            />
                                            <div className="flex-1">
                                                <span className="font-bold block">PIX</span>
                                                {paymentMethod === 'PIX' && (
                                                    <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                                        <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
                                                            <span className="text-xs text-slate-500 font-mono truncate flex-1">{data.store.pixKey}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigator.clipboard.writeText(data.store.pixKey || '');
                                                                    alert("Chave PIX copiada!");
                                                                }}
                                                                className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                                                            <Check className="w-3 h-3" />
                                                            Envie o comprovante no WhatsApp após finalizar!
                                                        </p>
                                                        {data.store.pixQrCode && (
                                                            <div className="flex justify-center bg-white p-2 rounded-lg border border-slate-100">
                                                                <img src={data.store.pixQrCode} alt="QR Code PIX" className="w-32 h-32 object-contain" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    )}

                                    {data.store.acceptsCard && (
                                        <label className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            paymentMethod === 'CARD' ? "border-green-500 bg-green-50" : "border-slate-100 hover:border-slate-200"
                                        )}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-4 h-4 text-green-500 focus:ring-green-500"
                                                checked={paymentMethod === 'CARD'}
                                                onChange={() => setPaymentMethod('CARD')}
                                            />
                                            <div className="flex-1">
                                                <span className="font-bold block">Cartão</span>
                                                <span className="text-xs text-slate-500">Levamos a maquininha</span>
                                            </div>
                                        </label>
                                    )}

                                    {data.store.acceptsCash && (
                                        <label className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            paymentMethod === 'CASH' ? "border-green-500 bg-green-50" : "border-slate-100 hover:border-slate-200"
                                        )}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-4 h-4 text-green-500 focus:ring-green-500"
                                                checked={paymentMethod === 'CASH'}
                                                onChange={() => setPaymentMethod('CASH')}
                                            />
                                            <div className="flex-1">
                                                <span className="font-bold block">Dinheiro / Espécie</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/10 space-y-4 border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">


                            <div className="space-y-2 py-2 border-b border-white/20">
                                <div className="flex items-center justify-between text-sm opacity-80">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex items-center justify-between text-sm text-green-500 font-bold">
                                        <span>Desconto ({appliedCoupon.code})</span>
                                        <span>- R$ {discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {neighborhood && (
                                    <div className="flex items-center justify-between text-sm opacity-80">
                                        <span>Entrega ({neighborhood.name})</span>
                                        <span>R$ {neighborhood.fee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xl font-black">
                                <span className="text-muted-foreground">Total</span>
                                <span className="text-secondary">R$ {totalPrice.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={checkout}
                                disabled={cart.length === 0 || !paymentMethod || savingOrder}
                                className="w-full bg-primary text-white h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:active:scale-100"
                            >
                                {savingOrder ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <MessageCircle className="w-6 h-6" />
                                        Finalizar no WhatsApp
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                O pedido será enviado direto para o nosso WhatsApp
                            </p>
                        </div>
                    </div>
                </div>
            )
            }
            {/* Modal de Detalhes / Adicionais */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom duration-500">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-10 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative h-64 w-full">
                            <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-2xl font-black text-white">{selectedProduct.name}</h2>
                                <p className="text-white/70 text-sm line-clamp-2 mt-1">{selectedProduct.description}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedProduct.extras && selectedProduct.extras.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-primary" /> Turbinar seu pedido?
                                        </h3>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">OPCIONAL</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedProduct.extras.map((extra: any) => (
                                            <label
                                                key={extra.id}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                                    selectedExtras.find(e => e.id === extra.id)
                                                        ? "border-primary bg-primary/5"
                                                        : "border-slate-50 hover:border-slate-100"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded-lg text-primary border-slate-300 focus:ring-primary/20"
                                                        checked={!!selectedExtras.find(e => e.id === extra.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedExtras(prev => [...prev, extra]);
                                                            } else {
                                                                setSelectedExtras(prev => prev.filter(item => item.id !== extra.id));
                                                            }
                                                        }}
                                                    />
                                                    <span className="font-bold text-slate-700">{extra.name}</span>
                                                </div>
                                                <span className="font-black text-primary text-sm">+ R$ {extra.price.toFixed(2)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-500 text-xs">
                                Utilize as observações no carrinho para retirar itens (ex: sem cebola).
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total do Item</p>
                                <p className="text-xl font-black text-primary">
                                    R$ {(selectedProduct.price + selectedExtras.reduce((acc, e) => acc + e.price, 0)).toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    addToCart(selectedProduct, selectedExtras);
                                    setSelectedProduct(null);
                                }}
                                className="bg-primary text-white h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                                Adicionar
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

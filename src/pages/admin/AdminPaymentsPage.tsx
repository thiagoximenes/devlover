import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DollarSign, Search, Download, Filter, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Payment {
    id: string;
    user_id: string;
    amount: string;
    status: string;
    payment_method: string;
    created_at: string;
    user: {
        full_name: string;
        email: string;
    };
    plan: {
        name: string;
    };
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [periodFilter, setPeriodFilter] = useState<string>("all");
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, statusFilter, periodFilter, payments]);

    const fetchPayments = async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select(`
          id,
          user_id,
          amount,
          status,
          payment_method,
          created_at,
          profiles!inner (
            full_name,
            email
          ),
          subscriptions!inner (
            plans (
              name
            )
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match interface
            const paymentsData: Payment[] = data?.map(payment => ({
                id: payment.id,
                user_id: payment.user_id,
                amount: payment.amount,
                status: payment.status,
                payment_method: payment.payment_method,
                created_at: payment.created_at,
                user: {
                    full_name: payment.profiles.full_name,
                    email: payment.profiles.email,
                },
                plan: {
                    name: payment.subscriptions.plans.name,
                },
            })) || [];

            setPayments(paymentsData);
            setFilteredPayments(paymentsData);

            // Calculate total revenue
            const total = paymentsData
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0);
            setTotalRevenue(total);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error("Erro ao carregar pagamentos");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...payments];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(payment =>
                payment.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }

        // Period filter
        if (periodFilter !== "all") {
            const now = new Date();
            let startDate: Date;
            let endDate: Date = now;

            switch (periodFilter) {
                case "current_month":
                    startDate = startOfMonth(now);
                    endDate = endOfMonth(now);
                    break;
                case "last_month":
                    startDate = startOfMonth(subMonths(now, 1));
                    endDate = endOfMonth(subMonths(now, 1));
                    break;
                case "last_3_months":
                    startDate = subMonths(now, 3);
                    break;
                default:
                    startDate = new Date(0);
            }

            filtered = filtered.filter(payment => {
                const paymentDate = new Date(payment.created_at);
                return paymentDate >= startDate && paymentDate <= endDate;
            });
        }

        setFilteredPayments(filtered);

        // Recalculate total for filtered results
        const total = filtered
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        setTotalRevenue(total);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            completed: { label: 'Concluído', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
            pending: { label: 'Pendente', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
            failed: { label: 'Falhou', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
            refunded: { label: 'Reembolsado', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
        };

        const statusInfo = statusMap[status] || { label: status, className: '' };

        return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
    };

    const handleExportCSV = () => {
        // Create CSV content
        const headers = ['Data', 'Usuário', 'Email', 'Plano', 'Valor', 'Status', 'Método'];
        const rows = filteredPayments.map(payment => [
            format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
            payment.user.full_name,
            payment.user.email,
            payment.plan.name,
            `R$ ${payment.amount}`,
            payment.status,
            payment.payment_method,
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pagamentos-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Relatório exportado com sucesso");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Carregando pagamentos...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="h-6 w-6" />
                        Histórico de Pagamentos
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize e exporte todas as transações do sistema
                    </p>
                </div>
                <Button onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                </Button>
            </div>

            {/* Revenue Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Receita Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Baseado nos filtros aplicados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Transações
                        </CardTitle>
                        <Filter className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredPayments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Transações encontradas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Taxa de Sucesso
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filteredPayments.length > 0
                                ? ((filteredPayments.filter(p => p.status === 'completed').length / filteredPayments.length) * 100).toFixed(1)
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Pagamentos concluídos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Filtre transações por usuário, período ou status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="failed">Falhou</SelectItem>
                                <SelectItem value="refunded">Reembolsado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={periodFilter} onValueChange={setPeriodFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os períodos</SelectItem>
                                <SelectItem value="current_month">Mês atual</SelectItem>
                                <SelectItem value="last_month">Mês passado</SelectItem>
                                <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transações</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Método</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhuma transação encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {format(new Date(payment.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(payment.created_at), "HH:mm", { locale: ptBR })}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{payment.user.full_name}</p>
                                                <p className="text-xs text-muted-foreground">{payment.user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{payment.plan.name}</TableCell>
                                        <TableCell className="font-semibold">R$ {payment.amount}</TableCell>
                                        <TableCell className="capitalize">{payment.payment_method}</TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

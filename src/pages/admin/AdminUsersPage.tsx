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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, Search, Eye, Edit, Ban, Trash2, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface UserData {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    subscription: {
        id: string;
        status: string;
        plan: {
            name: string;
            price: string;
        };
        current_period_end: string;
    } | null;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [planFilter, setPlanFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, statusFilter, planFilter, users]);

    const fetchUsers = async () => {
        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select(`
          id,
          email,
          full_name,
          avatar_url,
          created_at
        `);

            if (profilesError) throw profilesError;

            // Fetch subscriptions
            const { data: subscriptions } = await supabase
                .from('subscriptions')
                .select(`
          id,
          user_id,
          status,
          current_period_end,
          plan_id,
          plans (
            name,
            price
          )
        `)
                .eq('status', 'active');

            // Merge subscriptions with profiles
            const usersData: UserData[] = profiles?.map(profile => {
                const subscription = subscriptions?.find(sub => sub.user_id === profile.id);
                return {
                    ...profile,
                    subscription: subscription ? {
                        id: subscription.id,
                        status: subscription.status,
                        plan: {
                            name: subscription.plans.name,
                            price: subscription.plans.price,
                        },
                        current_period_end: subscription.current_period_end,
                    } : null,
                };
            }) || [];

            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...users];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(user => {
                if (statusFilter === "active") return user.subscription !== null;
                if (statusFilter === "inactive") return user.subscription === null;
                return true;
            });
        }

        // Plan filter
        if (planFilter !== "all") {
            filtered = filtered.filter(user =>
                user.subscription?.plan.name === planFilter
            );
        }

        setFilteredUsers(filtered);
    };

    const handleBlockUser = async (userId: string) => {
        try {
            // Implement block logic (could update a 'blocked' field in profiles)
            toast.success("Usuário bloqueado com sucesso");
            fetchUsers();
        } catch (error) {
            console.error('Error blocking user:', error);
            toast.error("Erro ao bloquear usuário");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            toast.success("Usuário excluído com sucesso");
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error("Erro ao excluir usuário");
        }
    };

    const getStatusBadge = (user: UserData) => {
        if (user.subscription) {
            return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Ativo</Badge>;
        }
        return <Badge variant="secondary">Inativo</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Carregando usuários...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Gerenciamento de Usuários
                </h1>
                <p className="text-muted-foreground">
                    Visualize, edite e gerencie todos os usuários do sistema
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Busque e filtre usuários por nome, email, status ou plano</CardDescription>
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
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Plano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os planos</SelectItem>
                                <SelectItem value="Mensal">Mensal</SelectItem>
                                <SelectItem value="Semestral">Semestral</SelectItem>
                                <SelectItem value="Anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Cadastro</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhum usuário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.full_name || 'Sem nome'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getStatusBadge(user)}</TableCell>
                                        <TableCell>
                                            {user.subscription ? (
                                                <div>
                                                    <p className="font-medium">{user.subscription.plan.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        R$ {user.subscription.plan.price}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Dialog open={isDetailsOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                                                    setIsDetailsOpen(open);
                                                    if (open) setSelectedUser(user);
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Ver detalhes">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Detalhes do Usuário</DialogTitle>
                                                            <DialogDescription>
                                                                Informações completas sobre o usuário
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                                                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">{user.full_name}</h3>
                                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Status:</span>
                                                                    <span>{getStatusBadge(user)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Plano:</span>
                                                                    <span>{user.subscription?.plan.name || 'Nenhum'}</span>
                                                                </div>
                                                                {user.subscription && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Vencimento:</span>
                                                                        <span>
                                                                            {format(new Date(user.subscription.current_period_end), "dd/MM/yyyy", { locale: ptBR })}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Cadastrado em:</span>
                                                                    <span>
                                                                        {format(new Date(user.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button variant="ghost" size="icon" title="Editar">
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Bloquear">
                                                            <Ban className="h-4 w-4 text-orange-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Bloquear usuário?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                O usuário {user.full_name} será bloqueado e não poderá acessar o sistema.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleBlockUser(user.id)}>
                                                                Bloquear
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Excluir">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Todos os dados do usuário {user.full_name} serão permanentemente removidos.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
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

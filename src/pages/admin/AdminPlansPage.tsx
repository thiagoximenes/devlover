import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard, Edit, Plus, DollarSign, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface Plan {
    id: string;
    name: string;
    price: string;
    duration_months: number;
    is_active: boolean;
    created_at: string;
    features: string[];
}

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration_months: 1,
        is_active: true,
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('duration_months', { ascending: true });

            if (error) throw error;

            setPlans(data || []);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error("Erro ao carregar planos");
        } finally {
            setLoading(false);
        }
    };

    const handleEditPlan = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            duration_months: plan.duration_months,
            is_active: plan.is_active,
        });
        setIsEditDialogOpen(true);
    };

    const handleSavePlan = async () => {
        if (!editingPlan) return;

        try {
            const { error } = await supabase
                .from('plans')
                .update({
                    name: formData.name,
                    price: formData.price,
                    duration_months: formData.duration_months,
                    is_active: formData.is_active,
                })
                .eq('id', editingPlan.id);

            if (error) throw error;

            toast.success("Plano atualizado com sucesso");
            setIsEditDialogOpen(false);
            fetchPlans();
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error("Erro ao atualizar plano");
        }
    };

    const handleToggleActive = async (planId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('plans')
                .update({ is_active: !currentStatus })
                .eq('id', planId);

            if (error) throw error;

            toast.success(`Plano ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
            fetchPlans();
        } catch (error) {
            console.error('Error toggling plan:', error);
            toast.error("Erro ao atualizar status do plano");
        }
    };

    const getPlanBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Ativo</Badge>
        ) : (
            <Badge variant="secondary">Inativo</Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Carregando planos...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        Gerenciamento de Planos
                    </h1>
                    <p className="text-muted-foreground">
                        Edite valores, ative/desative planos e crie promoções
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Plano
                </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id} className="relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {plan.name}
                                        {getPlanBadge(plan.is_active)}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {plan.duration_months} {plan.duration_months === 1 ? 'mês' : 'meses'}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditPlan(plan)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Price */}
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-3xl font-bold">R$ {plan.price}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {plan.duration_months === 1 ? 'por mês' : `total`}
                                    </p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Duração: {plan.duration_months} {plan.duration_months === 1 ? 'mês' : 'meses'}
                                </span>
                            </div>

                            {/* Toggle Active */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Label htmlFor={`active-${plan.id}`} className="text-sm">
                                    {plan.is_active ? 'Plano ativo' : 'Plano inativo'}
                                </Label>
                                <Switch
                                    id={`active-${plan.id}`}
                                    checked={plan.is_active}
                                    onCheckedChange={() => handleToggleActive(plan.id, plan.is_active)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Plano</DialogTitle>
                        <DialogDescription>
                            Altere as informações do plano {editingPlan?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Plano</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Mensal"
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Valor (R$)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="Ex: 30.00"
                            />
                        </div>
                        <div>
                            <Label htmlFor="duration">Duração (meses)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration_months}
                                onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                                placeholder="Ex: 1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">Plano ativo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSavePlan}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Promotions Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Promoções</CardTitle>
                    <CardDescription>
                        Crie códigos promocionais e descontos especiais
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                                Funcionalidade de promoções em desenvolvimento
                            </p>
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Promoção
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

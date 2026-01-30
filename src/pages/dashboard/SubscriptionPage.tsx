import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Calendar, Check, Loader2 } from "lucide-react";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

interface Subscription {
  id: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  plans: {
    name: string;
    price: number;
    duration_months: number;
    type: string;
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchPayments();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    setSubscription(data);
    setLoading(false);
  };

  const fetchPayments = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setPayments(data || []);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Minha Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e pagamentos</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{subscription.plans?.name}</h3>
                  <p className="text-muted-foreground">
                    {formatCurrency(subscription.plans?.price || 0)}
                    {subscription.plans?.duration_months === 1 && "/mês"}
                    {subscription.plans?.duration_months === 6 && "/semestre"}
                    {subscription.plans?.duration_months === 12 && "/ano"}
                  </p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Check className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Início</p>
                  <p className="font-medium">
                    {subscription.starts_at
                      ? format(new Date(subscription.starts_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Próxima renovação</p>
                  <p className="font-medium">
                    {subscription.ends_at
                      ? format(new Date(subscription.ends_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/select-plan">Alterar plano</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Você não possui um plano ativo</p>
              <Button asChild>
                <Link to="/select-plan">Escolher um plano</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Seus últimos pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum pagamento registrado
            </p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.paid_at
                          ? format(new Date(payment.paid_at), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })
                          : "Pendente"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={payment.status === "paid" ? "secondary" : "outline"}
                  >
                    {payment.status === "paid" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
